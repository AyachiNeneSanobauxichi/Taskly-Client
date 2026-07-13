import { useTranslation } from "react-i18next";
import {
  TodoCreateDialog,
  TodoList,
} from "@/features/todo/pages/todo/components";
import { usePageTitle } from "@/hooks";

/** 任务页:标题栏 + 新建按钮(弹窗)+ 任务列表(自带筛选/分页),登录后的主页面 */
function TodoPage() {
  const { t } = useTranslation("todo");
  usePageTitle(t("page.title"));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-title">{t("page.title")}</h1>
          <p className="text-muted-foreground text-caption">
            {t("page.description")}
          </p>
        </div>
        <TodoCreateDialog />
      </div>
      <TodoList />
    </div>
  );
}

export { TodoPage };
