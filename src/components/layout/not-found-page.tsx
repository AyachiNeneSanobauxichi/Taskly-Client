import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components";

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">{t("notFound.title")}</p>
      <ShadcnButton asChild>
        <Link to="/">{t("notFound.backHome")}</Link>
      </ShadcnButton>
    </div>
  );
}

export { NotFoundPage };
