import { useTranslation } from "react-i18next";
import { usePageTitle } from "@/hooks";
import { TodoForm, TodoList } from "./components";

function TodoPage() {
  const { t } = useTranslation("todo");
  usePageTitle(t("page.title"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("page.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("page.description")}</p>
      </div>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export { TodoPage };
