import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ShadcnCard,
  ShadcnCardContent,
  ShadcnCardDescription,
  ShadcnCardFooter,
  ShadcnCardHeader,
  ShadcnCardTitle,
} from "@/components/ui/card";
import { ShadcnButton } from "@/components/ui/button";
import { ShadcnInput } from "@/components/ui/input";
import { ShadcnLabel } from "@/components/ui/label";
import { createLoginSchema } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { useZodForm } from "@/hooks";

function LoginPage() {
  const { t } = useTranslation("auth");
  // 校验文案跟随语言,t 变化时重建 schema
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(loginSchema, {
    defaultValues: { email: "", password: "" },
  });
  const login = useLogin();

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <ShadcnCard className="w-full max-w-sm">
        <ShadcnCardHeader>
          <ShadcnCardTitle>{t("login.title")}</ShadcnCardTitle>
          <ShadcnCardDescription>
            {t("login.description")}
          </ShadcnCardDescription>
        </ShadcnCardHeader>
        <form onSubmit={handleSubmit((data) => login.mutate(data))}>
          <ShadcnCardContent className="space-y-4">
            <div className="space-y-2">
              <ShadcnLabel htmlFor="email">{t("login.emailLabel")}</ShadcnLabel>
              <ShadcnInput
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <ShadcnLabel htmlFor="password">
                {t("login.passwordLabel")}
              </ShadcnLabel>
              <ShadcnInput
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
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
            <p className="text-muted-foreground text-sm">
              {t("login.noAccount")}{" "}
              <Link to="/register" className="text-primary hover:underline">
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
