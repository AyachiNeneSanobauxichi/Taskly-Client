import type { TodoListParams, TodoListResponse } from "@/features/todo/types";
import type { CreateTodoInput, UpdateTodoInput } from "@/features/todo/schemas";
import type { ApiError } from "@/lib/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { todoApi } from "@/features/todo/api";

/** 查询键集中定义，避免散落各处拼错字符串 */
const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (params?: TodoListParams) =>
    [...todoKeys.lists(), params ?? {}] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};

/** 任务列表：随查询参数(搜索/分页/排序)变化缓存 */
function useTodos(params?: TodoListParams) {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => todoApi.list(params),
  });
}

/** 单个任务详情 */
function useTodoDetail(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoApi.detail(id),
    enabled: Boolean(id),
  });
}

/** 新建任务：成功后提示 + 让所有列表变体失效重新拉取 */
function useCreateTodo() {
  const { t } = useTranslation("todo");
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
      toast.success(t("toast.created"));
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

/** 更新任务：乐观更新所有列表变体 —— 先改本地，失败再回滚;成功文案可区分(编辑/恢复) */
function useUpdateTodo(
  successMessageKey: "toast.updated" | "toast.restored" = "toast.updated",
) {
  const { t } = useTranslation("todo");
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todoApi.update(id, input),
    onMutate: async ({ id, input }) => {
      await qc.cancelQueries({ queryKey: todoKeys.lists() });
      // 快照所有列表变体(不同搜索/分页参数),失败时逐一回滚
      const previous = qc.getQueriesData<TodoListResponse>({
        queryKey: todoKeys.lists(),
      });
      qc.setQueriesData<TodoListResponse>(
        { queryKey: todoKeys.lists() },
        (old) =>
          old
            ? {
                ...old,
                docs: old.docs.map((t) =>
                  t._id === id ? { ...t, ...input } : t,
                ),
              }
            : old,
      );
      return { previous };
    },
    onSuccess: () => toast.success(t(successMessageKey)),
    onError: (error: ApiError, _vars, context) => {
      context?.previous?.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(error.message);
    },
    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
      qc.invalidateQueries({ queryKey: todoKeys.detail(id) });
    },
  });
}

/** 删除任务：同样乐观更新所有列表变体 */
function useDeleteTodo() {
  const { t } = useTranslation("todo");
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: todoKeys.lists() });
      const previous = qc.getQueriesData<TodoListResponse>({
        queryKey: todoKeys.lists(),
      });
      qc.setQueriesData<TodoListResponse>(
        { queryKey: todoKeys.lists() },
        (old) =>
          old
            ? {
                ...old,
                docs: old.docs.filter((t) => t._id !== id),
                totalDocs: Math.max(0, old.totalDocs - 1),
              }
            : old,
      );
      return { previous };
    },
    onSuccess: () => toast.success(t("toast.deleted")),
    onError: (error: ApiError, _id, context) => {
      context?.previous?.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(error.message);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

export {
  todoKeys,
  useCreateTodo,
  useDeleteTodo,
  useTodoDetail,
  useTodos,
  useUpdateTodo,
};
