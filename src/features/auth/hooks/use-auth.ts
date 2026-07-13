import type { ApiError } from "@/lib/request";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { queryClient } from "@/lib/request";

/** 登录：成功后写入会话 + 跳主页 */
function useLogin() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession(data);
      toast.success(t("login.success"));
      navigate("/", { replace: true });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

/** 注册：v1 注册不下发令牌，成功后跳登录页让用户登录 */
function useRegister() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(t("register.success"));
      navigate("/login", { replace: true });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

/** 登出：清会话 + 清缓存 + 跳登录页 */
function useLogout() {
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

export { useLogin, useLogout, useRegister };
