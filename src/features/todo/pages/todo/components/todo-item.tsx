import type { Todo } from "@/features/todo/types";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toTodoDetailPath } from "@/app/router/route-names";
import { ShadcnBadge } from "@/components/ui/badge";
import { ShadcnButton } from "@/components/ui/button";
import { TODO_STATUS_META, TODO_TYPE_META } from "@/features/todo/constants";
import { useDeleteTodo } from "@/features/todo/hooks";

/** 单条任务卡片:名称(点击进详情)+ 优先级/状态徽标 + 描述预览 + 删除按钮 */
function TodoItem({ todo }: { todo: Todo }) {
  const { t } = useTranslation("todo");
  const deleteTodo = useDeleteTodo();
  const typeMeta = TODO_TYPE_META[todo.type];
  const statusMeta = TODO_STATUS_META[todo.status];

  return (
    <li className="hover:bg-accent/40 flex items-start gap-3 rounded-xl border p-4 transition-colors">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={toTodoDetailPath(todo._id)}
            className="text-label hover:text-primary hover:underline"
          >
            {todo.name}
          </Link>
          <ShadcnBadge variant={typeMeta.variant}>
            {t(typeMeta.labelKey)}
          </ShadcnBadge>
          <ShadcnBadge variant={statusMeta.variant}>
            {t(statusMeta.labelKey)}
          </ShadcnBadge>
        </div>
        <p className="text-muted-foreground text-caption line-clamp-2 break-words">
          {todo.content}
        </p>
      </div>
      <ShadcnButton
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive shrink-0"
        onClick={() => deleteTodo.mutate(todo._id)}
        disabled={deleteTodo.isPending}
      >
        <Trash2 className="size-4" />
      </ShadcnButton>
    </li>
  );
}

export { TodoItem };
