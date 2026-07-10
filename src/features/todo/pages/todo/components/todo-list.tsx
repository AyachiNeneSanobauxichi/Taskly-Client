import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTodos } from "@/features/todo/hooks";
import { TodoItem } from "./todo-item";

export function TodoList() {
  const { t } = useTranslation("todo");
  const { data: todos, isPending, isError, error } = useTodos();

  if (isPending) {
    return (
      <div className="text-muted-foreground flex justify-center py-10">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
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
