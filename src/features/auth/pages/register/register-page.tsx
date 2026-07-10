import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("register.title")}</CardTitle>
          <CardDescription>{t("register.description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("register.nameLabel")}</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("register.emailLabel")}</Label>
              <Input
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
              <Label htmlFor="password">{t("register.passwordLabel")}</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("register.confirmPasswordLabel")}
              </Label>
              <Input
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
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {t("register.submit")}
            </Button>
            <p className="text-muted-foreground text-sm">
              {t("register.hasAccount")}{" "}
              <Link to="/login" className="text-primary hover:underline">
                {t("register.goLogin")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export { RegisterPage };
