---
name: coding-style
description: 代码书写强制规范:导出统一放文件底部、import type 分离置顶、类型/常量拆分到 types.ts 和 constants.ts、注释要求、TODO 标记格式、页面拆分粒度。写任何 ts/tsx 代码、新建文件、重构时使用。
---

# 代码书写规范

> 本技能的核心条款已由 ESLint 机器化强制(`eslint.config.ts`),并通过 husky pre-commit 门禁在提交时拦截(见 `dev-workflow` 技能)。写代码时按下述规范来,lint 报错信息里也会引用对应条款。

## 导出:统一放文件底部

先声明,后在文件**最底部**集中导出;类型导出用 `export type`。禁止 default export,禁止 `export function Xxx` 行内导出。

```ts
function TodoForm() {
  /* … */
}

interface TodoFormProps {
  /* … */
}

export { TodoForm };
export type { TodoFormProps };
```

## 导入:import type 分离并置顶

- `import type` 与值导入**分开写**,不允许 `import { x, type Y }` 混写。
- 所有 `import type` 放在文件**最上面**,值导入放在其下。

```ts
// ✅ 正确顺序
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ❌ 混写
import { useForm, type FieldValues } from "react-hook-form";
```

参考实现:`src/hooks/use-zod-form/use-zod-form.ts`。

## 类型与常量:拆到同目录的单独文件,不混进业务代码

类型、常量不堆在实现文件里,拆到**同一目录下**的单独文件:

- **多文件/多页面共享** → 目录级 `types.ts` / `constants.ts`。feature 模块级共享放模块根 `types.ts`(前端模型);页面/组件级放页面文件夹下的 `types.ts` / `constants.ts`(如 `pages/todo/components/constants.ts` 的 `SKELETON_ROW_COUNT`);全局 hooks/utils/components 放各自文件夹内(见 `project-structure` 技能的文件夹模式)。
- **只服务单个实现文件的专属类型** → 拆到**平级同名 sibling 文件**,与实现文件成对出现,由所在目录 `index.ts` 统一导出;实现文件从**具体文件路径**引入 sibling(走目录 barrel 会与自身成环):
  - api 的后端原始结构 → `xxx.dto.ts`(见 `api-request` 技能)。
  - 其余一律 → `xxx.types.ts`。如 store 的 state:`auth.store.ts` + `auth.store.types.ts`(参照 `auth.api.ts` + `auth.dto.ts` 那对)。

```
features/auth/store/
├─ index.ts             # export * from "./auth.store"; export * from "./auth.store.types"
├─ auth.store.ts        # 只有 store 实现,import type { AuthState } from "@/features/auth/store/auth.store.types"
└─ auth.store.types.ts  # AuthState —— 与 store 平级、专属服务它
```

**强制**:`*.store.ts` / `*.api.ts` 里**禁止出现 `interface` / `type` 声明**(由 ESLint `no-restricted-syntax` 强制),必须拆到平级 sibling。

例外:组件自身轻量的 `Props` 类型可留在组件文件内(见上方「导出」示例的 `TodoFormProps`)。组件内部纯粹的局部变量不算常量,不必强拆;凡是魔法数字/可复用配置必须拆。

## 注释规范

- **函数必须有规范注释**:用中文 `/** … */` 说明职责;参数/返回值不自明时补充说明。
- **重要步骤加行注释**:如乐观更新的快照/回滚、循环依赖的规避、非直觉的分支。
- **tsx 的 UI 注释要简洁**:一行说清即可(如 `{/* 加载骨架屏 */}`),不要在 JSX 里写大段注释。

## TODO 标记

未完成的地方必须留可搜索的 tag + 具体说明(缺什么、下一步做什么),方便全局搜索 `TODO` 补全:

```ts
// TODO: 接入真实的分页参数,当前后端接口尚未支持 page/pageSize
```

## 页面拆分粒度

- 页面文件不要过长(超过约 150 行就该考虑拆)。
- 逻辑拆成 hooks(页面级放页面文件夹,跨模块放 `src/hooks/`),UI 拆成子组件(放 `pages/<页面>/components/`)。
- 一个文件只做一件事;参考 `pages/todo/`:页面壳 + `components/` 下的 form/list/item。

## 存量代码

以上规范**新代码强制执行**;存量文件渐进迁移——改到哪个文件就顺手迁移哪个,不做全仓库大改。
