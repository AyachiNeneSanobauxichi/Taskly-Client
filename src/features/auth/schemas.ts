import type { useTranslation } from "react-i18next";
import { z } from "zod";

type AuthT = ReturnType<typeof useTranslation<"auth">>["t"];

/** 密码强度:至少 8 位，含大小写字母、数字、特殊字符 */
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/** 校验文案依赖当前语言，需在组件内传入 t 后再创建 schema */
const createLoginSchema = (t: AuthT) =>
  z.object({
    // 登录支持邮箱或用户名，统一为 identifier；登录不校验密码强度，仅要求非空
    identifier: z.string().min(1, t("validation.identifierRequired")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });
type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;

const createRegisterSchema = (t: AuthT) =>
  z
    .object({
      username: z
        .string()
        .min(3, t("validation.usernameMin"))
        .max(20, t("validation.usernameMax")),
      email: z.email(t("validation.emailInvalid")),
      password: z
        .string()
        .min(8, t("validation.passwordMin"))
        .regex(PASSWORD_PATTERN, t("validation.passwordComplexity")),
      // confirmPassword 仅前端二次确认，不入后端契约，提交前在 api 层剥离
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });
type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;

export { createLoginSchema, createRegisterSchema };
export type { LoginInput, RegisterInput };
