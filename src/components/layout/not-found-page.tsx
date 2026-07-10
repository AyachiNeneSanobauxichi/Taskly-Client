import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeNames } from "@/app/router/route-names";
import { ShadcnButton } from "@/components";
import { usePageTitle } from "@/hooks";

/** 404 页:未匹配到路由时展示,提供返回首页入口 */
function NotFoundPage() {
  const { t } = useTranslation();
  usePageTitle(t("notFound.title"));

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">{t("notFound.title")}</p>
      <ShadcnButton asChild>
        <Link to={routeNames.home}>{t("notFound.backHome")}</Link>
      </ShadcnButton>
    </div>
  );
}

export { NotFoundPage };
