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

## -api 文档编写规范

`service/<module>/<module>-api.md` 是该模块请求层的规格。编写时遵守:

- **只写接口,不接页面**:文档里只描述请求函数所需信息(方法、路径、请求体、响应体),**不涉及任何页面/组件接入、状态管理、UI 逻辑**——那些属于 `-page`。一句话:`-api` 只做请求函数。
- **复用优先,不造轮子**:多个接口 / 模块出现相同的接口或返回对象类型时,**复用已有的,不要重复定义**;允许后接入的模块复用先前其他模块已声明的类型(如各处都用到的 `user` 对象)。落到代码即 `types.ts` 的公共类型复用(见 `project-structure` / `api-request`)。

### 编写格式(以 `auth-api.md` 为准)

- 文档标题 `## <module> api`,按版本分段(`# v1`、`# v2` …)。
- **每个接口一个列表项** `- xxx api`,紧跟一段 ts 代码块描述形状:
  - 首行注释请求方法:`// post` / `// get` …
  - `const path = "/auth/register";` —— 相对路径(**不含**全局 `api` 前缀,前缀由请求层统一加,见 `agent/infra/request.md`)。
  - 需要鉴权的接口加注释 `// need authorization`。
  - `const request = { ... }` —— 请求体形状;字段值写类型占位(`"string"`)或示例值;无请求体则省略。
  - `const response = { code, message, data }` —— 响应体形状,用示例值展示;无数据时 `data: null`。
  - **可复用的对象结构用注释标注类型名**(如 `// user`),提示这是跨接口 / 跨模块共享的类型,生成代码时复用同一个模型。

参考范例:`agent/service/auth/auth-api.md`。

## 与其他规范的关系

`agent/` 定义需求(做什么),`.claude/skills` 定义写法(怎么写)。冲突时:写法以 skills 为准,边界以本规则为准。本规则约束的是工作流与代码组织,无法用 ESLint 静态强制,靠生成时自查与 code review 兜底。
