// 令牌刷新（单飞）：并发 401 时只发起一次刷新请求，其余请求共享同一个 Promise。
import { create, type AxiosInstance } from "axios";
import { env } from "@/lib/env";
import { useAuthStore } from "@/features/auth/store";
import type { AuthTokens } from "@/features/auth/types";

/** 刷新专用客户端：刻意不挂任何拦截器，避免刷新请求自身 401 时递归刷新 */
const refreshClient: AxiosInstance = create({
  baseURL: env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** 进行中的刷新请求；null 表示当前空闲 */
let inflight: Promise<string> | null = null;

/** 真正打刷新接口，成功后写回轮换的令牌对，返回新的 access token */
async function requestNewToken(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) throw new Error("缺少 refresh token，无法刷新会话");

  const { data } = await refreshClient.post<AuthTokens>("/auth/refresh", {
    refreshToken,
  });

  useAuthStore.getState().setTokens(data);
  return data.accessToken;
}

/**
 * 获取一个"刷新完成"的 Promise。
 * 并发调用返回同一个在途 Promise（单飞），无论成败结束后自动复位，
 * 下一次 401 可以重新发起刷新。
 */
function refreshAccessToken(): Promise<string> {
  inflight ??= requestNewToken().finally(() => {
    inflight = null;
  });
  return inflight;
}

export { refreshAccessToken };
