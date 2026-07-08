import { Loader2 } from "lucide-react";
import { useTodos } from "@/features/todo/hooks";
import { TodoItem } from "./todo-item";

export function TodoList() {
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
        加载失败：{(error as { message?: string }).message ?? "未知错误"}
      </p>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        还没有任务，先添加一个吧 🎉
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
