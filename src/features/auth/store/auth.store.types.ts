import type { AuthTokens, AuthUser } from "@/features/auth/types";

/** auth store 的状态与 setter；与 auth.store.ts 平级、专属服务它 */
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** 保存登录会话 */
  setSession: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  /** 仅更新令牌对（刷新时用，含轮换后的 refresh token） */
  setTokens: (tokens: AuthTokens) => void;
  /** 清空会话（登出 / 401） */
  clearSession: () => void;
}

export type { AuthState };
