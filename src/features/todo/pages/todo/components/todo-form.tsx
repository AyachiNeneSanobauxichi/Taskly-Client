import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTodoSchema,
  type CreateTodoInput,
} from "@/features/todo/schemas";
import { useCreateTodo } from "@/features/todo/hooks";

export function TodoForm() {
  const { t } = useTranslation("todo");
  const todoSchema = useMemo(() => createTodoSchema(t), [t]);
  const { register, handleSubmit, reset } = useForm<CreateTodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: { title: "" },
  });
  const createTodo = useCreateTodo();

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
