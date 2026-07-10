---
name: ui-style
description: UI 与样式规范:shadcn 风格组件、Tailwind CSS v4、cn() 合并类名、lucide 图标、sonner toast、暗色主题变量。写组件 JSX、调样式、加图标、弹提示时使用。
---

# UI 与样式规范

技术栈:Tailwind CSS **v4**(`@tailwindcss/vite` 插件,无 tailwind.config)+ shadcn 风格组件(基于 radix-ui)+ lucide-react 图标 + sonner toast。

## 基础组件:优先复用 src/components/ui/

已有:`Button`、`Card`(含 Header/Title/Description/Content/Footer)、`Checkbox`、`Input`、`Label`、`Skeleton`、`Toaster`。从 `@/components` barrel 或 `@/components/ui/xxx` 导入。

需要新的基础组件(如 Select、Dialog)→ 按 shadcn 风格新建到 `src/components/ui/`:radix-ui 原语 + `cn()` + `class-variance-authority` 管理变体,并更新 `components/index.ts`。**不要**引入其他组件库。

## 类名合并:一律用 cn()

条件类名或合并 props.className 时用 `@/lib/utils` 的 `cn()`(clsx + tailwind-merge,自动处理 `px-2` vs `px-4` 这类冲突):

```tsx
<span className={cn("flex-1 text-sm", todo.completed && "text-muted-foreground line-through")}>
```

## 颜色:只用语义化 token,不用裸色值

用 `bg-background`、`text-foreground`、`text-muted-foreground`、`text-primary`、`text-destructive`、`border` 等主题变量类(定义在 `src/index.css`),**不要**写 `text-red-500` 这类硬编码颜色 —— 会破坏暗色主题。

## 图标:lucide-react

```tsx
import { Loader2, Plus, Trash2 } from "lucide-react";
<Loader2 className="size-4 animate-spin" />   // 尺寸用 size-4 / size-5
```

## 加载状态:骨架屏(强制)

页面/列表级 loading **必须用骨架屏**,且骨架结构要与真实内容一致(行高、列布局对齐),避免加载完成后布局跳动。**不要**用居中转圈 spinner 做页面级 loading。

```tsx
/** 骨架行结构与 TodoItem 一致:勾选框 + 标题 + 删除按钮 */
<li className="flex items-center gap-3 rounded-lg border px-4 py-3">
  <Skeleton className="size-4 rounded-sm" />
  <Skeleton className="h-4 flex-1" />
  <Skeleton className="size-8" />
</li>
```

参考实现:`todo-list.tsx` 的 `TodoListSkeleton`。例外:**按钮内的提交 pending** 仍用 `<Loader2 className="size-4 animate-spin" />`,那不是页面加载。

## Toast:sonner

`<Toaster>` 已挂在 `app-provider.tsx`,任何地方直接:

```ts
import { toast } from "sonner";
toast.success(t("login.success"));
toast.error(error.message);
```

## 布局惯例

- 页面容器:`space-y-*` 控制纵向间距;居中卡片页用 `flex min-h-svh items-center justify-center p-4`。
- 内容区宽度:`mx-auto max-w-3xl px-4`(与 AppLayout 一致)。
- 所有文案走 i18n(见 `i18n` 技能),不写硬编码字符串。
- JSX 里的 UI 注释保持一行简洁(注释规范见 `coding-style` 技能)。
