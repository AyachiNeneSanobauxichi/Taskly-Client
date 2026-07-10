---
name: react-19
description: React 19 写法规范:禁用 forwardRef/Context.Provider/useContext/React.FC 等老写法,ref 作为普通 prop、use() 读取 Context、ref 清理函数。写任何组件、hooks、Context 相关代码时使用。
---

# React 19 写法规范

本项目使用 **React 19**(见 `package.json`),按 19 的新写法来,下列老写法**禁止**再出现在新代码里。核心条款已由 ESLint 强制(`eslint.config.ts` 的 no-restricted-imports / no-restricted-syntax),提交时会被 pre-commit 门禁拦截。

## ❌ forwardRef —— ref 直接当普通 prop

React 19 中函数组件的 `ref` 就是一个普通 prop,不再需要 `forwardRef` 包裹:

```tsx
// ✅ React 19
function MyInput({ ref, ...props }: MyInputProps) {
  return <input ref={ref} {...props} />;
}

interface MyInputProps extends ComponentProps<"input"> {
  ref?: Ref<HTMLInputElement>;
}

// ❌ 老写法
const MyInput = forwardRef<HTMLInputElement, MyInputProps>((props, ref) => …);
```

## ❌ Context.Provider —— 直接渲染 Context

```tsx
// ✅ React 19
<ThemeContext value={theme}>{children}</ThemeContext>

// ❌ 老写法
<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
```

## ❌ useContext —— 用 use()

`use(Context)` 替代 `useContext(Context)`,且 `use` 可以在条件分支/循环里调用:

```tsx
// ✅ React 19
const theme = use(ThemeContext);

// ❌ 老写法
const theme = useContext(ThemeContext);
```

## ref 回调可以返回清理函数

需要在元素卸载时做清理的,直接在 ref 回调里返回清理函数,不要再用「ref + useEffect」组合:

```tsx
<div
  ref={(node) => {
    observer.observe(node);
    return () => observer.disconnect();
  }}
/>
```

## ❌ 其他已淘汰写法

- **`React.FC` / `React.FunctionComponent`** —— 直接写函数 + 显式 props 类型。
- **`defaultProps` / `propTypes`** —— React 19 已移除(函数组件),默认值用参数解构默认值。
- **`import React from "react"`** —— 新 JSX transform 下无需引入;只按需具名导入(`import { useState } from "react"`)。
- **`useRef()` 不传参** —— 19 的类型要求必须传初始值,写 `useRef<T>(null)`。

## memo / useMemo / useCallback:按需,不要到处包

项目**未启用 React Compiler**,这三个 API 仍然有效,但只在有明确必要时用(大列表 item、传给被 memo 子组件的回调、昂贵计算);不要给每个组件/函数条件反射式包一层。

## 与项目现有惯例的边界

- **表单不用 React 19 的 form actions**(`useActionState` / `useFormStatus`):项目表单统一走 react-hook-form + zod(见 `forms` 技能),不要混用两套。
- **乐观更新不用 `useOptimistic`**:统一走 TanStack Query 的 `onMutate` 快照/回滚模板(见 `data-fetching` 技能)。
- **页面标题不直接渲染 `<title>`**:虽然 19 支持,但项目统一用 `usePageTitle`(见 `global-hooks` 技能)。

## 存量代码

新代码强制执行;存量文件里的老写法改到哪个文件就顺手迁移哪个。
