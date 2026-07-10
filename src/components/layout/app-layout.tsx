import { Outlet } from "react-router-dom";
import { LogOut, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks";
import { env } from "@/lib/env";
import { LanguageSwitcher } from "./language-switcher";

/** 登录后的主框架：顶部栏 + 内容区 */
function AppLayout() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="bg-background min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="text-primary size-5" />
            {env.VITE_APP_NAME}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user?.email}</span>
            <LanguageSwitcher />
            <ShadcnButton variant="ghost" size="sm" onClick={logout}>
              <LogOut className="size-4" />
              {t("actions.logout")}
            </ShadcnButton>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export { AppLayout };
