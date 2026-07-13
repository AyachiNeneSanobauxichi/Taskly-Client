import { useEffect } from "react";
import { env } from "@/lib/env";
import { TITLE_SEPARATOR } from "@/hooks/use-page-title/constants";

/**
 * 把 document.title 设为「页面标题 · 应用名」,组件卸载时还原为应用名。
 * 传入已翻译的文案(t(...)),语言切换触发重渲染时标题会自动更新。
 */
function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title}${TITLE_SEPARATOR}${env.VITE_APP_NAME}`
      : env.VITE_APP_NAME;

    return () => {
      document.title = env.VITE_APP_NAME;
    };
  }, [title]);
}

export { usePageTitle };
