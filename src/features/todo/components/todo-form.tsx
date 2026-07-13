import type { Todo } from "@/features/todo/types";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import { ShadcnInput } from "@/components/ui/input";
import { ShadcnLabel } from "@/components/ui/label";
import {
  ShadcnSelect,
  ShadcnSelectContent,
  ShadcnSelectItem,
  ShadcnSelectTrigger,
  ShadcnSelectValue,
} from "@/components/ui/select";
import { ShadcnTextarea } from "@/components/ui/textarea";
import { createTodoSchema } from "@/features/todo/schemas";
import {
  TODO_STATUSES,
  TODO_STATUS_META,
  TODO_TYPES,
  TODO_TYPE_META,
} from "@/features/todo/constants";
import { useCreateTodo, useUpdateTodo } from "@/features/todo/hooks";
import { useZodForm } from "@/hooks";

interface TodoFormProps {
  /** 传入则为编辑模式(展示状态字段、走更新接口),否则为新建模式 */
  todo?: Todo;
  /** 提交成功回调(关闭弹窗 / 退出编辑) */
  onSuccess?: () => void;
}

/** 任务表单:新建(名称+描述+优先级,状态默认 pending)与编辑(额外可改状态)共用 */
function TodoForm({ todo, onSuccess }: TodoFormProps) {
  const { t } = useTranslation("todo");
  const isEdit = Boolean(todo);
  // 校验文案跟随语言,t 变化时重建 schema
  const todoSchema = useMemo(() => createTodoSchema(t), [t]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(todoSchema, {
    defaultValues: todo
      ? {
          name: todo.name,
          content: todo.content,
          type: todo.type,
          status: todo.status,
        }
      : {
          name: "",
          content: "",
          type: "normal" as const,
          status: "pending" as const,
        },
  });
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const isPending = isEdit ? updateTodo.isPending : createTodo.isPending;

  const onSubmit = handleSubmit((data) => {
    if (todo) {
      updateTodo.mutate(
        { id: todo._id, input: data },
        { onSuccess: () => onSuccess?.() },
      );
      return;
    }
    createTodo.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <ShadcnLabel htmlFor="todo-name">{t("form.nameLabel")}</ShadcnLabel>
        <ShadcnInput
          id="todo-name"
          placeholder={t("form.namePlaceholder")}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-destructive text-caption">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <ShadcnLabel htmlFor="todo-content">
          {t("form.contentLabel")}
        </ShadcnLabel>
        <ShadcnTextarea
          id="todo-content"
          placeholder={t("form.contentPlaceholder")}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-destructive text-caption">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <ShadcnLabel htmlFor="todo-type">{t("form.typeLabel")}</ShadcnLabel>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <ShadcnSelect value={field.value} onValueChange={field.onChange}>
              <ShadcnSelectTrigger id="todo-type" className="w-full">
                <ShadcnSelectValue />
              </ShadcnSelectTrigger>
              <ShadcnSelectContent>
                {TODO_TYPES.map((type) => (
                  <ShadcnSelectItem key={type} value={type}>
                    {t(TODO_TYPE_META[type].labelKey)}
                  </ShadcnSelectItem>
                ))}
              </ShadcnSelectContent>
            </ShadcnSelect>
          )}
        />
      </div>

      {isEdit && (
        <div className="space-y-2">
          <ShadcnLabel htmlFor="todo-status">
            {t("form.statusLabel")}
          </ShadcnLabel>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <ShadcnSelect value={field.value} onValueChange={field.onChange}>
                <ShadcnSelectTrigger id="todo-status" className="w-full">
                  <ShadcnSelectValue />
                </ShadcnSelectTrigger>
                <ShadcnSelectContent>
                  {TODO_STATUSES.map((status) => (
                    <ShadcnSelectItem key={status} value={status}>
                      {t(TODO_STATUS_META[status].labelKey)}
                    </ShadcnSelectItem>
                  ))}
                </ShadcnSelectContent>
              </ShadcnSelect>
            )}
          />
        </div>
      )}

      <ShadcnButton type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {t("form.submit")}
      </ShadcnButton>
    </form>
  );
}

export { TodoForm };
