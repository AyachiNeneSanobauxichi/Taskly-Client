import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnInput } from "@/components/ui/input";
import { useDebouncedValue } from "@/features/todo/hooks";
import { TodoForm, TodoList } from "@/features/todo/pages/todo/components";
import { usePageTitle } from "@/hooks";

/** 任务页:标题栏 + 新建表单 + 搜索 + 任务列表,登录后的主页面 */
function TodoPage() {
  const { t } = useTranslation("todo");
  usePageTitle(t("page.title"));
  const [search, setSearch] = useState("");
  // 防抖后再作为查询参数,避免每次按键都请求
  const debouncedSearch = useDebouncedValue(search);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title">{t("page.title")}</h1>
        <p className="text-muted-foreground text-caption">
          {t("page.description")}
        </p>
      </div>
      <TodoForm />
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <ShadcnInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("search.placeholder")}
          className="pl-9"
        />
      </div>
      <TodoList search={debouncedSearch} />
    </div>
  );
}

export { TodoPage };
