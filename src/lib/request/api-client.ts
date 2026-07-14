import type { AxiosError, AxiosInstance } from "axios";
import type {
  ApiEnvelope,
  ApiError,
  RetriableConfig,
} from "@/lib/request/types";
import { create } from "axios";
import { env } from "@/lib/env";
import { refreshAccessToken } from "@/lib/request/refresh-token";
import { useAuthStore } from "@/features/auth/store";

/** 主客户端：所有业务请求都走它 */
const apiClient: AxiosInstance = create({
  baseURL: env.VITE_API_BASE_URL,
  // X-Client-Type 告诉后端是 web 登录；withCredentials 让 refresh 的 httpOnly cookie 自动携带
  headers: { "Content-Type": "application/json", "X-Client-Type": "web" },
  withCredentials: true,
  timeout: 15_000,
});

// ── 请求拦截：注入 access token ─────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // 统一信封 { code, message, data }：拆包后业务层只见到 data
    const body = response.data as ApiEnvelope<unknown> | undefined;
    if (body && typeof body === "object" && "code" in body) {
      // 业务码非 0 视为错误，归一化成 ApiError 抛出
      if (body.code !== 0) {
        const apiError: ApiError = {
          status: response.status,
          message: body.message ?? "请求失败",
        };
        return Promise.reject(apiError);
      }
      response.data = body.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // 401 且未重试过 → 单飞刷新一次后重放原请求
    if (status === 401 && original && !original._retried) {
      original._retried = true;
      try {
        await refreshAccessToken();
        return apiClient(original);
      } catch {
        // 刷新失败 → 清空会话，交给路由守卫跳登录
        useAuthStore.getState().clearSession();
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

/** 把 AxiosError 转换成统一的 ApiError */
function normalizeError(error: AxiosError): ApiError {
  const data = error.response?.data as
    { message?: string; errors?: Record<string, string[]> } | undefined;
  return {
    status: error.response?.status ?? 0,
    message:
      data?.message ??
      (error.code === "ECONNABORTED" ? "请求超时" : "网络异常，请稍后重试"),
    fieldErrors: data?.errors,
  };
}

export { apiClient };
