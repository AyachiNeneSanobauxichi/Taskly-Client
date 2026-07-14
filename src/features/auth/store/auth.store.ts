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
      setSession: ({ user, accessToken }) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearSession: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "taskly.auth",
      storage: createJSONStorage(() => localStorage),
      // accessToken 只存内存；仅持久化 user 供启动静默 refresh 期间回显
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

/** 派生选择器：是否已登录 */
const useIsAuthenticated = () => useAuthStore((s) => Boolean(s.accessToken));

export { useAuthStore, useIsAuthenticated };
