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
import { AuthAvatar, AuthField } from "@/features/auth/components";
import { createLoginSchema } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { usePageTitle, useZodForm } from "@/hooks";

/** 登录页:邮箱/用户名 + 密码表单,校验通过后调用 useLogin 登录 */
function LoginPage() {
  const { t } = useTranslation("auth");
  usePageTitle(t("login.title"));
  // 校验文案跟随语言,t 变化时重建 schema
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(loginSchema, {
    defaultValues: { identifier: "", password: "" },
  });
  const login = useLogin();

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <ShadcnCard className="w-full max-w-sm">
        <ShadcnCardHeader className="items-center text-center">
          <AuthAvatar className="mb-2" />
          <ShadcnCardTitle>{t("login.title")}</ShadcnCardTitle>
          <ShadcnCardDescription>
            {t("login.description")}
          </ShadcnCardDescription>
        </ShadcnCardHeader>
        <form onSubmit={handleSubmit((data) => login.mutate(data))}>
          <ShadcnCardContent className="space-y-4">
            <AuthField
              id="identifier"
              label={t("login.identifierLabel")}
              placeholder={t("login.identifierPlaceholder")}
              error={errors.identifier?.message}
              {...register("identifier")}
            />
            <AuthField
              id="password"
              type="password"
              label={t("login.passwordLabel")}
              placeholder={t("login.passwordPlaceholder")}
              error={errors.password?.message}
              {...register("password")}
            />
          </ShadcnCardContent>
          <ShadcnCardFooter className="mt-6 flex-col gap-3">
            <ShadcnButton
              type="submit"
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("login.submit")}
            </ShadcnButton>
            <p className="text-muted-foreground text-caption">
              {t("login.noAccount")}{" "}
              <Link
                to={routeNames.register}
                className="text-primary hover:underline"
              >
                {t("login.goRegister")}
              </Link>
            </p>
          </ShadcnCardFooter>
        </form>
      </ShadcnCard>
    </div>
  );
}

export { LoginPage };
