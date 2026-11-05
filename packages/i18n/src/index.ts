import { IntlMessageFormat } from "intl-messageformat";
import { escapeMessageText } from "./messageText.ts";
export { escapeMessageText } from "./messageText.ts";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

export type Locale = "vi" | "en";
export interface MessageDescriptor { id: string; values?: Record<string, unknown> }
export const supportedLocales: { code: Locale; name: string }[] = [
  { code: "vi", name: "Tiếng Việt" },
  { code: "en", name: "English" },
];
const catalogs: Record<Locale, Record<string, string>> = { vi, en };
let activeLocale: Locale = "vi";
const listeners = new Set<(locale: Locale) => void>();
const formatters = new Map<string, IntlMessageFormat>();

export function normalizeLocale(value: unknown): Locale | undefined {
  if (typeof value !== "string") return;
  let language: Intl.Locale;
  try { language = new Intl.Locale(value.trim().replaceAll("_", "-")); }
  catch { return; }
  return supportedLocales.find(item => item.code === language.language)?.code;
}

export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const locale = normalizeLocale(language);
    if (locale) return locale;
  }
  return "vi";
}

export function getLocale(): Locale { return activeLocale; }
export function setLocale(locale: Locale) {
  if (locale === activeLocale) return;
  activeLocale = locale;
  for (const listener of listeners) listener(locale);
}
export function subscribeLocale(listener: (locale: Locale) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function msg(strings: TemplateStringsArray, ...values: unknown[]): MessageDescriptor {
  if (!values.length) return { id: strings[0] };
  return {
    id: strings.map((part, index) => escapeMessageText(part) + (index < values.length ? `{${index}}` : "")).join(""),
    values: Object.fromEntries(values.map((value, index) => [index, value])),
  };
}

export function translate(message: string | MessageDescriptor, values?: Record<string, unknown>, language: Locale = activeLocale): string {
  const id = typeof message === "string" ? message : message.id;
  const parameters = values ?? (typeof message === "string" ? undefined : message.values);
  const catalog = Object.hasOwn(catalogs, language) ? catalogs[language] : undefined;
  const translated = catalog && Object.hasOwn(catalog, id) && typeof catalog[id] === "string" ? catalog[id] : id;
  if (!parameters || !Object.keys(parameters).length) return translated;
  const format = (text: string) => {
    const cacheKey = `${language}\0${text}`;
    let formatter = formatters.get(cacheKey);
    if (!formatter) {
      formatter = new IntlMessageFormat(text, language, undefined, { ignoreTag: true });
      // ACT: 字典与语言切换共享缓存，限制 2000 项；无需随用户输入增长。
      if (formatters.size >= 2000) formatters.delete(formatters.keys().next().value!);
      formatters.set(cacheKey, formatter);
    }
    const result = formatter.format(Object.fromEntries(Object.entries(parameters).map(([key, value]) => [key,
      typeof value === "number" || value instanceof Date ? value : String(value),
    ])));
    return Array.isArray(result) ? result.join("") : String(result);
  };
  try { return format(translated); }
  catch {
    // ACT: 损坏或缺参数的外部语言包回退原文；参数只替换一次，不再解析用户输入。
    try { return format(id); }
    catch { return id.replace(/\{(\d+)\}/g, (token, key) => Object.hasOwn(parameters, key) ? String(parameters[key]) : token); }
  }
}

export function t(strings: TemplateStringsArray, ...values: unknown[]): string {
  return translate(msg(strings, ...values));
}
