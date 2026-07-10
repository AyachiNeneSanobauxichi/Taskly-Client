import type { useTranslation } from "react-i18next";
import { z } from "zod";

type AuthT = ReturnType<typeof useTranslation<"auth">>["t"];

/** 校验文案依赖当前语言，需在组件内传入 t 后再创建 schema */
const createLoginSchema = (t: AuthT) =>
  z.object({
    email: z.email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
  });
type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;

const createRegisterSchema = (t: AuthT) =>
  z
    .object({
      name: z.string().min(2, t("validation.nameMin")),
      email: z.email(t("validation.emailInvalid")),
      password: z.string().min(6, t("validation.passwordMin")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });
type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;

export { createLoginSchema, createRegisterSchema };
export type { LoginInput, RegisterInput };
