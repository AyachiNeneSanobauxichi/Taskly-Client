import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { routeNames } from "@/app/router/route-names";
import {
  ShadcnCard,
  ShadcnCardContent,
  ShadcnCardDescription,
  ShadcnCardFooter,
  ShadcnCardHeader,
  ShadcnCardTitle,
} from "@/components/ui/card";
import { ShadcnButton } from "@/components/ui/button";
import { AuthField } from "@/features/auth/components";
import { createRegisterSchema } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";
import { usePageTitle, useZodForm } from "@/hooks";

/** 注册页:昵称 + 邮箱 + 密码 + 确认密码表单,校验通过后调用 useRegister 注册 */
function RegisterPage() {
  const { t } = useTranslation("auth");
  usePageTitle(t("register.title"));
  // 校验文案跟随语言,t 变化时重建 schema
  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(registerSchema, {
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const registerMutation = useRegister();

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <ShadcnCard className="w-full max-w-sm">
        <ShadcnCardHeader>
          <ShadcnCardTitle>{t("register.title")}</ShadcnCardTitle>
          <ShadcnCardDescription>
            {t("register.description")}
          </ShadcnCardDescription>
        </ShadcnCardHeader>
        <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))}>
          <ShadcnCardContent className="space-y-4">
            <AuthField
              id="name"
              label={t("register.nameLabel")}
              error={errors.name?.message}
              {...register("name")}
            />
            <AuthField
              id="email"
              type="email"
              label={t("register.emailLabel")}
              placeholder={t("register.emailPlaceholder")}
              error={errors.email?.message}
              {...register("email")}
            />
            <AuthField
              id="password"
              type="password"
              label={t("register.passwordLabel")}
              error={errors.password?.message}
              {...register("password")}
            />
            <AuthField
              id="confirmPassword"
              type="password"
              label={t("register.confirmPasswordLabel")}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </ShadcnCardContent>
          <ShadcnCardFooter className="mt-6 flex-col gap-3">
            <ShadcnButton
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {t("register.submit")}
            </ShadcnButton>
            <p className="text-muted-foreground text-caption">
              {t("register.hasAccount")}{" "}
              <Link
                to={routeNames.login}
                className="text-primary hover:underline"
              >
                {t("register.goLogin")}
              </Link>
            </p>
          </ShadcnCardFooter>
        </form>
      </ShadcnCard>
    </div>
  );
}

export { RegisterPage };
