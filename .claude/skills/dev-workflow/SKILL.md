---
name: dev-workflow
description: 项目开发工作流:包管理器与依赖策略、启动/构建/校验命令、验证边界(不发真实请求/不开无头浏览器)、测试策略、TypeScript 版本注意事项。安装依赖、跑命令、验证改动、决定是否引入新包时使用。
---

# 开发工作流

## 包管理器:只用 pnpm

本项目使用 **pnpm**(仓库里是 `pnpm-lock.yaml`)。**禁止使用 npm / yarn** —— npm 会因 `.pnpm` 目录结构直接报错 `Cannot read properties of null (reading 'matches')`,还可能生成多余的 `package-lock.json`。

```bash
pnpm add <pkg>        # 安装运行时依赖
pnpm add -D <pkg>     # 安装开发依赖
```

## 依赖策略

- **需要新包时直接 `pnpm add` 安装,无需征求用户同意。**
- **不要造轮子**,优先级:① 已装的包能实现 → 用已装的包;② 不能 → 找社区成熟包装上(通用 hooks 找 ahooks / usehooks-ts,组件找 shadcn 生态);③ 都没有合适的 → 才手写。

## 常用命令

| 命令          | 作用                                             |
| ------------- | ------------------------------------------------ |
| `pnpm dev`    | 启动 Vite dev server(默认 http://localhost:5173) |
| `pnpm build`  | `tsc -b && vite build`,类型检查 + 生产构建       |
| `pnpm lint`   | ESLint 全量检查                                  |
| `pnpm format` | Prettier 全量格式化                              |

## 验证边界(重要)

写完代码**必须校验**,但只做静态校验:

1. `npx tsc --noEmit -p tsconfig.app.json` —— 类型零错误
2. `pnpm lint` —— 不引入新的 error/warning

**禁止**以下"运行时验证"——这一步由用户手动完成:

- ❌ 真正发出 API 请求(调后端接口验证)
- ❌ 启动无头浏览器 / Playwright / chromium 自动化验证 UI

## 提交门禁(husky pre-commit)

`git commit` 时自动执行,**任何一步失败提交都会被拒绝**,不允许有问题的代码进入仓库:

1. `lint-staged`:对暂存的 `*.{ts,tsx}` 跑 `eslint --fix --max-warnings 0`(严格规则、零警告)+ Prettier,可自动修复的会修复后重新暂存;
2. `tsc -b`:全量类型检查。

被拦截时:按报错信息修复后重新提交,**禁止用 `--no-verify` 绕过门禁**。ESLint 强制的规范条款(行内导出、混写 type 导入、JSX 硬编码中文、超 200 行、default export 等)详见 `coding-style` / `i18n` 技能。

## 测试策略

**当前阶段不写单元测试**,不创建 `*.test.ts(x)` / `*.spec.ts(x)` 文件。vitest 配置保留,等项目稳定后再补。

## TypeScript 版本注意

- 项目锁定 **TypeScript ~6.0**,`tsc`/`pnpm build` 用的是它。
- VS Code 必须使用工作区版本(`.vscode/settings.json` 已配置 `typescript.tsdk`)。**如果 IDE 报类型错误但 `tsc` 通过,优先相信 `tsc`** —— 多半是编辑器用了自带的旧版 TS(典型症状:i18next 的 t() 报错提示"Did you mean auth:xxx"这类带命名空间前缀的 key)。
- `tsconfig.app.json` 开了 `verbatimModuleSyntax`,类型导入必须写 `import type`(书写顺序见 `coding-style` 技能)。
- ESLint 已配置 `_` 前缀豁免 no-unused-vars:有意不用的变量/参数以 `_` 开头。
