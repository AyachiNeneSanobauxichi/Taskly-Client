/** 后端 login.data 原始结构（信封已由拦截器拆掉） */
interface LoginDto {
  accessToken: string;
  // v2 起 refresh token 改走 httpOnly cookie；响应体仍带此字段但前端忽略
  refreshToken: string;
  user: { username: string; email: string };
}

/** 后端 register.data 原始结构；注意字段是 userName */
interface RegisterDto {
  email: string;
  userName: string;
}

export type { LoginDto, RegisterDto };
