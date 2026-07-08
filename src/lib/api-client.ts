import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "./env";
import { useAuthStore } from "@/features/auth/store/auth.store";

/** 归一化后的接口错误，业务层统一处理这个结构 */
export interface ApiError {
  status: number;
  message: string;
  /** 后端返回的字段级校验错误，如 { email: ['已被注册'] } */
  fieldErrors?: Record<string, string[]>;
}

/** 主客户端：所有业务请求都走它 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

/** 刷新令牌专用客户端：不挂拦截器，避免递归 */
const refreshClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── 请求拦截：注入 access token ─────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── 响应拦截：401 单飞刷新 + 错误归一化 ─────────────────────
type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// 单飞：并发 401 时只发起一次刷新请求，其余请求等待同一个 Promise
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) throw new Error("无 refresh token");

  const { data } = await refreshClient.post<{
    accessToken: string;
    refreshToken: string;
  }>("/auth/refresh", { refreshToken });

  useAuthStore.getState().setSession({
    user: useAuthStore.getState().user!,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // 401 且未重试过 → 尝试刷新一次
    if (status === 401 && original && !original._retried) {
      original._retried = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
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
