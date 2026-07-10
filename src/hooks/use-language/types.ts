import type { supportedLanguages } from "@/lib/i18n";

/** 单个可选语言项(code + 展示名) */
type LanguageOption = (typeof supportedLanguages)[number];

export type { LanguageOption };
