import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "@/lib/query-client";
import type { ApiError } from "@/lib/api-client";

/** 登录：成功后写入会话 + 跳主页 */
export function useLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession(data);
      toast.success("登录成功");
      navigate("/", { replace: true });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

/** 注册：成功后直接登录态 + 跳主页 */
export function useRegister() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setSession(data);
      toast.success("注册成功，欢迎使用");
      navigate("/", { replace: true });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

/** 登出：清会话 + 清缓存 + 跳登录页 */
export function useLogout() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // 后端登出失败也要清本地状态
    }
    clearSession();
    queryClient.clear();
    navigate("/login", { replace: true });
  }, [clearSession, navigate]);
}
