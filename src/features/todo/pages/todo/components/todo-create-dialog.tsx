import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import {
  ShadcnDialog,
  ShadcnDialogContent,
  ShadcnDialogDescription,
  ShadcnDialogHeader,
  ShadcnDialogTitle,
  ShadcnDialogTrigger,
} from "@/components/ui/dialog";
import { TodoForm } from "@/features/todo/components";

/** 新建任务:按钮触发,弹窗内嵌 TodoForm,创建成功后自动关闭 */
function TodoCreateDialog() {
  const { t } = useTranslation("todo");
  const [open, setOpen] = useState(false);

  return (
    <ShadcnDialog open={open} onOpenChange={setOpen}>
      <ShadcnDialogTrigger asChild>
        <ShadcnButton>
          <Plus className="size-4" />
          {t("actions.create")}
        </ShadcnButton>
      </ShadcnDialogTrigger>
      <ShadcnDialogContent>
        <ShadcnDialogHeader>
          <ShadcnDialogTitle>{t("create.title")}</ShadcnDialogTitle>
          <ShadcnDialogDescription>
            {t("create.description")}
          </ShadcnDialogDescription>
        </ShadcnDialogHeader>
        <TodoForm onSuccess={() => setOpen(false)} />
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
}

export { TodoCreateDialog };
