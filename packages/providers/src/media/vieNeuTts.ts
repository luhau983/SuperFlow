const rules = [
  {
    type: "input",
    field: "apiKey" as const,
    title: "API Key",
    value: "",
    props: { type: "password", showPassword: true, autocomplete: "off", placeholder: "vn_sk_..." },
  },
  {
    type: "input",
    field: "baseUrl" as const,
    title: "Địa chỉ API",
    value: "https://api.vieneu.io/api/v1",
    props: { placeholder: "https://api.vieneu.io/api/v1" },
  },
] as const;

const version = "2.1.0";
const formats: Record<string, string> = { wav: "wav", mp3: "mp3", pcm: "pcm", ogg_opus: "opus" };

function baseUrl(config: ProviderConfig<typeof rules>) {
  const url = config.baseUrl.trim().replace(/\/+$/, "");
  if (!url) throw new Error("Vui lòng cấu hình địa chỉ API VieNeu");
  return url;
}

function authHeaders(config: ProviderConfig<typeof rules>) {
  const apiKey = config.apiKey.trim();
  if (!apiKey) throw new Error("Vui lòng cấu hình API Key VieNeu");
  return { Authorization: `Bearer ${apiKey}` };
}

export default {
  id: "vieNeuTts",
  label: "VieNeu TTS",
  version,
  readme: `Đọc tiếng Việt bằng [VieNeu Cloud API](https://docs.vieneu.io/docs/cloud-api/overview/) (engine v4, 48 kHz).
 \n Lấy API Key ở trang Developer của [vieneu.io](https://vieneu.io). Key \`vn_test_\` giới hạn 100 từ mỗi lần gọi.
 \n Chi phí: số ký tự (tối thiểu 50) × hệ số engine × hệ số toàn cục, xem \`GET /v1/engines\`. Giọng đọc có thể chọn từ danh sách hoặc gõ tên bất kỳ giọng nào trong [catalog](https://api.vieneu.io/api/v1/voices?engine=v4), kể cả giọng clone (\`clone_...\`) tạo trên web Studio.`,
  rules,
  // Static metadata parsing requires models to be an inline JSON literal.
  models: [
    {
      id: "vieneu-v4",
      label: "VieNeu v4",
      type: "audio",
      rules: [
        {
          type: "select",
          field: "voice",
          title: "Giọng đọc",
          value: "",
          // ACT: The catalog has 700+ voices; list a curated subset and let users type any other id or clone_ id.
          props: { filterable: true, allowCreate: true, defaultFirstOption: true },
          options: [
            { label: "Mặc định của VieNeu", value: "" },
            // Featured voices from the vieneu.io homepage demo.
            { label: "Nhật Phong (nam, Bắc, trẻ trung dễ gần)", value: "Nhật Phong" },
            { label: "Ngọc Lan (nữ, Nam, trầm dịu dàng)", value: "Ngọc Lan" },
            { label: "Trâm Anh (nữ, miền Tây, thân thương)", value: "Trâm Anh" },
            { label: "Trung Dũng (nam, Trung - Bình Định, gần gũi)", value: "Trung Dũng" },
            { label: "Thành Sen (nữ, Trung - Hà Tĩnh, gần gũi)", value: "Thành Sen" },
            { label: "Bảo Long (nam, Bắc, trầm ấm)", value: "Bảo Long" },
            { label: "Bích Ngọc (nữ, Bắc, kể chuyện)", value: "Bích Ngọc" },
            { label: "Kiều Linh (nữ, Nam, nhịp nhanh)", value: "Kiều Linh" },
            { label: "Adam vui (nam, Nam, vui nhộn)", value: "Adam vui" },
            { label: "Adam (nam, tiếng Anh)", value: "Adam" },
            { label: "Phạm Tuyên (nam, Bắc, trang trọng)", value: "Phạm Tuyên" },
            { label: "Trúc Ly (nữ, Bắc, trẻ trung)", value: "Trúc Ly" },
            { label: "Ban Mai (nữ, Bắc, tin tức)", value: "Ban Mai" },
            { label: "Mai Phương (nữ, Bắc, tin tức)", value: "Mai Phương" },
            { label: "Huyền My (nữ, Bắc, tin tức)", value: "Huyền My" },
            { label: "Ái Cúc (nữ, Bắc, podcast)", value: "Ái Cúc" },
            { label: "Thái Duy Bình (nam, Bắc, tin tức)", value: "Thái Duy Bình" },
            { label: "Mạnh Dũng 1 (nam, Bắc, tin tức)", value: "Mạnh Dũng 1" },
            { label: "Anh Khôi (nam, Bắc, kể chuyện)", value: "Anh Khôi" },
            { label: "Thế Kiên (nam, Bắc, kể chuyện)", value: "Thế Kiên" },
            { label: "Yến Nhi - Huế (nữ, Trung, tự nhiên)", value: "Yến Nhi - Huế" },
            { label: "Mẫn Huỳnh (nữ, Trung, tự nhiên)", value: "Mẫn Huỳnh" },
            { label: "Hoàng Sơn (nam, Trung, tự nhiên)", value: "Hoàng Sơn" },
            { label: "Thùy Dung (nữ, Nam, tin tức)", value: "Thùy Dung" },
            { label: "Tưởng Vy (nữ, Nam, truyền cảm)", value: "Tưởng Vy" },
            { label: "Phương Nghi (nữ, Nam, kể chuyện)", value: "Phương Nghi" },
            { label: "Quốc Tài (nam, Nam, kể chuyện)", value: "Quốc Tài" },
            { label: "Đăng Quân (nam, Nam, review)", value: "Đăng Quân" },
          ],
        },
        {
          type: "select",
          field: "emotion",
          title: "Phong cách",
          value: "natural",
          options: [
            { label: "Tự nhiên", value: "natural" },
            { label: "Kể chuyện", value: "storytelling" },
          ],
        },
        {
          type: "inputNumber",
          field: "speed",
          title: "Tốc độ",
          value: 1,
          props: { min: 0.5, max: 3, step: 0.1, precision: 1 },
        },
      ],
    },
  ] satisfies ProviderModel[],
  async getBalance() {
    const response = await this.tool.fetch(`${baseUrl(this.config)}/balance`, { headers: authHeaders(this.config), signal: this.signal });
    if (!response.ok) throw new Error(`Không lấy được số dư VieNeu (HTTP ${response.status}): ${this.tool.errorMessage(await response.text())}`);
    const data = await response.json() as { spendableTokens: number };
    return { balance: data.spendableTokens, unit: "token" };
  },
  async generateAudio(request: AudioRequest): Promise<MediaAsset[]> {
    const text = request.text?.trim() || request.prompt?.trim();
    if (!text) throw new Error("Vui lòng nhập văn bản cần đọc");
    const format = formats[request.format || "mp3"];
    if (!format) throw new Error(`VieNeu TTS không hỗ trợ định dạng ${request.format}`);
    const other = request.other ?? {};
    const voice = (typeof other.voice === "string" && other.voice.trim()) || request.voice || undefined;
    const emotion = typeof other.emotion === "string" && other.emotion ? other.emotion : undefined;
    const speed = typeof other.speed === "number" ? other.speed : request.speed;
    const response = await this.tool.fetch(`${baseUrl(this.config)}/audio/speech`, {
      method: "POST",
      headers: { ...authHeaders(this.config), "Content-Type": "application/json" },
      body: JSON.stringify({ model: request.model, input: text, voice, emotion, speed, response_format: format, sample_rate: request.sampleRate }),
      signal: this.signal,
    });
    if (!response.ok) throw new Error(`VieNeu TTS lỗi HTTP ${response.status}: ${this.tool.errorMessage(await response.text())}`);
    const data = new Uint8Array(await response.arrayBuffer());
    if (!data.byteLength) throw new Error("VieNeu TTS không trả về dữ liệu âm thanh");
    const mimeType = response.headers.get("content-type")?.split(";")[0] || "application/octet-stream";
    return [{ mediaType: "audio", type: "binary", data, mimeType }];
  },
} satisfies ProviderDefinition<typeof rules>;
