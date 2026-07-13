import type { AuthState } from "@/features/auth/store/auth.store.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 客户端认证状态。
 * 注意：本 store 只持有状态与 setter，不 import api 层，
 * 因此 api-client 可以安全地反向读取它而不产生循环依赖。
 */
const useAuthStore = create<AuthState>()(
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
const useIsAuthenticated = () => useAuthStore((s) => Boolean(s.accessToken));

export { useAuthStore, useIsAuthenticated };
