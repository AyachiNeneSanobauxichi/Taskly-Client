import type { Todo } from "@/features/todo/types";
import { Trash2 } from "lucide-react";
import { ShadcnCheckbox } from "@/components/ui/checkbox";
import { ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeleteTodo, useUpdateTodo } from "@/features/todo/hooks";

function TodoItem({ todo }: { todo: Todo }) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  return (
    <li className="flex items-center gap-3 rounded-lg border px-4 py-3">
      <ShadcnCheckbox
        checked={todo.completed}
        onCheckedChange={(checked) =>
          updateTodo.mutate({ id: todo.id, input: { completed: !!checked } })
        }
      />
      <span
        className={cn(
          "flex-1 text-sm",
          todo.completed && "text-muted-foreground line-through",
        )}
      >
        {todo.title}
      </span>
      <ShadcnButton
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => deleteTodo.mutate(todo.id)}
        disabled={deleteTodo.isPending}
      >
        <Trash2 className="size-4" />
      </ShadcnButton>
    </li>
  );
}

export { TodoItem };
