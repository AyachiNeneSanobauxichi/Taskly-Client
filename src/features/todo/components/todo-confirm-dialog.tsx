import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import {
  ShadcnDialog,
  ShadcnDialogClose,
  ShadcnDialogContent,
  ShadcnDialogDescription,
  ShadcnDialogFooter,
  ShadcnDialogHeader,
  ShadcnDialogTitle,
  ShadcnDialogTrigger,
} from "@/components/ui/dialog";

interface TodoConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 触发弹窗的元素(通常是图标按钮),作为 DialogTrigger 的 asChild 子节点 */
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: ComponentProps<typeof ShadcnButton>["variant"];
  isPending: boolean;
  onConfirm: () => void;
}

/** 通用二次确认弹窗:删除 / 恢复等破坏性或状态变更操作共用 */
function TodoConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmLabel,
  confirmVariant = "default",
  isPending,
  onConfirm,
}: TodoConfirmDialogProps) {
  const { t } = useTranslation("todo");

  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange}>
      <ShadcnDialogTrigger asChild>{trigger}</ShadcnDialogTrigger>
      <ShadcnDialogContent>
        <ShadcnDialogHeader>
          <ShadcnDialogTitle>{title}</ShadcnDialogTitle>
          <ShadcnDialogDescription>{description}</ShadcnDialogDescription>
        </ShadcnDialogHeader>
        <ShadcnDialogFooter>
          <ShadcnDialogClose asChild>
            <ShadcnButton variant="outline">{t("actions.cancel")}</ShadcnButton>
          </ShadcnDialogClose>
          <ShadcnButton
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </ShadcnButton>
        </ShadcnDialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
}

export { TodoConfirmDialog };
