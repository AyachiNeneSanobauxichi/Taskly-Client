## auth api

# v1

- register api

```ts
// post
const path = "/auth/register";

const request = {
  username: "string",
  email: "string",
  password: "string",
};

const response = {
  code: 0,
  message: "success",
  data: {
    // user
    email: "yui@kon.jp",
    userName: "Hirasawa Yui",
  },
};
```

- login api

```ts
// post
const path = "/auth/login";

const request = {
  identifier: "string",
  password: "string",
};

const response = {
  code: 0,
  message: "success",
  data: {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTU0NGRjZjRmNmZmODE5ZmY5OGE1Y2UiLCJ1c2VybmFtZSI6IkhpcmFzYXdhIFl1aSIsImlhdCI6MTc4MzkxMDAzMiwiZXhwIjoxNzgzOTEwOTMyLCJqdGkiOiJhMzMwYmJjOS00NDdhLTQzMzQtOThmNi03MzgyOWY3NzM1NjkifQ.-e8CDa1SWcdO__dR65sfwJcAfyFtyuXdQE4zkOqcayA",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTU0NGRjZjRmNmZmODE5ZmY5OGE1Y2UiLCJ1c2VybmFtZSI6IkhpcmFzYXdhIFl1aSIsImlhdCI6MTc4MzkxMDAzMiwiZXhwIjoxNzg0NTE0ODMyfQ.Byupd-8Na1rI4JA2QVLICsZl6sgI8y98JrXTdaXBQUc",
    user: {
      // user
      username: "Hirasawa Yui",
      email: "yui@kon.jp",
    },
  },
};
```

- refresh-token api

```ts
// post
const path = "/auth/refresh-token";

const request = {
  refreshToken: "occaecatadipisicingullamcoofficia",
};

const response = {
  code: 0,
  data: {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM5NDI4YTIzNzFmMGE5N2EzYjg0N2UiLCJ1c2VybmFtZSI6IldZSlIiLCJpYXQiOjE3ODIxNDQyMTMsImV4cCI6MTc4MjE0NTExM30.uLSVEuSkTw71nXYpnyP4GDfnq5PEe1WAoQR7UTSTQfA",
  },
};
```

- logout api

```ts
// post
const path = "/auth/logout";

// need authorization

const response = {
  code: 0,
  message: "Logged out successfully",
  data: null,
};
```

# v2

登录安全改动（详见 infra/request.md v2）：refresh token 改由后端 httpOnly cookie 下发，前端不再持有/传递。

- 所有请求带请求头 `X-Client-Type: web`、`withCredentials: true`
- login：后端在响应里 set httpOnly cookie 写入 refresh token；响应体即使仍带 `refreshToken` 字段前端也忽略，只取 accessToken（存内存）+ user
- refresh-token：请求体为空 `{}`，refresh token 由 cookie 自动携带

```ts
// post
const path = "/auth/refresh-token";

const request = {}; // 空 body，cookie 自动带 refresh token

const response = {
  code: 0,
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  },
};
```

- 启动时静默 refresh 一次恢复登录态：accessToken 只存内存，刷新页面后为空，靠 cookie 换回 accessToken；失败则清会话
