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
import { createRegisterSchema } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";
import { useZodForm } from "@/hooks";

function RegisterPage() {
  const { t } = useTranslation("auth");
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
            <div className="space-y-2">
              <ShadcnLabel htmlFor="name">
                {t("register.nameLabel")}
              </ShadcnLabel>
              <ShadcnInput id="name" {...register("name")} />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <ShadcnLabel htmlFor="email">
                {t("register.emailLabel")}
              </ShadcnLabel>
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
                {t("register.passwordLabel")}
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
            <div className="space-y-2">
              <ShadcnLabel htmlFor="confirmPassword">
                {t("register.confirmPasswordLabel")}
              </ShadcnLabel>
              <ShadcnInput
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
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
            <p className="text-muted-foreground text-sm">
              {t("register.hasAccount")}{" "}
              <Link to="/login" className="text-primary hover:underline">
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
