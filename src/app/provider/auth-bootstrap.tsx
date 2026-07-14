import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { refreshAccessToken } from "@/lib/request";
import { useAuthStore } from "@/features/auth/store";

/**
 * 启动时静默 refresh 一次以恢复登录态：
 * accessToken 只存内存，刷新页面后为空，靠 httpOnly cookie 换回新的 access token。
 * 成功则登录态恢复；失败（无 cookie / 已过期）则清空会话。
 * refresh 落定前先挡住渲染，避免路由守卫因 accessToken 为空瞬间弹到登录页。
 */
function AuthBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    refreshAccessToken()
      .catch(() => useAuthStore.getState().clearSession())
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="bg-background flex min-h-svh items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  return children;
}

export { AuthBootstrap };
