import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { todoApi } from "../api/todo.api";
import type { Todo } from "../types";
import type { CreateTodoInput, UpdateTodoInput } from "../schemas";
import type { ApiError } from "@/lib/request";

/** 查询键集中定义，避免散落各处拼错字符串 */
export const todoKeys = {
  all: ["todos"] as const,
  list: () => [...todoKeys.all, "list"] as const,
};

/** 任务列表 */
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.list(),
    queryFn: todoApi.list,
  });
}

/** 新建任务：成功后让列表失效重新拉取 */
export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: todoKeys.list() });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

/** 更新任务（含勾选）：乐观更新 —— 先改本地，失败再回滚 */
export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todoApi.update(id, input),
    onMutate: async ({ id, input }) => {
      await qc.cancelQueries({ queryKey: todoKeys.list() });
      const previous = qc.getQueryData<Todo[]>(todoKeys.list());
      qc.setQueryData<Todo[]>(todoKeys.list(), (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, ...input } : t)),
      );
      return { previous };
    },
    onError: (error: ApiError, _vars, context) => {
      qc.setQueryData(todoKeys.list(), context?.previous);
      toast.error(error.message);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: todoKeys.list() });
    },
  });
}

/** 删除任务：同样乐观更新 */
export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: todoKeys.list() });
      const previous = qc.getQueryData<Todo[]>(todoKeys.list());
      qc.setQueryData<Todo[]>(todoKeys.list(), (old) =>
        (old ?? []).filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (error: ApiError, _id, context) => {
      qc.setQueryData(todoKeys.list(), context?.previous);
      toast.error(error.message);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: todoKeys.list() });
    },
  });
}
