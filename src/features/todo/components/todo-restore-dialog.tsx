import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import { useUpdateTodo } from "@/features/todo/hooks";
import { TodoConfirmDialog } from "@/features/todo/components/todo-confirm-dialog";

/** 恢复已删除的任务:二次确认弹窗,确认后将状态改回 pending */
function TodoRestoreDialog({ id, name }: { id: string; name: string }) {
  const { t } = useTranslation("todo");
  const [open, setOpen] = useState(false);
  const updateTodo = useUpdateTodo("toast.restored");

  return (
    <TodoConfirmDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <ShadcnButton
          variant="ghost"
          size="icon"
          aria-label={t("actions.restore")}
          className="text-muted-foreground hover:text-primary"
        >
          <RotateCcw className="size-4" />
        </ShadcnButton>
      }
      title={t("restore.title")}
      description={t("restore.message", { name })}
      confirmLabel={t("restore.confirm")}
      isPending={updateTodo.isPending}
      onConfirm={() =>
        updateTodo.mutate(
          { id, input: { status: "pending" } },
          { onSuccess: () => setOpen(false) },
        )
      }
    />
  );
}

export { TodoRestoreDialog };
