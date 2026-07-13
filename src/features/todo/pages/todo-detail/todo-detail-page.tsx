import { useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeNames } from "@/app/router/route-names";
import { ShadcnBadge } from "@/components/ui/badge";
import { ShadcnButton } from "@/components/ui/button";
import {
  ShadcnCard,
  ShadcnCardContent,
  ShadcnCardHeader,
  ShadcnCardTitle,
} from "@/components/ui/card";
import { ShadcnSkeleton } from "@/components/ui/skeleton";
import { TodoForm, TodoRestoreDialog } from "@/features/todo/components";
import { TODO_STATUS_META, TODO_TYPE_META } from "@/features/todo/constants";
import { useTodoDetail } from "@/features/todo/hooks";
import { usePageTitle } from "@/hooks";

/** 详情页加载骨架屏 */
function TodoDetailSkeleton() {
  return (
    <div className="space-y-4">
      <ShadcnSkeleton className="h-9 w-24" />
      <ShadcnSkeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

/** 任务详情页:展示单条任务信息,支持内联编辑(从列表带 ?edit=1 直接进编辑) */
function TodoDetailPage() {
  const { t } = useTranslation("todo");
  const { id = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "1");
  const { data: todo, isPending, isError } = useTodoDetail(id);
  usePageTitle(todo?.name ?? t("detail.title"));

  const exitEdit = () => {
    setIsEditing(false);
    if (searchParams.has("edit")) {
      searchParams.delete("edit");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const backButton = (
    <ShadcnButton variant="ghost" size="sm" asChild>
      <Link to={routeNames.home}>
        <ArrowLeft className="size-4" />
        {t("detail.back")}
      </Link>
    </ShadcnButton>
  );

  if (isPending) {
    return <TodoDetailSkeleton />;
  }

  if (isError || !todo) {
    return (
      <div className="space-y-4">
        {backButton}
        <p className="text-muted-foreground text-caption py-10 text-center">
          {t("detail.notFound")}
        </p>
      </div>
    );
  }

  const typeMeta = TODO_TYPE_META[todo.type];
  const statusMeta = TODO_STATUS_META[todo.status];
  // 已删除的任务不可编辑,只能恢复
  const isDeleted = todo.status === "deleted";
  const editing = isEditing && !isDeleted;

  return (
    <div className="space-y-4">
      {backButton}
      <ShadcnCard>
        <ShadcnCardHeader>
          <div className="flex items-start justify-between gap-2">
            {editing ? (
              <ShadcnCardTitle className="text-heading">
                {t("edit.title")}
              </ShadcnCardTitle>
            ) : (
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <ShadcnBadge variant={typeMeta.variant}>
                    {t(typeMeta.labelKey)}
                  </ShadcnBadge>
                  <ShadcnBadge variant={statusMeta.variant}>
                    {t(statusMeta.labelKey)}
                  </ShadcnBadge>
                </div>
                <ShadcnCardTitle className="text-title break-words">
                  {todo.name}
                </ShadcnCardTitle>
              </div>
            )}
            {!editing &&
              (isDeleted ? (
                <TodoRestoreDialog id={todo._id} name={todo.name} />
              ) : (
                <ShadcnButton
                  variant="ghost"
                  size="icon"
                  aria-label={t("actions.edit")}
                  className="text-muted-foreground hover:text-primary shrink-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="size-4" />
                </ShadcnButton>
              ))}
          </div>
        </ShadcnCardHeader>
        <ShadcnCardContent className="space-y-4">
          {editing ? (
            <>
              <TodoForm todo={todo} onSuccess={exitEdit} />
              <ShadcnButton
                variant="ghost"
                className="w-full"
                onClick={exitEdit}
              >
                {t("actions.cancel")}
              </ShadcnButton>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-muted-foreground text-label">
                  {t("detail.contentLabel")}
                </p>
                <p className="text-body break-words whitespace-pre-wrap">
                  {todo.content}
                </p>
              </div>
              <div className="text-muted-foreground text-caption space-y-1">
                <p>
                  {t("detail.createdAt")}
                  {new Date(todo.createdAt).toLocaleString()}
                </p>
                <p>
                  {t("detail.updatedAt")}
                  {new Date(todo.updatedAt).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </ShadcnCardContent>
      </ShadcnCard>
    </div>
  );
}

export { TodoDetailPage };
