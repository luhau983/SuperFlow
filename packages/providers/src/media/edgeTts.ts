const version = "1.0.0";

// ACT: Without an explicit voice, pick a curated voice of the requested language; unknown languages fall back to English.
const defaultVoices: Record<string, string> = { vi: "vi-VN-HoaiMyNeural", en: "en-US-EmmaMultilingualNeural", zh: "zh-CN-XiaoxiaoNeural" };

export default {
  id: "edgeTts",
  label: "Edge TTS (local)",
  version,
  readme: `Đọc văn bản bằng giọng neural của Microsoft Edge thông qua CLI [edge-tts](https://github.com/rany2/edge-tts) cài trên máy chạy server. Không cần API Key.
 \n Cài đặt: \`pip install edge-tts\`. Định dạng khác mp3 24 kHz cần plugin FFmpeg để chuyển đổi.
 \n Lưu ý: edge-tts dùng dịch vụ đọc to không chính thức của Edge, có thể ngừng hoạt động khi Microsoft thay đổi.`,
  rules: [],
  // Static metadata parsing requires models to be an inline JSON literal.
  models: [
    {
      id: "edge-tts",
      label: "Edge TTS",
      type: "audio",
      rules: [
        {
          type: "select",
          field: "voice",
          title: "Giọng đọc",
          value: "",
          options: [
            { label: "Tự động theo ngôn ngữ", value: "" },
            { label: "Hoài My (Tiếng Việt, nữ)", value: "vi-VN-HoaiMyNeural" },
            { label: "Nam Minh (Tiếng Việt, nam)", value: "vi-VN-NamMinhNeural" },
            { label: "Emma Multilingual (English, female)", value: "en-US-EmmaMultilingualNeural" },
            { label: "Andrew Multilingual (English, male)", value: "en-US-AndrewMultilingualNeural" },
            { label: "Aria (English, female)", value: "en-US-AriaNeural" },
            { label: "Guy (English, male)", value: "en-US-GuyNeural" },
            { label: "Xiaoxiao (中文, nữ)", value: "zh-CN-XiaoxiaoNeural" },
            { label: "Xiaoyi (中文, nữ)", value: "zh-CN-XiaoyiNeural" },
            { label: "Yunxi (中文, nam)", value: "zh-CN-YunxiNeural" },
            { label: "Yunjian (中文, nam)", value: "zh-CN-YunjianNeural" },
          ],
        },
        {
          type: "inputNumber",
          field: "rate",
          title: "Tốc độ (%)",
          value: 0,
          props: { min: -50, max: 100, step: 5 },
        },
      ],
    },
  ] satisfies ProviderModel[],
  async generateAudio(request: AudioRequest): Promise<MediaAsset[]> {
    const text = request.text?.trim() || request.prompt?.trim();
    if (!text) throw new Error("Vui lòng nhập văn bản cần đọc");
    const other = request.other ?? {};
    const language = (request.language ?? "").split("-")[0]!.toLowerCase();
    const voice = (typeof other.voice === "string" && other.voice) || request.voice || defaultVoices[language] || defaultVoices.en!;
    const rate = typeof other.rate === "number" ? Math.round(other.rate) : undefined;
    const format = request.format as EdgeTtsOptions["format"];
    const { data, mimeType } = await this.tool.edgeTts({ text, voice, rate, format, sampleRate: request.sampleRate });
    return [{ mediaType: "audio", type: "binary", data, mimeType }];
  },
} satisfies ProviderDefinition<readonly []>;
