import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
import { loginSchema, type LoginInput } from "../schemas";
import { useLogin } from "../hooks/use-auth";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const login = useLogin();

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>登录 Taskly</CardTitle>
          <CardDescription>输入账号密码进入你的任务列表</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit((data) => login.mutate(data))}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
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
              <Label htmlFor="password">密码</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending && <Loader2 className="size-4 animate-spin" />}
              登录
            </Button>
            <p className="text-muted-foreground text-sm">
              还没有账号？{" "}
              <Link to="/register" className="text-primary hover:underline">
                去注册
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
