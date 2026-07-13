import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import { ShadcnCard, ShadcnCardContent } from "@/components/ui/card";
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
import { TODO_TYPES, TODO_TYPE_META } from "@/features/todo/constants";
import { useCreateTodo } from "@/features/todo/hooks";
import { useZodForm } from "@/hooks";

/** 新建任务表单:名称 + 描述 + 优先级,状态默认 pending,成功后重置 */
function TodoForm() {
  const { t } = useTranslation("todo");
  // 校验文案跟随语言,t 变化时重建 schema
  const todoSchema = useMemo(() => createTodoSchema(t), [t]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(todoSchema, {
    defaultValues: {
      name: "",
      content: "",
      type: "normal" as const,
      status: "pending" as const,
    },
  });
  const createTodo = useCreateTodo();

  const onSubmit = handleSubmit((data) => {
    createTodo.mutate(data, { onSuccess: () => reset() });
  });

  return (
    <ShadcnCard>
      <ShadcnCardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <ShadcnLabel htmlFor="todo-name">{t("form.nameLabel")}</ShadcnLabel>
            <ShadcnInput
              id="todo-name"
              placeholder={t("form.namePlaceholder")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-caption">
                {errors.name.message}
              </p>
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
                <ShadcnSelect
                  value={field.value}
                  onValueChange={field.onChange}
                >
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

          <ShadcnButton
            type="submit"
            className="w-full"
            disabled={createTodo.isPending}
          >
            {createTodo.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {t("form.submit")}
          </ShadcnButton>
        </form>
      </ShadcnCardContent>
    </ShadcnCard>
  );
}

export { TodoForm };
