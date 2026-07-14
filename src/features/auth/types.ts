interface AuthUser {
  email: string;
  username: string;
}

/**
 * 登录接口返回体：access token（存内存）+ 用户。
 * refresh token 由后端通过 httpOnly cookie 下发，前端不接触。
 */
interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export type { AuthResponse, AuthUser };
