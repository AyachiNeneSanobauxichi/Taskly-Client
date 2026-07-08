export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** 登录 / 注册接口返回体 */
export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}
