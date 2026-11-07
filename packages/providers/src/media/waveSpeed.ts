const rules = [
  {
    type: "input",
    field: "apiKey" as const,
    title: "API Key",
    value: "",
    props: { type: "password", showPassword: true, autocomplete: "off" },
  },
] as const;

const version = "1.0.0";
const baseUrl = "https://api.wavespeed.ai/api/v3";

type VideoTaskData = {
  kind: "media";
  taskId: string;
  model: string;
  deadline: number;
};

type ReferencedVideoRequest = VideoRequest & {
  referenceOrder?: ({ type: "image" | "video" | "audio"; index: number } | { type: "firstFrame" | "lastFrame" | "text" })[];
};

// Each model family exposes separate endpoints; the generation mode picks the suffix.
const families: Record<string, {
  labels: Record<"image" | "video" | "audio", string>;
  references: Record<"image" | "video" | "audio", string>;
  generateAudio: boolean;
}> = {
  "bytedance/seedance-2.5": {
    labels: { image: "@Image ", video: "@Video ", audio: "@Audio " },
    references: { image: "reference_images", video: "reference_videos", audio: "reference_audios" },
    generateAudio: true,
  },
  // ACT: WaveSpeed only documents @Image1 for Kling; @Video1/@Audio1 follow the same pattern.
  "kwaivgi/kling-v4.0": {
    labels: { image: "@Image", video: "@Video", audio: "@Audio" },
    references: { image: "images", video: "videos", audio: "audios" },
    generateAudio: false,
  },
  "alibaba/wan-3.0": {
    labels: { image: "Image ", video: "Video ", audio: "Audio " },
    references: { image: "reference_images", video: "reference_videos", audio: "reference_audios" },
    generateAudio: true,
  },
};

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("WaveSpeed 响应格式错误");
  return value as Record<string, unknown>;
}

function wait(signal: AbortSignal, ms: number) {
  signal.throwIfAborted();
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
}

function apiKeyOf(context: ProviderContext<{ apiKey?: string }>) {
  const apiKey = context.config.apiKey?.trim();
  if (!apiKey) throw new Error("请填写 API Key");
  return apiKey;
}

async function callApi(context: ProviderContext, apiKey: string, path: string, signal?: AbortSignal, body?: unknown) {
  const response = await context.tool.fetch(`${baseUrl}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { Authorization: `Bearer ${apiKey}`, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal,
  });
  if (!response.ok) throw new Error(`请求失败：HTTP ${response.status} ${context.tool.errorMessage(await response.text().catch(() => ""))}`.trim());
  const result = object(await response.json());
  if (result.code !== 200) throw new Error(context.tool.errorMessage(result) || "WaveSpeed 请求失败");
  return object(result.data);
}

/** Upload non-URL media through the direct upload flow and return its download URL. */
async function uploadMedia(context: ProviderContext, apiKey: string, input: MediaInput, signal: AbortSignal): Promise<string> {
  if (input.type === "url") return input.url;
  const bytes = input.type === "binary" ? input.data : new Uint8Array(Buffer.from(input.data.replace(/^data:[^,]*,/, ""), "base64"));
  const extension = input.mimeType.split("/")[1]?.split(/[;+]/)[0] || "bin";
  const data = await callApi(context, apiKey, "/media/uploads", signal, {
    filename: input.name || `upload.${extension}`,
    size: bytes.byteLength,
    content_type: input.mimeType,
  });
  const upload = object(data.upload);
  if (typeof upload.url !== "string" || typeof data.download_url !== "string") throw new Error("素材上传未返回地址");
  const response = await context.tool.fetch(upload.url, {
    method: typeof upload.method === "string" ? upload.method : "PUT",
    headers: upload.headers && typeof upload.headers === "object" ? upload.headers as Record<string, string> : { "Content-Type": input.mimeType },
    body: new Blob([new Uint8Array(bytes)], { type: input.mimeType }),
    signal,
  });
  if (!response.ok) throw new Error(`素材上传失败：HTTP ${response.status}`);
  return data.download_url;
}

function videoPrompt(request: ReferencedVideoRequest, mode: VideoMode, labels: Record<"image" | "video" | "audio", string>) {
  return request.prompt.replace(/\{\{ref (\d+)\}\}/g, (marker, number: string) => {
    const reference = request.referenceOrder?.[Number(number) - 1];
    if (!reference) throw new Error(`引用标记 ${marker} 缺少素材映射，请更新视频节点或提供 referenceOrder`);
    if (reference.type === "text") return `reference ${Number(number)}`;
    if (reference.type === "firstFrame" || reference.type === "lastFrame") {
      if (Array.isArray(mode) || !request[reference.type]) throw new Error(`引用标记 ${marker} 对应的首尾帧未提交`);
      return reference.type === "firstFrame" ? "the first frame" : "the last frame";
    }
    if (!("index" in reference)) throw new Error(`引用标记 ${marker} 的素材类型无效`);
    const media = { image: request.images, video: request.videos, audio: request.audios };
    if (!Array.isArray(mode) || !Number.isSafeInteger(reference.index) || reference.index < 0 || !media[reference.type]?.[reference.index]) {
      throw new Error(`引用标记 ${marker} 对应的素材未提交，请重新选择引用`);
    }
    return `${labels[reference.type]}${reference.index + 1}`;
  });
}

async function waitForVideo(context: ProviderContext, apiKey: string, data: VideoTaskData, signal: AbortSignal): Promise<MediaAsset[]> {
  while (true) {
    const result = await callApi(context, apiKey, `/predictions/${encodeURIComponent(data.taskId)}/result`, signal);
    const status = String(result.status ?? "").toLowerCase();
    if (status === "completed") {
      const url = Array.isArray(result.outputs) ? result.outputs[0] : undefined;
      if (typeof url !== "string" || !url) throw new Error("未返回生成结果");
      return [{ mediaType: "video", type: "url", url }];
    }
    if (["failed", "cancelled", "timeout", "deleted"].includes(status)) {
      throw Object.assign(new Error(context.tool.errorMessage(result.error) || `生成失败：${status}`), { code: "MEDIA_TASK_FAILED" });
    }
    await wait(signal, 3000);
  }
}

export default {
  id: "waveSpeed",
  label: "WaveSpeed",
  version,
  readme: `## WaveSpeed
WaveSpeedAI 提供 Seedance、Kling、Wan 等视频模型的统一异步 API。

🔗 在 [WaveSpeed 控制台](https://wavespeed.ai/accesskey) 创建 API Key。`,
  rules,
  models: [
    {
      id: "bytedance/seedance-2.5",
      label: "Seedance 2.5",
      type: "video",
      mode: ["text", "endFrameOptional", ["imageReference:30", "videoReference:10", "audioReference:10"]],
      audio: "optional",
      durationResolutionMap: [{ duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], resolution: ["480p", "720p", "1080p", "4k"] }],
    },
    {
      id: "kwaivgi/kling-v4.0",
      label: "Kling v4.0",
      type: "video",
      mode: ["text", "endFrameOptional", ["imageReference:10", "videoReference:5", "audioReference:3"]],
      durationResolutionMap: [{ duration: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], resolution: ["720p", "1080p"] }],
    },
    {
      id: "alibaba/wan-3.0",
      label: "Wan 3.0",
      type: "video",
      mode: ["text", "endFrameOptional", ["imageReference:10", "videoReference:5", "audioReference:5"]],
      audio: "optional",
      durationResolutionMap: [{ duration: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], resolution: ["480p", "720p", "1080p"] }],
    },
  ] satisfies ProviderModel[],
  async getBalance() {
    const data = await callApi(this, apiKeyOf(this), "/balance", this.signal);
    if (typeof data.balance !== "number") throw new Error("未返回余额");
    return { balance: data.balance, unit: "USD" };
  },
  async generateVideo(request: ReferencedVideoRequest): Promise<MediaAsset[]> {
    const apiKey = apiKeyOf(this);
    const family = families[request.model];
    if (!family) throw new Error(`不支持的模型：${request.model}`);
    const mode = request.mode ?? (request.videos?.length || request.audios?.length || (request.images?.length ?? 0) > 1 ? []
      : request.firstFrame || request.images?.length ? "endFrameOptional" : "text");
    const prompt = videoPrompt(request, mode, family.labels);
    // ACT: one generation waits at most 30 minutes.
    const deadline = Date.now() + 30 * 60_000;
    const signal = AbortSignal.any([AbortSignal.timeout(30 * 60_000), ...(this.signal ? [this.signal] : [])]);

    const body: Record<string, unknown> = { prompt, duration: request.duration, resolution: request.resolution };
    if (request.ratio) body.aspect_ratio = request.ratio;
    if (family.generateAudio && typeof request.generateAudio === "boolean") body.generate_audio = request.generateAudio;
    let endpoint = "text-to-video";
    if (Array.isArray(mode)) {
      endpoint = "reference-to-video";
      for (const type of ["image", "video", "audio"] as const) {
        const inputs = { image: request.images, video: request.videos, audio: request.audios }[type] ?? [];
        if (inputs.length) body[family.references[type]] = await Promise.all(inputs.map(input => uploadMedia(this, apiKey, input, signal)));
      }
    } else if (mode !== "text") {
      const firstFrame = request.firstFrame ?? request.images?.[0];
      const lastFrame = request.lastFrame ?? (request.firstFrame ? undefined : request.images?.[1]);
      if (!firstFrame) throw new Error("请提供首帧图片");
      endpoint = "image-to-video";
      body.image = await uploadMedia(this, apiKey, firstFrame, signal);
      if (lastFrame) body.last_image = await uploadMedia(this, apiKey, lastFrame, signal);
    }

    // ACT: record the uncertain state before submitting; a lost response must not resubmit a billed task.
    await this.saveTaskData?.({ kind: "submitting", model: request.model, deadline });
    const data = await callApi(this, apiKey, `/${request.model}/${endpoint}`, signal, body);
    if (typeof data.id !== "string" || !data.id) throw new Error("未返回任务ID");
    const task: VideoTaskData = { kind: "media", taskId: data.id, model: request.model, deadline };
    await this.saveTaskData?.(task);
    return waitForVideo(this, apiKey, task, signal);
  },
  async resumeTask(data: ProviderTaskData): Promise<MediaAsset[]> {
    if (data.kind === "submitting") throw new Error("上次提交结果未知，不能自动重新提交，请先在供应商平台确认任务");
    if (data.kind !== "media" || typeof data.taskId !== "string" || !data.taskId || typeof data.model !== "string"
      || typeof data.deadline !== "number" || !Number.isFinite(data.deadline)) {
      throw new Error("WaveSpeed 任务恢复数据无效");
    }
    const signal = AbortSignal.any([AbortSignal.timeout(30 * 60_000), ...(this.signal ? [this.signal] : [])]);
    return waitForVideo(this, apiKeyOf(this), data as VideoTaskData, signal);
  },
} satisfies ProviderDefinition<typeof rules>;
