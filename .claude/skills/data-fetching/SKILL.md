---
name: data-fetching
description: TanStack Query 数据获取规范:queryKeys 工厂、useQuery/useMutation 写法、乐观更新与回滚模板、缓存失效策略。写数据获取 hooks、列表增删改查、处理 loading/error 状态时使用。
---

# 数据获取规范(TanStack Query v5)

hooks 放在 `features/<模块>/hooks/`,参考实现:`src/features/todo/hooks/use-todos.ts`。

## queryKeys 集中定义

每个模块的查询键用工厂对象集中管理,避免字符串散落拼错:

```ts
export const todoKeys = {
  all: ["todos"] as const,
  list: () => [...todoKeys.all, "list"] as const,
};
```

## 查询

```ts
export function useTodos() {
  return useQuery({ queryKey: todoKeys.list(), queryFn: todoApi.list });
}
```

组件里用 `isPending / isError / data` 三态渲染(见 `todo-list.tsx`)。`isPending` 分支**必须渲染骨架屏**(结构与真实内容一致,见 `ui-style` 技能),不要用页面级 spinner。

## 变更的两种模板

**简单失效**(新建等):成功后 `invalidateQueries` 重拉:

```ts
return useMutation({
  mutationFn: todoApi.create,
  onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.list() }),
  onError: (error: ApiError) => toast.error(error.message),
});
```

**乐观更新**(更新/删除):`onMutate` 先改本地并保存快照,`onError` 回滚,`onSettled` 失效:

```ts
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
onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.list() }),
```

## 全局配置(勿在单处随意覆盖)

`src/lib/request/query-client.ts`:staleTime 30s、gcTime 5min、关窗口聚焦重拉、**4xx 不重试**、mutation 不重试。登出时会 `queryClient.clear()`。

## 约定

- 错误 toast 统一在 mutation 的 `onError` 里做,error 类型标注为 `ApiError`。
- 成功 toast / 路由跳转等副作用也放 hooks 层,组件只调 `mutate`。
- hook 命名:`useXxx`(查询)、`useCreateXxx / useUpdateXxx / useDeleteXxx`(变更)。
