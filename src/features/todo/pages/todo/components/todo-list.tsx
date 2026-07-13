import { useTranslation } from "react-i18next";
import { ShadcnSkeleton } from "@/components/ui/skeleton";
import { useTodos } from "@/features/todo/hooks";
import { SKELETON_ROW_COUNT } from "@/features/todo/pages/todo/components/constants";
import { TodoItem } from "@/features/todo/pages/todo/components/todo-item";

/** 加载骨架屏:行结构与 TodoItem 一致(勾选框 + 标题 + 删除按钮),避免加载完成后跳动 */
function TodoListSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: SKELETON_ROW_COUNT }, (_item, index) => (
        <li
          key={index}
          className="flex items-center gap-3 rounded-lg border px-4 py-3"
        >
          <ShadcnSkeleton className="size-4 rounded-sm" />
          <ShadcnSkeleton className="h-4 flex-1" />
          <ShadcnSkeleton className="size-8" />
        </li>
      ))}
    </ul>
  );
}

/** 任务列表:处理加载(骨架屏)、错误、空态,正常时渲染 TodoItem 列表 */
function TodoList() {
  const { t } = useTranslation("todo");
  const { data: todos, isPending, isError, error } = useTodos();

  if (isPending) {
    return <TodoListSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-destructive py-10 text-center text-sm">
        {t("list.loadError")}
        {(error as { message?: string }).message ?? t("list.unknownError")}
      </p>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        {t("list.empty")}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export { TodoList };
