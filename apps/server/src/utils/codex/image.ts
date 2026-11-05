import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, readdir, readFile, rm, writeFile } from "@toonflow/file";
import { t } from "@/lib/i18n";
import { codexExecutable, codexHome, requireCodexImage } from "@/utils/codex/auth";

export const codexMediaProviderId = "codex";
export const codexImageModel = { id: "codex-image", label: "Codex Image" } as const;
export const codexImageRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"];
// 仅提供运行时所需的供应商元数据；generateImage 由宿主在加载后替换为本机 codex 调用。
export const codexMediaSource = `export default ${JSON.stringify({
  id: codexMediaProviderId, label: "Codex", rules: [],
  models: [{ ...codexImageModel, type: "image", mode: ["text", "singleImage", "multiReference"], imageRatios: codexImageRatios }],
})};`;

const imageExtensions: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };

async function inputBytes(input: MediaInput, signal?: AbortSignal) {
  if (input.type === "binary") return input.data;
  if (input.type === "base64") return Buffer.from(input.data.replace(/^data:[^,]*,/, ""), "base64");
  const response = await fetch(input.url, { signal });
  if (!response.ok) throw new Error(t`读取参考图失败（HTTP ${response.status}）`);
  return new Uint8Array(await response.arrayBuffer());
}

function imagePrompt(request: ImageRequest, count: number, references: number) {
  return [
    "You are an image generation backend. Use your built-in image generation tool exactly as requested.",
    "Do not run shell commands, do not read or modify files, and do not ask questions.",
    `Generate ${count} image${count > 1 ? "s" : ""}${references ? `, using the ${references} attached image${references > 1 ? "s" : ""} as reference` : ""}.`,
    request.ratio ? `Aspect ratio: ${request.ratio}.` : "",
    request.size ? `Target size: ${request.size}.` : "",
    request.quality ? `Quality: ${request.quality}.` : "",
    `Image description:\n${request.prompt}`,
    "After the image generation finishes, reply with only: DONE",
  ].filter(Boolean).join("\n");
}

/** 调用本机 codex exec 生成图片；Codex 将结果保存在 CODEX_HOME/generated_images/<thread_id>/。 */
export async function generateCodexImage(request: ImageRequest, signal?: AbortSignal): Promise<MediaAsset[]> {
  requireCodexImage();
  if (!request.prompt?.trim()) throw Object.assign(new Error("请输入图片描述"), { status: 400 });
  const count = Math.min(Math.max(Math.trunc(request.n ?? 1), 1), 4);
  const workDirectory = await mkdtemp(join(tmpdir(), "superflowCodex-"));
  try {
    const imageArgs: string[] = [];
    for (const [index, image] of (request.images ?? []).entries()) {
      const path = join(workDirectory, `reference${index + 1}.${imageExtensions[image.mimeType?.toLowerCase() ?? ""] ?? "png"}`);
      await writeFile(path, await inputBytes(image, signal));
      imageArgs.push("-i", path);
    }
    const child = Bun.spawn([
      codexExecutable()!, "exec", "--json", "--ephemeral", "--skip-git-repo-check", "-s", "read-only", "-C", workDirectory,
      ...imageArgs, "--", imagePrompt(request, count, imageArgs.length / 2),
    ], { stdin: "ignore", stdout: "pipe", stderr: "pipe", windowsHide: true });
    const abort = () => child.kill();
    signal?.addEventListener("abort", abort, { once: true });
    // ACT: 单次生成最长等待 10 分钟；超时直接结束进程，不做自动重试。
    const timer = setTimeout(abort, 10 * 60_000);
    let threadId = "";
    let lastMessage = "";
    let failure = "";
    try {
      const output = await new Response(child.stdout).text();
      for (const line of output.split("\n")) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line) as { type?: string; thread_id?: string; item?: { type?: string; text?: string }; error?: { message?: string }; message?: string };
          if (event.type === "thread.started" && event.thread_id) threadId = event.thread_id;
          if (event.type === "item.completed" && event.item?.type === "agent_message") lastMessage = event.item.text ?? "";
          if (event.type === "turn.failed" || event.type === "error") failure = event.error?.message ?? event.message ?? failure;
        } catch {
          // 非 JSON 行属于 Codex 的普通日志，忽略即可。
        }
      }
      const exitCode = await child.exited;
      signal?.throwIfAborted();
      if (exitCode !== 0 && !threadId) {
        const stderr = (await new Response(child.stderr).text()).trim().split("\n").slice(-3).join(" ");
        throw new Error(t`Codex 运行失败（退出码 ${exitCode}）：${failure || stderr}`);
      }
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
    if (!threadId) throw new Error("Codex 未返回会话 ID，无法定位生成的图片");
    const outputDirectory = join(codexHome(), "generated_images", threadId);
    const files = (await readdir(outputDirectory).catch(() => [] as string[]))
      .filter(name => /\.(png|jpe?g|webp)$/i.test(name)).sort();
    if (!files.length) {
      const detail = failure || lastMessage.slice(0, 200);
      throw new Error(detail ? t`Codex 未生成图片：${detail}` : "Codex 未生成图片");
    }
    return Promise.all(files.map(async name => ({
      type: "binary" as const,
      data: new Uint8Array(await readFile(join(outputDirectory, name))),
      mimeType: /\.png$/i.test(name) ? "image/png" : /\.webp$/i.test(name) ? "image/webp" : "image/jpeg",
      name,
      mediaType: "image" as const,
    })));
  } finally {
    // 只清理本次写入的本地临时参考图目录；Codex 保存的生成结果保留在 CODEX_HOME 中。
    await rm(workDirectory, { recursive: true, force: true });
  }
}
