---
name: forms
description: 表单与校验规范:react-hook-form + zod v4 + zodResolver,支持 i18n 的 schema 工厂写法,错误信息展示。写表单页面、新增/修改 zod schema、处理表单校验时使用。
---

# 表单与校验规范

技术栈:react-hook-form v7 + zod **v4** + `@hookform/resolvers`。参考实现:`login-page.tsx`、`todo-form.tsx`。

## schema 写成工厂函数(因为校验文案要 i18n)

校验消息依赖当前语言,所以 schema 不能是模块级常量,而是接收 `t` 的工厂,放在 feature 的 `schemas.ts`:

```ts
// features/auth/schemas.ts
import { z } from "zod";
import type { useTranslation } from "react-i18next";

type AuthT = ReturnType<typeof useTranslation<"auth">>["t"];

export const createLoginSchema = (t: AuthT) =>
  z.object({
    email: z.email(t("validation.emailInvalid")),   // zod v4:z.email() 是顶层 API
    password: z.string().min(6, t("validation.passwordMin")),
  });
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
```

注意 `t` 的类型用 `ReturnType<typeof useTranslation<"ns">>["t"]` 提取,**不要**用 `TFunction<"ns">` —— 后者在本项目的 i18next 类型配置下推不出正确的 key 集合。

## 组件内用法:统一走 useZodForm(强制)

用全局 hook `useZodForm`(`@/hooks`),**不要**手写 `useForm + zodResolver`:

```tsx
const { t } = useTranslation("auth");
const loginSchema = useMemo(() => createLoginSchema(t), [t]); // t 随语言切换而变,依赖 [t] 即可
const { register, handleSubmit, formState: { errors } } = useZodForm(loginSchema, {
  defaultValues: { email: "", password: "" },   // 必须给全 defaultValues
});
```

表单类型从 schema 自动推导,无需传泛型。参考实现:`login-page.tsx`、`todo-form.tsx`。

## 约定

- 错误展示:字段下方 `<p className="text-destructive text-sm">{errors.xxx.message}</p>`。
- 提交按钮用 mutation 的 `isPending` 禁用,pending 时加 `<Loader2 className="size-4 animate-spin" />`。
- 不发给后端的字段(如 `confirmPassword`)在 api 层剥离,不要传给接口。
- 跨字段校验用 `.refine(..., { message, path: ["字段"] })`(见 `createRegisterSchema`)。
- zod v4 写法注意:邮箱是 `z.email(msg)`,不是 `z.string().email()`。
