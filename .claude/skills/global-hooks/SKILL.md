---
name: global-hooks
description: 全局 hooks(src/hooks)清单与用法:useZodForm 表单、useLanguage 语言切换、usePageTitle 页面标题;新增全局 hook 的文件夹模式模板。写表单、切换语言、设置页面标题、新增跨模块 hook 时使用。
---

# 全局 Hooks(src/hooks)

跨 feature 复用的 hooks 放 `src/hooks/`,每个 hook 一个文件夹(文件夹模式),从 `@/hooks` 统一导入。

## 现有 hooks

### useZodForm —— 表单标准入口(RHF + zod)

所有表单**必须**用它,不要手写 `useForm + zodResolver`:

```tsx
const { t } = useTranslation("todo");
const todoSchema = useMemo(() => createTodoSchema(t), [t]);
const { register, handleSubmit, formState: { errors } } = useZodForm(todoSchema, {
  defaultValues: { title: "" },
});
```

表单类型从 schema 自动推导,无需再传泛型。

### useLanguage —— 语言状态与切换

```tsx
const { current, next, languages, change, toggle } = useLanguage();
```

`toggle` 双语互切(语言切换按钮用它);`change(code)` 切到指定语言。不要绕过它直接摸 `i18n.changeLanguage`。

### usePageTitle —— 页面标题

每个页面组件顶部调用,自动拼「页面标题 · 应用名」并在卸载时还原:

```tsx
const { t } = useTranslation("todo");
usePageTitle(t("page.title"));
```

## 新增全局 hook 的模板(文件夹模式)

```
src/hooks/use-xxx/
├─ index.ts        export * from "./use-xxx"; export type * from "./types";
├─ use-xxx.ts      实现(函数 JSDoc 注释,底部 export)
├─ types.ts        该 hook 的类型(有则建)
└─ constants.ts    该 hook 的常量(有则建)
```

建完后在 `src/hooks/index.ts` 注册。

## 判断:该不该新增全局 hook

1. 只有一个页面用 → 放页面文件夹,不进全局。
2. 通用工具型需求(防抖、localStorage、媒体查询…)→ **不要手写**,优先装成熟包(如 ahooks / usehooks-ts,见 `dev-workflow` 的依赖策略)。
3. 与本项目已装包(TanStack Query、RHF、zod、i18next、zustand…)的**组合胶水**逻辑 → 适合放这里(useZodForm 就是这类)。
