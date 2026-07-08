import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodoSchema, type CreateTodoInput } from "../schemas";
import { useCreateTodo } from "../hooks/use-todos";

export function TodoForm() {
  const { register, handleSubmit, reset } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "" },
  });
  const createTodo = useCreateTodo();

  const onSubmit = handleSubmit((data) => {
    createTodo.mutate(data, { onSuccess: () => reset() });
  });

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input placeholder="添加一个新任务…" {...register("title")} />
      <Button type="submit" disabled={createTodo.isPending}>
        <Plus className="size-4" />
        添加
      </Button>
    </form>
  );
}
