import { join } from "node:path";
import { getBuiltinModels } from "@earendil-works/pi-ai/providers/all";
import { readFileSync } from "@toonflow/file";
import { thinkingLevels, type ThinkingLevel } from "@/lib/modelReasoning";
import { codexHome, codexSettings, codexTextAvailable } from "@/utils/codex/auth";

export const codexProviderId = "openai-codex";
export const codexProtocol = "openai-codex-responses";

type CachedModel = {
  slug?: unknown; display_name?: unknown; visibility?: unknown; context_window?: unknown; effective_context_window_percent?: unknown;
  supported_reasoning_levels?: { effort?: unknown }[];
};

let modelCache: { at: number; models: ReturnType<typeof readModels> } | undefined;

function codexModels() {
  // ACT: 与登录检测相同，10 秒内复用模型列表。
  if (!modelCache || Date.now() - modelCache.at > 10_000) modelCache = { at: Date.now(), models: readModels() };
  return modelCache.models;
}

/** 读取 Codex 缓存的账号可用模型；缓存缺失时退回 SDK 内置列表。 */
function readModels(): { id: string; label: string; contextWindow?: number; reasoningEfforts?: Partial<Record<ThinkingLevel, string>> }[] {
  try {
    const cache = JSON.parse(readFileSync(join(codexHome(), "models_cache.json"), "utf8")) as { models?: CachedModel[] };
    const models = (cache.models ?? []).filter(model => model.visibility === "list" && typeof model.slug === "string" && model.slug);
    if (models.length) return models.map(model => {
      const efforts = (model.supported_reasoning_levels ?? []).map(level => level.effort)
        .filter((effort): effort is ThinkingLevel => thinkingLevels.includes(effort as ThinkingLevel));
      const window = typeof model.context_window === "number" ? model.context_window : undefined;
      const percent = typeof model.effective_context_window_percent === "number" ? model.effective_context_window_percent : 100;
      return {
        id: model.slug as string,
        label: typeof model.display_name === "string" && model.display_name ? model.display_name : model.slug as string,
        ...(window ? { contextWindow: Math.floor(window * percent / 100) } : {}),
        ...(efforts.length ? { reasoningEfforts: Object.fromEntries(efforts.map(effort => [effort, effort])) } : {}),
      };
    });
  } catch {
    // 缓存由 Codex 维护，读取失败时使用内置列表。
  }
  return getBuiltinModels(codexProviderId).filter(model => model.api === codexProtocol).map(model => ({ id: model.id, label: model.name || model.id }));
}

/** 本机 Codex 登录对应的文本供应商；令牌在每次运行前由 getCodexToken 注入，不写入设置。 */
export function getCodexProvider() {
  if (!codexTextAvailable()) return undefined;
  return {
    id: codexProviderId,
    label: "Codex",
    apiUrl: codexSettings().apiUrl,
    apiKey: "",
    protocol: codexProtocol,
    models: codexModels(),
  } as const;
}
