import { homedir } from "node:os";
import { delimiter, join } from "node:path";
import type { EdgeTtsOptions } from "@toonflow/providers";
import { prepareWorkspaceFfmpeg } from "@/utils/ffmpeg";

const maxTextLength = 20000;
const outputFormats = {
  wav: { args: ["-f", "wav"], mimeType: "audio/wav" },
  pcm: { args: ["-f", "s16le", "-acodec", "pcm_s16le"], mimeType: "audio/pcm" },
  ogg_opus: { args: ["-f", "ogg", "-acodec", "libopus"], mimeType: "audio/ogg" },
  mp3: { args: ["-f", "mp3"], mimeType: "audio/mpeg" },
} as const;

// ACT: Local CLI failures are final, so MEDIA_TASK_FAILED releases the task instead of asking the user to recheck a provider.
function invalid(message: string): never {
  throw Object.assign(new Error(message), { status: 400, code: "MEDIA_TASK_FAILED" });
}

async function run(command: string, args: string[], input: Uint8Array | string, signal?: AbortSignal) {
  const child = Bun.spawn([command, ...args], { stdin: new Blob([input]), stdout: "pipe", stderr: "pipe", signal });
  const [output, errorText, code] = await Promise.all([new Response(child.stdout).bytes(), new Response(child.stderr).text(), child.exited]);
  signal?.throwIfAborted();
  if (code !== 0) throw Object.assign(new Error(`${command} 执行失败：${errorText.trim().split("\n").at(-1) || `退出码 ${code}`}`), { code: "MEDIA_TASK_FAILED" });
  return output;
}

/**
 * Runs the locally installed edge-tts CLI (`pip install edge-tts`); only this fixed binary is executed.
 * ACT: edge-tts only emits 24 kHz mp3; other formats or sample rates are transcoded through the FFmpeg plugin.
 */
export async function synthesizeEdgeTts(options: EdgeTtsOptions, signal?: AbortSignal) {
  const text = typeof options.text === "string" ? options.text.trim() : "";
  if (!text || text.length > maxTextLength) invalid("朗读文本不能为空且不超过 20000 字");
  // Edge returns no audio for text without any letter or digit, e.g. "…" or "—".
  if (!/[\p{L}\p{N}]/u.test(text)) invalid("朗读文本需包含可朗读的文字");
  if (typeof options.voice !== "string" || !/^[A-Za-z]{2,3}(-[A-Za-z0-9]+){2,4}$/.test(options.voice)) invalid("Edge TTS 音色无效");
  const format = options.format ?? "mp3";
  if (!Object.hasOwn(outputFormats, format)) invalid("Edge TTS 输出格式仅支持 wav、mp3、pcm、ogg_opus");
  const percent = (value: number | undefined, name: string) => {
    if (value === undefined) return [];
    if (!Number.isInteger(value) || value < -100 || value > 200) invalid("Edge TTS 语速或音量无效");
    return [`--${name}=${value >= 0 ? "+" : ""}${value}%`];
  };
  const sampleRate = options.sampleRate ?? 24000;
  if (!Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 48000) invalid("Edge TTS 采样率无效");

  // ACT: pip installs user scripts into ~/.local/bin, which a desktop-launched server may not have on PATH.
  const command = Bun.which("edge-tts", { PATH: [process.env.PATH, join(homedir(), ".local", "bin")].filter(Boolean).join(delimiter) });
  if (!command) throw Object.assign(new Error("未找到 edge-tts 命令，请先运行 pip install edge-tts 安装"), { status: 424 });
  const args = ["--voice", options.voice, ...percent(options.rate, "rate"), ...percent(options.volume, "volume"), "--file", "-"];
  // ACT: Edge's unofficial endpoint answers without audio in throttling bursts lasting seconds; 5 tries with 1/2/4/8 s backoff (~15 s ceiling), no jitter or cross-request queue.
  let mp3: Uint8Array;
  for (let attempt = 1; ; attempt++) {
    try { mp3 = await run(command, args, text, signal); break; }
    catch (error) {
      if (attempt >= 5 || !(error as Error).message.includes("NoAudioReceived")) throw error;
      await Bun.sleep(2 ** (attempt - 1) * 1000);
      signal?.throwIfAborted();
    }
  }
  if (!mp3.byteLength) throw new Error("edge-tts 未返回音频");
  if (format === "mp3" && sampleRate === 24000) return { data: mp3, mimeType: outputFormats.mp3.mimeType };

  const { ffmpeg } = await prepareWorkspaceFfmpeg(signal);
  const output = outputFormats[format as keyof typeof outputFormats];
  const data = await run(ffmpeg, ["-hide_banner", "-loglevel", "error", "-i", "pipe:0", "-ac", "1", "-ar", String(sampleRate), ...output.args, "pipe:1"], mp3, signal);
  return { data, mimeType: output.mimeType };
}
