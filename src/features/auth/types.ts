interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** 登录 / 注册接口返回体 */
interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export type { AuthResponse, AuthTokens, AuthUser };
