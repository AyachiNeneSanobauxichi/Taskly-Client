---
name: api-request
description: axios 请求层规范:apiClient 用法、api 文件写法、ApiError 错误归一化、token 刷新、lib/request 循环依赖禁令。新增接口请求、处理接口错误、改动 src/lib/request 或 feature 的 api/ 目录时使用。
---

# 请求层规范(src/lib/request)

## 架构

- `api-client.ts` —— 主 axios 实例,所有业务请求都走它;自动挂 accessToken、401 时单飞刷新后重放。
- `refresh-token.ts` —— 刷新专用 client,**刻意不挂拦截器**,避免刷新请求自身 401 时递归。
- `query-client.ts` —— 全局 TanStack QueryClient(4xx 不重试)。
- `types.ts` —— `ApiError` 归一化结构:`{ status, message, fieldErrors? }`,业务层统一处理这个结构。

## 新增接口:feature 的 api/ 目录

纯请求、无副作用(不 setState、不弹 toast),对象聚合导出:

```ts
// features/xxx/api/xxx.api.ts
import { apiClient } from "@/lib/request";
import type { Xxx } from "../types";

export const xxxApi = {
  list: async (): Promise<Xxx[]> => {
    const { data } = await apiClient.get<Xxx[]>("/xxx");
    return data;
  },
};
```

副作用(缓存失效、toast、跳转)全部放到 hooks 层,见 `data-fetching` 技能。

## ⚠️ 循环依赖禁令(重要)

`lib/request` 需要反向读取 auth 状态,依赖链是:
`api-client → auth store → (无 api 依赖)`,而 `auth 模块 barrel → api → lib/request`。

因此 **`src/lib/request/` 下的文件只能从叶子子路径导入 auth**:

```ts
// ✅ 正确
import { useAuthStore } from "@/features/auth/store";
import type { AuthTokens } from "@/features/auth/types";

// ❌ 禁止 —— 会形成循环依赖,导致 "Cannot access 'xxx' before initialization"
import { useAuthStore } from "@/features/auth";
```

如果 linter/IDE 自动把它改成模块 barrel 导入,**必须改回来**。同理,`auth.store.ts` 不允许 import 任何 api 层代码。

## 错误处理约定

- 拦截器已把所有错误归一化为 `ApiError`,业务层直接 `error.message` 展示(通常 `toast.error(error.message)`)。
- 字段级校验错误在 `error.fieldErrors`(如 `{ email: ["已被注册"] }`)。
