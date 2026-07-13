/** 后端创建/更新/删除/详情响应的 todo 数据结构 */
interface TodoDto {
  _id: string;
  name: string;
  content: string;
  type: "normal" | "important" | "urgent";
  status: "pending" | "completed" | "doing" | "deleted";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** 后端列表查询响应体 */
interface TodoListDto {
  docs: TodoDto[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export type { TodoDto, TodoListDto };
