import type { AuthUser } from "@/features/auth/types";

/**
 * auth store 的状态与 setter；与 auth.store.ts 平级、专属服务它。
 * accessToken 只存内存（不持久化）；refresh token 在 httpOnly cookie 里，前端不持有。
 * 仅 user 持久化到 localStorage，供刷新页面后静默 refresh 期间回显用户信息。
 */
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  /** 保存登录会话 */
  setSession: (payload: { user: AuthUser; accessToken: string }) => void;
  /** 仅更新 access token（静默 refresh / 401 重放刷新时用） */
  setAccessToken: (accessToken: string) => void;
  /** 清空会话（登出 / 401） */
  clearSession: () => void;
}

export type { AuthState };
