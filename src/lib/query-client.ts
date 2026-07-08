import { QueryClient } from "@tanstack/react-query";

/**
 * 全局 QueryClient 配置。
 * - staleTime: 数据在 30s 内视为新鲜，不重复请求
 * - retry: 失败重试 1 次（4xx 不重试，见下方）
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 客户端错误（4xx）不重试
        const status = (error as { status?: number }).status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
