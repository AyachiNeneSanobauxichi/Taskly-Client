import { apiClient } from "@/lib/api-client";
import type { AuthResponse, AuthUser } from "../types";
import type { LoginInput, RegisterInput } from "../schemas";

/** 纯接口请求，不含任何副作用（不 setState、不弹 toast） */
export const authApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", input);
    return data;
  },

  register: async (input: RegisterInput): Promise<AuthResponse> => {
    // 不把 confirmPassword 传给后端
    const { confirmPassword: _confirmPassword, ...payload } = input;
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<AuthUser>("/auth/me");
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
