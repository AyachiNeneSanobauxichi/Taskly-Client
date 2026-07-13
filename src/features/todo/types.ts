/** todo 优先级 */
type TodoType = "normal" | "important" | "urgent";

/** todo 状态 */
type TodoStatus = "pending" | "completed" | "doing" | "deleted";

/** todo 完整模型(前端消费) */
interface Todo {
  _id: string;
  name: string;
  content: string;
  type: TodoType;
  status: TodoStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** todo 列表查询参数(分页 + 过滤 + 排序) */
interface TodoListParams {
  pageNumber?: number;
  pageSize?: number;
  todoName?: string;
  todoType?: TodoType;
  todoStatus?: TodoStatus;
  sortBy?: "createdAt" | "updatedAt" | "type" | "status";
  sortOrder?: "asc" | "desc";
}

/** todo 列表分页响应 */
interface TodoListResponse {
  docs: Todo[];
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

export type { Todo, TodoType, TodoStatus, TodoListParams, TodoListResponse };
