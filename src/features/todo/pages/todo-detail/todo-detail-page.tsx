import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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
import { useTodoDetail } from "@/features/todo/hooks";
import { TODO_STATUS_META, TODO_TYPE_META } from "@/features/todo/constants";
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

/** 任务详情页:展示单条任务的名称、描述、优先级、状态与时间 */
function TodoDetailPage() {
  const { t } = useTranslation("todo");
  const { id = "" } = useParams();
  const { data: todo, isPending, isError } = useTodoDetail(id);
  usePageTitle(todo?.name ?? t("detail.title"));

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

  return (
    <div className="space-y-4">
      {backButton}
      <ShadcnCard>
        <ShadcnCardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <ShadcnBadge variant={typeMeta.variant}>
              {t(typeMeta.labelKey)}
            </ShadcnBadge>
            <ShadcnBadge variant={statusMeta.variant}>
              {t(statusMeta.labelKey)}
            </ShadcnBadge>
          </div>
          <ShadcnCardTitle className="text-title">{todo.name}</ShadcnCardTitle>
        </ShadcnCardHeader>
        <ShadcnCardContent className="space-y-4">
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
        </ShadcnCardContent>
      </ShadcnCard>
    </div>
  );
}

export { TodoDetailPage };
