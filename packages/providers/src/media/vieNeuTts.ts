const rules = [
  {
    type: "input",
    field: "baseUrl" as const,
    title: "Địa chỉ server",
    value: "http://localhost:8000/v1",
    props: { placeholder: "http://localhost:8000/v1" },
  },
  {
    type: "input",
    field: "apiKey" as const,
    title: "API Key (VIENEU_API_KEY, để trống nếu không đặt)",
    value: "",
    props: { type: "password", showPassword: true, autocomplete: "off" },
  },
] as const;

const version = "1.0.0";
const sampleRates = [48000, 24000, 16000, 8000];

// The server streams a WAV header with unknown (0xFFFFFFFF) sizes; patch them so WAV parsers accept the finished file.
function finalizeWav(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  view.setUint32(4, data.byteLength - 8, true);
  view.setUint32(40, data.byteLength - 44, true);
  return data;
}

export default {
  id: "vieNeuTts",
  label: "VieNeu TTS (local)",
  version,
  readme: `Đọc tiếng Việt bằng [VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS) qua API tương thích OpenAI chạy trên máy của bạn.
 \n Khởi chạy server: \`uv run python -m apps.openai_speech\` hoặc \`docker compose -f docker/docker-compose.yml --profile api-cpu up\` (mặc định cổng 8000).
 \n Giọng tự thêm qua \`POST /v1/voices\` có thể dùng bằng cách nhập đúng tên giọng vào mục giọng đọc của node. Server chỉ trả wav/pcm; mp3 được chuyển đổi trong ứng dụng.`,
  rules,
  // Static metadata parsing requires models to be an inline JSON literal.
  models: [
    {
      id: "vieneu-v3-turbo",
      label: "VieNeu v3 Turbo",
      type: "audio",
      rules: [
        {
          type: "select",
          field: "voice",
          title: "Giọng đọc",
          value: "",
          options: [
            { label: "Mặc định của server", value: "" },
            { label: "Hải Đăng (nam, Bắc, tự nhiên)", value: "Hải Đăng" },
            { label: "Mai Anh (nữ, Bắc, tin tức)", value: "Mai Anh" },
            { label: "Trúc Ly (nữ, Bắc, tự nhiên)", value: "Trúc Ly" },
            { label: "Thiện Minh (nam, Bắc, kể chuyện)", value: "Thiện Minh" },
            { label: "Adam bựa (nam, Bắc, tự nhiên)", value: "Adam bựa" },
            { label: "Thiền Tâm Đức (nam, Bắc, kể chuyện)", value: "Thiền Tâm Đức" },
            { label: "Ngọc Huyền (nữ, Bắc, tự nhiên)", value: "Ngọc Huyền" },
            { label: "Minh Đức (nam, Bắc, tin tức)", value: "Minh Đức" },
            { label: "Phạm Tuyên (nam, Bắc, tự nhiên)", value: "Phạm Tuyên" },
            { label: "Xuân Vĩnh (nam, Bắc, tự nhiên)", value: "Xuân Vĩnh" },
            { label: "Thanh Bình (nam, Bắc, kể chuyện)", value: "Thanh Bình" },
            { label: "Ngọc Linh (nữ, Bắc, kể chuyện)", value: "Ngọc Linh" },
            { label: "Đoan Trang (nữ, Bắc, tự nhiên)", value: "Đoan Trang" },
            { label: "Quỳnh Anh (nữ, Bắc, đọc truyện)", value: "Quỳnh Anh" },
            { label: "Quốc Tuấn (nam, Bắc, tự nhiên)", value: "Quốc Tuấn" },
            { label: "Quang Sơn (nam, Trung, tự nhiên)", value: "Quang Sơn" },
            { label: "Ngọc Trân (nữ, Trung, tự nhiên)", value: "Ngọc Trân" },
            { label: "Thùy Dung (nữ, Nam, tin tức)", value: "Thùy Dung" },
            { label: "Thái Sơn (nam, Nam, kể chuyện)", value: "Thái Sơn" },
            { label: "Thục Đoan (nữ, Nam, kể chuyện)", value: "Thục Đoan" },
            { label: "Minh Triết (nam, Nam, tin tức)", value: "Minh Triết" },
            { label: "Mỹ Duyên (nữ, Nam, đọc truyện)", value: "Mỹ Duyên" },
            { label: "Đức Trí (nam, Nam, đọc truyện)", value: "Đức Trí" },
            { label: "Kim Thanh (nữ, Nam, đọc truyện)", value: "Kim Thanh" },
            { label: "Adam (nam, Nam, tự nhiên)", value: "Adam" },
          ],
        },
        {
          type: "inputNumber",
          field: "temperature",
          title: "Temperature",
          value: 0.8,
          props: { min: 0, max: 2, step: 0.1 },
        },
      ],
    },
  ] satisfies ProviderModel[],
  async generateAudio(request: AudioRequest): Promise<MediaAsset[]> {
    const text = request.text?.trim() || request.prompt?.trim();
    if (!text) throw new Error("Vui lòng nhập văn bản cần đọc");
    const format = request.format || "wav";
    if (format !== "wav" && format !== "mp3" && format !== "pcm") throw new Error(`VieNeu TTS không hỗ trợ định dạng ${format}, hãy chọn wav, mp3 hoặc pcm`);
    const other = request.other ?? {};
    const voice = (typeof other.voice === "string" && other.voice) || request.voice || undefined;
    const temperature = typeof other.temperature === "number" ? other.temperature : undefined;
    // Unsupported rates are synthesized natively and resampled locally below.
    const sampleRate = request.sampleRate && sampleRates.includes(request.sampleRate) ? request.sampleRate : undefined;
    if (format === "pcm" && request.sampleRate && !sampleRate) throw new Error(`Định dạng pcm chỉ hỗ trợ tần số ${sampleRates.join(", ")} Hz`);
    const baseUrl = this.config.baseUrl.trim().replace(/\/+$/, "");
    if (!baseUrl) throw new Error("Vui lòng cấu hình địa chỉ server VieNeu TTS");
    const apiKey = this.config.apiKey.trim();
    const response = await this.tool.fetch(`${baseUrl}/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify({ model: request.model, input: text, voice, response_format: format === "pcm" ? "pcm" : "wav", sample_rate: sampleRate, temperature }),
      signal: this.signal,
    });
    if (!response.ok) throw new Error(`VieNeu TTS lỗi HTTP ${response.status}: ${this.tool.errorMessage(await response.text())}`);
    const data = new Uint8Array(await response.arrayBuffer());
    if (data.byteLength <= 44) throw new Error("VieNeu TTS không trả về dữ liệu âm thanh");
    if (format === "pcm") return [{ mediaType: "audio", type: "binary", data, mimeType: "audio/pcm" }];
    const wav = finalizeWav(data);
    if (format === "wav" && (sampleRate || !request.sampleRate)) return [{ mediaType: "audio", type: "binary", data: wav, mimeType: "audio/wav" }];
    const converted = await this.tool.audio.convert(wav, { format, sampleRate: request.sampleRate, bitrateKbps: request.bitrateKbps });
    return [{ mediaType: "audio", type: "binary", ...converted }];
  },
} satisfies ProviderDefinition<typeof rules>;
