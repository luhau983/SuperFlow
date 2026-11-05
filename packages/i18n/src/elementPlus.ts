import type { Locale } from "./index";
import en from "./elementPlus/en.json";
import vi from "./elementPlus/vi.json";

export const elementLocales = { vi, en } satisfies Record<Locale, typeof en>;
