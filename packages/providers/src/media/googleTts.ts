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
const endpoint = "https://texttospeech.googleapis.com/v1/text:synthesize";
// Google rejects text over 5000 bytes per request (4000 for Gemini); Vietnamese diacritics take 2-3 UTF-8 bytes per character.
const maxChunkBytes = 4800;
const geminiMaxBytes = 4000;
const geminiModel = "gemini-2.5-flash-tts";
const defaultVoices: Record<string, string> = { vi: "vi-VN-Wavenet-A", en: "en-US-Wavenet-F" };
// Gemini needs a full BCP-47 code; the audio node sends short codes such as "vi".
const geminiLanguages: Record<string, string> = { vi: "vi-VN", en: "en-US", zh: "cmn-CN" };

/** Splits text at sentence boundaries into chunks that fit the per-request byte limit. */
function chunkText(text: string, maxBytes: number) {
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let current = "";
  for (const { segment } of new Intl.Segmenter(undefined, { granularity: "sentence" }).segment(text)) {
    if (encoder.encode(current + segment).byteLength <= maxBytes) {
      current += segment;
      continue;
    }
    if (current.trim()) chunks.push(current);
    current = "";
    // ACT: A single sentence over the limit is cut by characters, which may split mid-word; real scripts rarely hit this.
    for (const char of segment) {
      if (encoder.encode(current + char).byteLength > maxBytes) {
        chunks.push(current);
        current = "";
      }
      current += char;
    }
  }
  if (current.trim()) chunks.push(current);
  return chunks;
}

/** Returns the PCM payload of a WAV file and its fmt chunk. */
function readWav(wav: Uint8Array) {
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  let format: Uint8Array | undefined;
  for (let offset = 12; offset + 8 <= wav.byteLength;) {
    const id = String.fromCharCode(...wav.subarray(offset, offset + 4));
    const size = view.getUint32(offset + 4, true);
    if (id === "fmt ") format = wav.subarray(offset + 8, offset + 8 + size);
    if (id === "data" && format) return { format, data: wav.subarray(offset + 8, Math.min(offset + 8 + size, wav.byteLength)) };
    offset += 8 + size + (size % 2);
  }
  throw new Error("Google TTS trả về WAV không hợp lệ");
}

function buildWav(format: Uint8Array, parts: Uint8Array[]) {
  const dataSize = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const wav = new Uint8Array(20 + format.byteLength + 8 + dataSize);
  const view = new DataView(wav.buffer);
  const ascii = (offset: number, value: string) => wav.set([...value].map(char => char.charCodeAt(0)), offset);
  ascii(0, "RIFF");
  view.setUint32(4, wav.byteLength - 8, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, format.byteLength, true);
  wav.set(format, 20);
  let offset = 20 + format.byteLength;
  ascii(offset, "data");
  view.setUint32(offset + 4, dataSize, true);
  offset += 8;
  for (const part of parts) {
    wav.set(part, offset);
    offset += part.byteLength;
  }
  return wav;
}

export default {
  id: "googleTts",
  label: "Google Cloud TTS",
  version,
  readme: `Đọc văn bản bằng [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech/pricing): giọng Standard, WaveNet và Gemini 2.5 Flash TTS.
 \n Miễn phí 4 triệu ký tự/tháng (Standard và WaveNet dùng chung SKU nên nhiều khả năng tính gộp), vượt mức tính $4 / 1 triệu ký tự. Khoảng trắng và xuống dòng đều được tính.
 \n Lấy API Key: bật billing cho project → bật Cloud Text-to-Speech API → Credentials → Create API key → giới hạn key chỉ gọi Text-to-Speech API.
 \n Google không có hạn mức cứng: muốn chắc không vượt free tier, đặt quota ký tự theo ngày trong IAM & Admin → Quotas.
 \n Gemini 2.5 Flash TTS: không có free tier (≈ $0.015 / phút audio), chỉnh phong cách bằng mô tả ở ô "Phong cách đọc" và tag như [sigh], [laughing], [short pause]. Cần quyền aiplatform.endpoints.predict; nếu API key bị từ chối (403) thì cần cấp role roles/aiplatform.user.`,
  rules,
  // Static metadata parsing requires models to be an inline JSON literal.
  models: [
    {
      id: "google-tts",
      label: "Google TTS (Standard / WaveNet)",
      type: "audio",
      rules: [
        {
          type: "select",
          field: "voice",
          title: "Giọng đọc",
          value: "",
          options: [
            { label: "Tự động theo ngôn ngữ", value: "" },
            { label: "WaveNet A (Tiếng Việt, nữ)", value: "vi-VN-Wavenet-A" },
            { label: "WaveNet B (Tiếng Việt, nam)", value: "vi-VN-Wavenet-B" },
            { label: "WaveNet C (Tiếng Việt, nữ)", value: "vi-VN-Wavenet-C" },
            { label: "WaveNet D (Tiếng Việt, nam)", value: "vi-VN-Wavenet-D" },
            { label: "Standard A (Tiếng Việt, nữ)", value: "vi-VN-Standard-A" },
            { label: "Standard B (Tiếng Việt, nam)", value: "vi-VN-Standard-B" },
            { label: "Standard C (Tiếng Việt, nữ)", value: "vi-VN-Standard-C" },
            { label: "Standard D (Tiếng Việt, nam)", value: "vi-VN-Standard-D" },
            { label: "WaveNet F (English, female)", value: "en-US-Wavenet-F" },
            { label: "WaveNet D (English, male)", value: "en-US-Wavenet-D" },
          ],
        },
        {
          type: "inputNumber",
          field: "speed",
          title: "Tốc độ (lần)",
          value: 1,
          props: { min: 0.25, max: 2, step: 0.05 },
        },
      ],
    },
    {
      id: "gemini-2.5-flash-tts",
      label: "Gemini 2.5 Flash TTS (trả phí)",
      type: "audio",
      rules: [
        {
          type: "select",
          field: "voice",
          title: "Giọng đọc",
          value: "Kore",
          options: [
            { label: "Achernar (nữ)", value: "Achernar" },
            { label: "Achird (nam)", value: "Achird" },
            { label: "Algenib (nam)", value: "Algenib" },
            { label: "Algieba (nam)", value: "Algieba" },
            { label: "Alnilam (nam)", value: "Alnilam" },
            { label: "Aoede (nữ)", value: "Aoede" },
            { label: "Autonoe (nữ)", value: "Autonoe" },
            { label: "Callirrhoe (nữ)", value: "Callirrhoe" },
            { label: "Charon (nam)", value: "Charon" },
            { label: "Despina (nữ)", value: "Despina" },
            { label: "Enceladus (nam)", value: "Enceladus" },
            { label: "Erinome (nữ)", value: "Erinome" },
            { label: "Fenrir (nam)", value: "Fenrir" },
            { label: "Gacrux (nữ)", value: "Gacrux" },
            { label: "Iapetus (nam)", value: "Iapetus" },
            { label: "Kore (nữ)", value: "Kore" },
            { label: "Laomedeia (nữ)", value: "Laomedeia" },
            { label: "Leda (nữ)", value: "Leda" },
            { label: "Orus (nam)", value: "Orus" },
            { label: "Pulcherrima (nữ)", value: "Pulcherrima" },
            { label: "Puck (nam)", value: "Puck" },
            { label: "Rasalgethi (nam)", value: "Rasalgethi" },
            { label: "Sadachbia (nam)", value: "Sadachbia" },
            { label: "Sadaltager (nam)", value: "Sadaltager" },
            { label: "Schedar (nam)", value: "Schedar" },
            { label: "Sulafat (nữ)", value: "Sulafat" },
            { label: "Umbriel (nam)", value: "Umbriel" },
            { label: "Vindemiatrix (nữ)", value: "Vindemiatrix" },
            { label: "Zephyr (nữ)", value: "Zephyr" },
            { label: "Zubenelgenubi (nam)", value: "Zubenelgenubi" },
          ],
        },
        {
          type: "input",
          field: "stylePrompt",
          title: "Phong cách đọc",
          value: "",
          props: { type: "textarea", rows: 3, placeholder: "Ví dụ: Đọc như người dẫn phim tài liệu, giọng trầm, chậm rãi" },
        },
        {
          type: "inputNumber",
          field: "speed",
          title: "Tốc độ (lần)",
          value: 1,
          props: { min: 0.25, max: 2, step: 0.05 },
        },
      ],
    },
  ] satisfies ProviderModel[],
  async getPrice(request: ProviderPriceRequest) {
    if (request.type !== "audio") return null;
    const text = request.text?.trim() || request.prompt?.trim();
    if (!text) return null;
    if (request.model === geminiModel) return { price: "≈ $0.015 / phút audio", tips: "Không có free tier: $10 / 1 triệu audio token (25 token/giây) + $0.50 / 1 triệu text token" };
    return { price: `${text.length.toLocaleString("vi-VN")} ký tự`, tips: "Miễn phí 4 triệu ký tự/tháng, sau đó $4 / 1 triệu ký tự" };
  },
  async generateAudio(request: AudioRequest): Promise<MediaAsset[]> {
    const apiKey = this.config.apiKey?.trim();
    if (!apiKey) throw new Error("Vui lòng nhập API Key");
    const text = request.text?.trim() || request.prompt?.trim();
    if (!text) throw new Error("Vui lòng nhập văn bản cần đọc");
    const gemini = request.model === geminiModel;
    // The style prompt comes from the model rule, or from request.prompt when the text to read is passed separately.
    const stylePrompt = gemini ? ((typeof request.other?.stylePrompt === "string" && request.other.stylePrompt.trim()) || (request.text?.trim() ? request.prompt?.trim() : "") || "") : "";
    if (new TextEncoder().encode(stylePrompt).byteLength > geminiMaxBytes) throw new Error("Phong cách đọc tối đa 4000 byte");
    const format = request.format ?? "mp3";
    if (format !== "mp3" && format !== "wav" && format !== "pcm") throw new Error("Google TTS chỉ hỗ trợ định dạng mp3, wav, pcm");
    const other = request.other ?? {};
    const language = (request.language ?? "").split("-")[0]!.toLowerCase();
    const voice = (typeof other.voice === "string" && other.voice) || request.voice || (gemini ? "Kore" : defaultVoices[language] || defaultVoices.en!);
    // Gemini voices are language-independent, so the language comes from the request instead of the voice name.
    const languageCode = gemini ? geminiLanguages[language] ?? "vi-VN" : voice.split("-").slice(0, 2).join("-");
    const speakingRate = typeof other.speed === "number" ? other.speed : request.speed;
    const sampleRateHertz = request.sampleRate ?? 24000;

    // ACT: Chunks are synthesized sequentially as LINEAR16 and joined at PCM level; parallel requests would be faster but burn quota faster under per-minute limits.
    let wavFormat: Uint8Array | undefined;
    const parts: Uint8Array[] = [];
    // ACT: Each Gemini chunk repeats the same prompt and voice; delivery can still drift slightly across chunk boundaries.
    for (const input of chunkText(text, gemini ? geminiMaxBytes : maxChunkBytes)) {
      const response = await this.tool.fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey },
        body: JSON.stringify({
          input: { text: input, ...(stylePrompt ? { prompt: stylePrompt } : {}) },
          voice: { languageCode, name: voice, ...(gemini ? { modelName: geminiModel } : {}) },
          audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz, ...(speakingRate === undefined ? {} : { speakingRate }) },
        }),
      });
      const body = await response.json().catch(() => null) as { audioContent?: string; error?: { message?: string } } | null;
      // A synchronous error response is final, so MEDIA_TASK_FAILED releases the task instead of leaving it to be rechecked.
      if (!response.ok || !body?.audioContent) {
        const message = body?.error?.message || this.tool.errorMessage(body) || `Google TTS lỗi HTTP ${response.status}`;
        const hint = gemini && response.status === 403 ? "\nGemini-TTS cần quyền aiplatform.endpoints.predict (role roles/aiplatform.user); API key này có thể không đủ quyền." : "";
        throw Object.assign(new Error(message + hint), { status: response.status, code: "MEDIA_TASK_FAILED" });
      }
      const wav = readWav(Uint8Array.from(atob(body.audioContent), char => char.charCodeAt(0)));
      wavFormat ??= wav.format;
      parts.push(wav.data);
    }

    const wav = buildWav(wavFormat!, parts);
    if (format === "wav") return [{ mediaType: "audio", type: "binary", data: wav, mimeType: "audio/wav" }];
    if (format === "pcm") return [{ mediaType: "audio", type: "binary", data: readWav(wav).data, mimeType: "audio/pcm" }];
    const { data, mimeType } = await this.tool.audio.convert(wav, { format: "mp3" });
    return [{ mediaType: "audio", type: "binary", data, mimeType }];
  },
} satisfies ProviderDefinition<typeof rules>;
