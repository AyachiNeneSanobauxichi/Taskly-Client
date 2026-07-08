import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthTokens, AuthUser } from "../types";

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

/**
 * 客户端认证状态。
 * 注意：本 store 只持有状态与 setter，不 import api 层，
 * 因此 api-client 可以安全地反向读取它而不产生循环依赖。
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      clearSession: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: "taskly.auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** 派生选择器：是否已登录 */
export const useIsAuthenticated = () =>
  useAuthStore((s) => Boolean(s.accessToken));
