# todo api

## v1

-- create-todo

```ts
// post
const path = "/todo/create";

// need authorization

const request = {
  name: "string",
  content: "string",
  type: "enum", // "normal", "important", "urgent"
  status: "enum", // "pending", "completed", "doing", "deleted",
};

const response = {
  code: 0,
  message: "Todo created successfully",
  data: {
    name: "找工作",
    content: "学习 flutter 并找到一个工作",
    type: "urgent", // enum
    status: "doing", // enum
    userId: "6a3bf0b32569b677d11a9ce9",
    _id: "6a5488391cc4322fffaaa71a",
    createdAt: "2026-07-13T06:39:53.316Z",
    updatedAt: "2026-07-13T06:39:53.316Z",
  },
};
```

-- update-todo

```ts
// patch
const path = "/todo/update";

// need authorization

const request = {
  id: "string",
  name: "string",
  content: "string",
  type: "enum", // "normal", "important", "urgent",
  status: "enum", // "pending", "completed", "doing", "deleted",
};

const response = {
  code: 0,
  message: "Todo updated successfully",
  data: {
    _id: "6a5488391cc4322fffaaa71a",
    name: "编写一个 react 项目",
    type: "urgent", // enum
    status: "doing", // enum
    userId: "6a3bf0b32569b677d11a9ce9",
    _id: "6a5488391cc4322fffaaa71a",
    createdAt: "2026-07-13T06:39:53.316Z",
    updatedAt: "2026-07-13T06:39:53.316Z",
  },
};
```

-- delete-todo

```ts
// delete
const path = "/todo/delete/{id}";

// need authorization

const request = {
  id: "string",
  name: "string",
  content: "string",
  type: "enum", // "normal", "important", "urgent",
  status: "enum", // "pending", "completed", "doing", "deleted",
};

const response = {
  code: 0,
  message: "Todo deleted successfully",
  data: {
    _id: "6a548b5c1cc4322fffaaa71c",
    name: "学习 Vue 3",
    type: "urgent", // enum
    status: "doing", // enum
    userId: "6a544dcf4f6ff819ff98a5ce",
    createdAt: "2026-07-13T06:53:16.647Z",
    updatedAt: "2026-07-13T06:53:16.647Z",
  },
};
```

-- get-todo-detail

```ts
// get
const path = "/todo/todo-detail/{id}";

// need authorization

const request = {
  id: "string",
  name: "string",
  content: "string",
  type: "enum", // "normal", "important", "urgent",
  status: "enum", // "pending", "completed", "doing", "deleted",
};

const response = {
  code: 0,
  message: "get todo successfully",
  data: {
    _id: "6a548b551cc4322fffaaa71b",
    name: "学习 Vue 2",
    content: "学习 Vue2 并找到一个工作",
    type: "urgent", // enum
    status: "doing", // enum
    userId: "6a544dcf4f6ff819ff98a5ce",
    createdAt: "2026-07-13T06:53:09.373Z",
    updatedAt: "2026-07-13T06:53:09.373Z",
  },
};
```

-- get-todo-list

```ts
// post
const path = "/todo/todo-list";

// need authorization

const request = {
  pageNumber: 0,
  pageSize: 0,
  todoName: "string",
  todoType: "enum", // "normal", "important", "urgent",
  todoStatus: "enum", // "pending", "completed", "doing", "deleted"
  sortBy: "enum", // "createdAt", "updatedAt", "type", "status
  sortOrder: "enum", // "asc", "desc"
};

const response = {
  code: 0,
  message: "get todo list successfully",
  data: {
    docs: [
      {
        _id: "6a548b5c1cc4322fffaaa71c",
        name: "学习 Vue 3",
        type: "urgent",
        status: "deleted",
        userId: "6a544dcf4f6ff819ff98a5ce",
        createdAt: "2026-07-13T06:53:16.647Z",
        updatedAt: "2026-07-13T06:55:27.515Z",
      },
      {
        _id: "6a548b551cc4322fffaaa71b",
        name: "学习 Vue 2",
        type: "urgent",
        status: "doing",
        userId: "6a544dcf4f6ff819ff98a5ce",
        createdAt: "2026-07-13T06:53:09.373Z",
        updatedAt: "2026-07-13T06:53:09.373Z",
      },
    ],
    totalDocs: 2,
    limit: 10,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  },
};
```
