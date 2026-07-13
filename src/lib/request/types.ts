import type { InternalAxiosRequestConfig } from "axios";

/** 后端统一响应信封 { code, message, data }；拦截器负责拆包，业务层只见到 data */
interface ApiEnvelope<T> {
  code: number;
  message?: string;
  data: T;
}

/** 归一化后的接口错误，业务层统一处理这个结构 */
interface ApiError {
  status: number;
  message: string;
  /** 后端返回的字段级校验错误，如 { email: ['已被注册'] } */
  fieldErrors?: Record<string, string[]>;
}

// ── 响应拦截：401 单飞刷新 + 错误归一化 ─────────────────────
type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

export type { ApiEnvelope, ApiError, RetriableConfig };
