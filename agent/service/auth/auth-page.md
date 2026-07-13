# auth page

## v1

- auth 相关的 schema 如下

```ts
const usernameSchema = z
  .string({ error: "Username is required" })
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be at most 20 characters long");

const emailSchema = email({
  error: (issue) =>
    issue.input === undefined ? "Email is required" : "Invalid email address",
});

const passwordSchema = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  identifier: z
    .string({ error: "Username or email is required" })
    .min(1, "Username or email is required"),
  password: z.string({ error: "Password is required" }),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string({ error: "Refresh token is required" }),
});
```

- 接入 auth 的接口
- 注册页面的 input 框需要 placeholder
- 登录页面 的 emai 换成 email 和 username 都可以输入 并需要 placeholder
- 登录成功后跳转到首页
- 这两个页面需要一个 mock 的头像
