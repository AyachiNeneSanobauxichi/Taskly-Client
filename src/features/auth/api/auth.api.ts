import type { AuthResponse, AuthUser } from "@/features/auth/types";
import type { LoginInput, RegisterInput } from "@/features/auth/schemas";
import type { LoginDto, RegisterDto } from "@/features/auth/api/types";
import { apiClient } from "@/lib/request";

/** 纯接口请求，不含任何副作用（不 setState、不弹 toast） */
const authApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<LoginDto>("/auth/login", {
      identifier: input.email,
      password: input.password,
    });
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: { email: data.user.email, username: data.user.username },
    };
  },

  register: async (input: RegisterInput): Promise<AuthUser> => {
    // v1 注册只返回用户信息、不下发令牌；confirmPassword 不传后端
    const { data } = await apiClient.post<RegisterDto>("/auth/register", {
      username: input.name,
      email: input.email,
      password: input.password,
    });
    return { email: data.email, username: data.userName };
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};

export { authApi };
