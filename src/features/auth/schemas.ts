import { z } from "zod";
import type { useTranslation } from "react-i18next";

type AuthT = ReturnType<typeof useTranslation<"auth">>["t"];

/** 校验文案依赖当前语言，需在组件内传入 t 后再创建 schema */
export const createLoginSchema = (t: AuthT) =>
  z.object({
    email: z.email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
  });
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;

export const createRegisterSchema = (t: AuthT) =>
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
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
