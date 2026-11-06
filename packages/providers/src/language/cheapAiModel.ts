const rules = [
  {
    type: "input",
    field: "apiKey" as const,
    title: "API Key",
    value: "",
    props: { type: "password", showPassword: true, autocomplete: "off" },
  },
];

export default {
  id: "cheapAiModel" as const,
  label: "CheapAIModel",
  icon: "",
  version: "2.0.0",
  apiUrl: "https://api.cheapaimodel.ai/v1",
  protocol: "openai-completions",
  readme: "使用 CheapAIModel API Key 获取可用模型。",
  rules,
  models: [],
} satisfies ProviderDefinition<typeof rules>;
