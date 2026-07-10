import { useMemo } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import { ShadcnInput } from "@/components/ui/input";
import { createTodoSchema } from "@/features/todo/schemas";
import { useCreateTodo } from "@/features/todo/hooks";
import { useZodForm } from "@/hooks";

function TodoForm() {
  const { t } = useTranslation("todo");
  // 校验文案跟随语言,t 变化时重建 schema
  const todoSchema = useMemo(() => createTodoSchema(t), [t]);
  const { register, handleSubmit, reset } = useZodForm(todoSchema, {
    defaultValues: { title: "" },
  });
  const createTodo = useCreateTodo();

  // 提交成功后清空输入框
  const onSubmit = handleSubmit((data) => {
    createTodo.mutate(data, { onSuccess: () => reset() });
  });

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <ShadcnInput placeholder={t("form.placeholder")} {...register("title")} />
      <ShadcnButton type="submit" disabled={createTodo.isPending}>
        <Plus className="size-4" />
        {t("form.submit")}
      </ShadcnButton>
    </form>
  );
}

export { TodoForm };
