---
name: agent-docs
description: 文档驱动开发规则:agent/ 目录是需求规格的事实源(infra 基建文档 / service 业务文档),生成代码时的边界——只动 service 对应模块,需要动 infra(路由/请求/主题/全局组件)必须先手动询问确认;业务代码按 -api(请求层)与 -page(逻辑+UI)拆分。基于 agent 文档生成/修改业务代码、读到 agent/ 下文档、需求涉及基建改动时使用。
---

# 文档驱动开发规则(agent/ 目录)

`agent/` 是「做什么」的需求规格事实源(`.claude/skills` 是「怎么写」的事实源)。基于这些文档生成代码时,严格遵守下面的边界。

## 目录约定

```
agent/
├─ infra/                    项目基建文档:路由、API 请求层、主题色、全局组件 等
│  ├─ request.md
│  ├─ theme.md
│  └─ i18n.md
└─ service/                  业务模块文档,按模块划分,每模块拆两份
   └─ <module>/
      ├─ <module>-api.md      该模块的接口 / 请求层规格
      └─ <module>-page.md     该模块的逻辑 + UI 规格
```

- `infra/` —— 基建文档,描述**全局共享能力**(路由、请求封装、主题 token、全局组件)。
- `service/<module>/` —— 业务文档,每模块自治,内部拆成 `-api` 与 `-page`。

## 铁律 1:只动 service

基于 agent 文档生成代码时,**默认只允许新增 / 修改 service 对应模块的代码**(即 `src/features/<module>/`)。不得擅自改动基建:路由注册、请求封装、主题 token、全局组件等一律不动。

## 铁律 2:需要动 infra 必须先问

一旦发现完成需求**必须**改基建(新增全局请求逻辑、改路由结构、加主题色、加/改全局组件等),**停下来手动询问用户**——说明为什么要动、动哪里、影响面,得到确认后再改。严禁在未询问的情况下顺手改 infra。

判断是否属于 infra 改动,对照 `agent/infra/` 各文档及项目 `routing-auth` / `api-request` / `ui-style` 规范;拿不准时按"要问"处理。

## 铁律 3:业务代码拆 -api 与 -page

每个 `service/<module>` 生成的代码遵循同样的两层拆分,落到 `src/features/<module>/`:

- **`-api`(请求层)** —— 接口定义、DTO ↔ 前端模型转换、mock;遵循 `api-request` / `data-fetching` 规范。
- **`-page`(页面层)** —— 业务**逻辑与 UI**;遵循 `coding-style` / `ui-style` / `react-19` / `forms` 等规范。

页面只消费数据,数据加工留在 api / hooks 层(见 `data-fetching`)。

## 与其他规范的关系

`agent/` 定义需求(做什么),`.claude/skills` 定义写法(怎么写)。冲突时:写法以 skills 为准,边界以本规则为准。本规则约束的是工作流与代码组织,无法用 ESLint 静态强制,靠生成时自查与 code review 兜底。
