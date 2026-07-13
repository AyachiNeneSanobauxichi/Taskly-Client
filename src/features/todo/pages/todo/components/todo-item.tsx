import type { Todo } from "@/features/todo/types";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toTodoDetailPath } from "@/app/router/route-names";
import { ShadcnBadge } from "@/components/ui/badge";
import { ShadcnButton } from "@/components/ui/button";
import { TODO_STATUS_META, TODO_TYPE_META } from "@/features/todo/constants";
import { TodoRestoreDialog } from "@/features/todo/components";
import { TodoDeleteDialog } from "@/features/todo/pages/todo/components/todo-delete-dialog";

/** 单条任务卡片:名称(点击进详情)+ 优先级/状态徽标 + 描述预览 + 操作区(删除态仅显示恢复) */
function TodoItem({ todo }: { todo: Todo }) {
  const { t } = useTranslation("todo");
  const typeMeta = TODO_TYPE_META[todo.type];
  const statusMeta = TODO_STATUS_META[todo.status];
  const isDeleted = todo.status === "deleted";

  return (
    <li className="hover:border-primary/40 hover:bg-accent/30 flex items-start gap-3 rounded-xl border p-4 shadow-xs transition-colors">
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
      <div className="flex shrink-0 items-center gap-1">
        {isDeleted ? (
          <TodoRestoreDialog id={todo._id} name={todo.name} />
        ) : (
          <>
            <ShadcnButton
              variant="ghost"
              size="icon"
              aria-label={t("actions.edit")}
              className="text-muted-foreground hover:text-primary"
              asChild
            >
              <Link to={`${toTodoDetailPath(todo._id)}?edit=1`}>
                <Pencil className="size-4" />
              </Link>
            </ShadcnButton>
            <TodoDeleteDialog id={todo._id} name={todo.name} />
          </>
        )}
      </div>
    </li>
  );
}

export { TodoItem };
