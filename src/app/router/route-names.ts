const routeNames = {
  home: "/",
  login: "/login",
  register: "/register",
  todoDetail: "/todos/:id",
} as const;

/** 拼接 todo 详情页路径(带 id) */
const toTodoDetailPath = (id: string) => `/todos/${id}`;

export { routeNames, toTodoDetailPath };
