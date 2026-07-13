interface AuthUser {
  email: string;
  username: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** 登录接口返回体：令牌对 + 用户 */
interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export type { AuthResponse, AuthTokens, AuthUser };
