import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import { useDeleteTodo } from "@/features/todo/hooks";
import { TodoConfirmDialog } from "@/features/todo/components";

/** 删除任务:二次确认弹窗,确认后才真正删除 */
function TodoDeleteDialog({ id, name }: { id: string; name: string }) {
  const { t } = useTranslation("todo");
  const [open, setOpen] = useState(false);
  const deleteTodo = useDeleteTodo();

  return (
    <TodoConfirmDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <ShadcnButton
          variant="ghost"
          size="icon"
          aria-label={t("actions.delete")}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </ShadcnButton>
      }
      title={t("delete.title")}
      description={t("delete.message", { name })}
      confirmLabel={t("delete.confirm")}
      confirmVariant="destructive"
      isPending={deleteTodo.isPending}
      onConfirm={() =>
        deleteTodo.mutate(id, { onSuccess: () => setOpen(false) })
      }
    />
  );
}

export { TodoDeleteDialog };
