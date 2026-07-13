---
name: project-structure
description: 项目目录结构与文件组织规范:feature 模块划分、公共组件/方法的抽取与归属(禁止重复代码)、index.ts 出口文件、页面文件夹、全局 hooks/components 的文件夹模式、task- 组件命名、类型与常量的归属位置。新建功能模块、新建页面、新增组件/hook、发现重复代码、移动/重构文件、决定代码放哪里时使用。
---

# 项目结构规范

## 顶层布局

```
src/
├─ app/          应用装配层:全局 Provider(provider/)+ 路由(router/)
├─ components/   跨 feature 复用的组件:ui/(shadcn 基础组件)、layout/、task-*/(全局业务组件)
├─ features/     业务功能模块(auth、todo…),按模块自治
├─ hooks/        跨 feature 复用的全局 hooks(文件夹模式,从 @/hooks 导入)
├─ lib/          与业务无关的基础设施:env/、i18n/、request/、utils/
└─ test/         测试全局配置(setup.ts)
```

## 铁律:每个文件夹都有 index.ts 出口

每个文件夹用 `index.ts` 作为唯一出口(barrel),外部只从 barrel 导入。新增文件后**必须**同步更新所在文件夹的 `index.ts`。

## feature 模块内部结构(以 todo 为例)

```
features/todo/
├─ index.ts        模块总出口:re-export types/schemas/api/hooks/pages
├─ types.ts        跨页面共享的类型
├─ schemas.ts      跨页面共享的 zod schema
├─ api/            纯接口请求层(不含副作用);后端 DTO 放 xxx.dto.ts(与 api 文件平级),见 api-request 技能
├─ hooks/          TanStack Query hooks
├─ store/          zustand store(如 auth 有,todo 没有)
└─ pages/
   └─ todo/                  每个页面一个文件夹
      ├─ index.ts
      ├─ todo-page.tsx
      └─ components/         仅本页面使用的组件放这里
         ├─ index.ts
         ├─ constants.ts     本页组件用到的常量
         └─ todo-form.tsx …
```

## 归属判断规则

- **仅单页面**使用的 type / component / 常量 → 该页面文件夹(`pages/<页面>/components/`、同目录 `types.ts` / `constants.ts`)。
- **跨页面**(同 feature)共享 → feature 模块根(`types.ts`、`schemas.ts`)或模块级目录。
- **跨 feature(横跨组件)的 hooks** → `src/hooks/`;**组件** → `src/components/`;**工具** → `src/lib/utils/`。
- **只服务单个实现文件**的专属类型 → 平级同名 sibling 文件:api 后端结构用 `xxx.dto.ts`,其余(如 store 的 state)用 `xxx.types.ts`(`auth.store.ts` + `auth.store.types.ts`)。
- 类型/常量不堆在实现文件里,拆到同目录 `types.ts` / `constants.ts` 或平级 sibling(详见 `coding-style` 技能);`*.store.ts` / `*.api.ts` 内禁写 `interface` / `type`,ESLint 已强制。

## 公共代码必须抽取:禁止复制粘贴

**相同/近似的组件或方法不允许在仓库里存在多份拷贝。** 准备复制一段已有代码时,就是该抽取的时刻:

- 同一 feature 内两个页面要用 → 抽到 feature 模块级(模块根 `utils.ts` / 模块 `components/` 目录)。
- 跨 feature 要用 → 抽到全局:组件 → `src/components/`(`task-` 前缀),hooks → `src/hooks/`,工具函数 → `src/lib/utils/`(通用工具先查 es-toolkit,见 `dev-workflow` 技能)。
- 抽取时按上面「归属判断规则」放到**够用的最小层级**,不要一步全提到全局;后续第三处使用出现、层级不够时再上提。
- 写新功能前先搜同类实现(同名组件、相似 hook),已有的复用/扩展,不新写一份。

## 全局 hooks / utils / components:必须文件夹模式

全局层新增的每个单元都是一个文件夹,内部拆开(types.ts / constants.ts 有内容才建,不建空文件):

```
src/hooks/use-xxx/          src/components/task-xxx/
├─ index.ts                 ├─ index.ts
├─ use-xxx.ts               ├─ task-xxx.tsx
├─ types.ts                 ├─ types.ts
└─ constants.ts             └─ constants.ts
```

## 全局组件命名:task- 前缀

- 新增的全局业务组件:文件夹/文件名 `task-` 前缀 kebab-case,导出名 `Task` 前缀 PascalCase。例:`components/task-confirm-dialog/` → `export { TaskConfirmDialog }`。
- **豁免**:`components/ui/` 下的 shadcn 基础组件(button、card…)视为第三方代码,不加 `task-` 前缀、不强制文件夹模式;但导出名统一加 `Shadcn` 前缀与自定义组件区分(见 `ui-style` 技能)。
- **存量**(AppLayout、LanguageSwitcher、NotFoundPage)渐进迁移:暂不改名,后续大改到它们时再迁移。

## 导入路径规则

- **禁止相对路径导入,一律用 `@/` 绝对路径**(`@/*` → `src/*`)。唯一例外见下。已由 ESLint `no-restricted-imports` 强制,违反直接报错。
- 导入时选「**在不产生循环依赖的前提下,最上层的 `index.ts` 出口**」:
  - 跨 feature / 外部消费者(router、layout 等)→ 模块根 barrel:`import { TodoPage } from "@/features/todo"`。
  - feature 内部代码引本模块共享代码(走根 barrel 会成环)→ 子路径 barrel:`@/features/todo/hooks`、`@/features/auth/schemas`、`@/features/auth/api`。
  - 子路径 barrel 仍会成环时(该目录 barrel 会 re-export 引用方自身,如同目录组件互引、`lib/request` 内部)→ 指向具体文件:`@/features/todo/pages/todo/components/todo-item`、`@/lib/request/types`。
- **唯一例外**:`index.ts` 出口文件用 `./` 聚合**同目录**兄弟文件(`export * from "./xxx"`)—— 这是 barrel 固有职责、不跨模块,ESLint 已放行;但 index.ts 里同样禁止 `../`。
- 全局 hooks 从 `@/hooks` 导入。
- 仓库根的工具/构建配置(`*.config.ts`,`@/` 够不到根级文件如 `eslint-rules/`)豁免本规则。

## 命名约定

- 文件名:kebab-case(`todo-form.tsx`、`use-todos.ts`、`auth.store.ts`)。
- api 文件带 `.api.ts` 后缀,store 带 `.store.ts` 后缀,页面带 `-page.tsx` 后缀,hooks 以 `use-` 开头。
- 实现文件的专属类型放平级 sibling:api 后端结构 `xxx.dto.ts`,其余 `xxx.types.ts`(如 `auth.store.types.ts`)。
- 组件/函数一律命名导出,禁 default export;导出语句统一放文件底部(写法见 `coding-style` 技能)。
- 注释用中文,风格与现有代码一致(`/** … */` 说明职责)。
