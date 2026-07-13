import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import commonZh from "@/lib/i18n/locales/zh/common.json";
import authZh from "@/lib/i18n/locales/zh/auth.json";
import todoZh from "@/lib/i18n/locales/zh/todo.json";
import commonEn from "@/lib/i18n/locales/en/common.json";
import authEn from "@/lib/i18n/locales/en/auth.json";
import todoEn from "@/lib/i18n/locales/en/todo.json";

const supportedLanguages = [
  { code: "zh", label: "中文" },
  { code: "en", label: "English" },
] as const;

type SupportedLanguage = (typeof supportedLanguages)[number]["code"];

/** 所有资源在构建时静态打包，无需异步加载，因此关闭 suspense */
void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { common: commonZh, auth: authZh, todo: todoZh },
      en: { common: commonEn, auth: authEn, todo: todoEn },
    },
    ns: ["common", "auth", "todo"],
    defaultNS: "common",
    fallbackLng: "zh",
    supportedLngs: supportedLanguages.map((l) => l.code),
    /** 归一化浏览器语言（如 zh-CN / zh-TW / en-US）到语言代码，匹配上面的资源键 */
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "taskly.language",
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export { i18next, supportedLanguages };
export type { SupportedLanguage };
