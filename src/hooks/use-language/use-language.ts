import type { SupportedLanguage } from "@/lib/i18n";
import type { LanguageOption } from "@/hooks/use-language/types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "@/lib/i18n";

/**
 * 当前语言状态与切换方法。
 * - current:当前语言项(未匹配时回退到第一种语言)
 * - next:双语场景下的"另一种语言"
 * - change:切换到指定语言(i18next 自动写入 localStorage)
 * - toggle:直接切到另一种语言
 */
function useLanguage() {
  const { i18n } = useTranslation();

  const current: LanguageOption =
    supportedLanguages.find((l) => l.code === i18n.language) ??
    supportedLanguages[0];

  const next: LanguageOption =
    supportedLanguages.find((l) => l.code !== current.code) ?? current;

  const change = useCallback(
    (code: SupportedLanguage) => void i18n.changeLanguage(code),
    [i18n],
  );

  const toggle = useCallback(() => change(next.code), [change, next.code]);

  return { current, next, languages: supportedLanguages, change, toggle };
}

export { useLanguage };
