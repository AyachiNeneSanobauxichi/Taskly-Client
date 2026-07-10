# Taskly

一个任务管理(Todo)单页应用,包含注册/登录、任务的增删改查。前端独立仓库,通过 REST API 与后端交互。

## 技术栈

| 领域       | 选型                                                     |
| ---------- | -------------------------------------------------------- |
| 框架       | React 19 + TypeScript ~6.0 + Vite 8                      |
| 路由       | react-router v7(`createBrowserRouter` 声明式路由表)      |
| 服务端状态 | TanStack Query v5                                        |
| 客户端状态 | zustand(仅 auth 会话,持久化到 localStorage)              |
| 请求层     | axios(拦截器统一挂 token、401 单飞刷新、错误归一化)      |
| 表单       | react-hook-form v7 + zod v4(`useZodForm` 统一入口)       |
| UI         | Tailwind CSS v4 + shadcn 风格组件(radix-ui)+ lucide 图标 |
| 国际化     | i18next(zh 默认 / en,按 feature 划分命名空间)            |
| 工具函数   | es-toolkit(禁止手写通用工具、禁止 lodash)                |
| 质量工具   | ESLint(含自定义规则)+ Prettier + husky pre-commit 门禁   |

## 快速上手

**前置要求**:Node.js 20+,pnpm(仓库锁文件是 `pnpm-lock.yaml`,**禁止用 npm / yarn**)。

```bash
# 1. 安装依赖(会自动装好 husky 钩子)
pnpm install

# 2. 环境变量:复制示例即可,默认走 vite 代理无需改动
cp .env.example .env

# 3. 启动开发服务器 → http://localhost:5173
pnpm dev
```

开发环境下 `/api` 会被 vite 代理到后端(默认 `http://localhost:8080`,可用环境变量 `VITE_PROXY_TARGET` 覆盖)。后端接口未就绪的模块,`api/mock/` 文件夹里有假数据兜底,页面可直接跑通;全局搜索 `TODO: mock` 可以看到当前哪些接口还在用假数据。

### 常用命令

| 命令             | 作用                                       |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | 启动 Vite dev server                       |
| `pnpm build`     | `tsc -b && vite build`,类型检查 + 生产构建 |
| `pnpm typecheck` | 全量类型检查                               |
| `pnpm lint`      | ESLint 全量检查                            |
| `pnpm format`    | Prettier 全量格式化                        |
| `pnpm preview`   | 本地预览生产构建产物                       |

## 目录结构

```
src/
├─ app/          应用装配层:全局 Provider(provider/)+ 路由(router/)
├─ components/   跨 feature 复用组件:ui/(shadcn 基础组件)、layout/、task-*(全局业务组件)
├─ features/     业务功能模块,按模块自治
│  ├─ auth/      注册/登录/会话(api、hooks、store、pages、schemas)
│  └─ todo/      任务管理(api、hooks、pages、schemas、types)
├─ hooks/        跨 feature 的全局 hooks(useZodForm、useLanguage、usePageTitle)
├─ lib/          业务无关基础设施:env/、i18n/、request/、utils/
└─ test/         测试全局配置
```

数据流分层:`api/`(纯请求 + DTO→前端模型转换)→ `hooks/`(TanStack Query,含副作用与多接口合并)→ `pages/`(只消费数据渲染)。每个文件夹都以 `index.ts` 作为唯一出口。

## 开发规范(必读)

完整规范以 **`.claude/skills/`** 为唯一事实源(Claude Code 自动加载),并同步了一份到 **`.cursor/rules/`**(Cursor 自动加载)。用其他编辑器的直接阅读这两处的 markdown,内容相同。共 11 个主题:

| 规则                | 内容概要                                                          |
| ------------------- | ----------------------------------------------------------------- |
| `project-structure` | 目录结构、代码归属判断、公共代码抽取(禁止复制粘贴)、命名约定      |
| `coding-style`      | 导出放文件底部、`import type` 置顶、类型/常量拆分、注释与 TODO    |
| `react-19`          | 禁 forwardRef / Context.Provider / useContext / React.FC 等老写法 |
| `dev-workflow`      | 只用 pnpm、依赖策略(es-toolkit,不造轮子)、验证边界、提交门禁      |
| `api-request`       | api 文件写法、DTO 转换、mock 文件夹约定、循环依赖禁令             |
| `data-fetching`     | queryKeys 工厂、乐观更新模板、多接口合并(页面只消费数据)          |
| `forms`             | schema 工厂函数(支持 i18n)、`useZodForm` 统一入口                 |
| `routing-auth`      | 路由三件套、守卫、auth store、登录/登出流程                       |
| `ui-style`          | Shadcn 前缀导出、禁直接导入 radix-ui、颜色/字体只走主题 token     |
| `i18n`              | 禁硬编码文案、新增翻译四步流程、类型安全的 t()                    |
| `global-hooks`      | 全局 hooks 清单与新增模板                                         |

几条最容易踩的铁律,先记住:

- **UI 里不许硬编码**:用户可见文案走 `t()`,颜色/字体走主题 token(`text-primary` 而非 `text-red-500`)。
- **页面只消费数据**:DTO 转换在 api 层,多接口合并/派生在 hooks 层,tsx 里不做数据加工。
- **不要造轮子**:通用工具用 es-toolkit,通用 hooks 找成熟库,基础组件取 shadcn 官方实现,禁止直接导入 radix-ui。
- **导入路径**:`@/` 别名指向 `src/`;feature 内部用子路径别名(如 `@/features/todo/hooks`),不走模块根 barrel,避免循环依赖。

## 提交门禁

`git commit` 时 husky 自动执行 lint-staged(ESLint 零警告 + Prettier)和全量 `tsc -b`,任一失败提交被拒。**禁止 `--no-verify` 绕过**;按报错修复后重新提交即可。

## IDE 配置

推荐 VS Code / Cursor,打开工作区后 TypeScript **必须选"使用工作区版本"**(`.vscode/settings.json` 已配置 `typescript.tsdk`)——否则编辑器用自带旧版 TS,i18n 的 key 类型检查会误报(表现为 `t()` 提示 "Did you mean 'ns:xxx'" 而 `tsc` 实际通过)。
