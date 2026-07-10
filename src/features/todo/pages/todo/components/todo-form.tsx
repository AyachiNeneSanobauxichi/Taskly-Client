import { useMemo } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <Input placeholder={t("form.placeholder")} {...register("title")} />
      <Button type="submit" disabled={createTodo.isPending}>
        <Plus className="size-4" />
        {t("form.submit")}
      </Button>
    </form>
  );
}

export { TodoForm };
