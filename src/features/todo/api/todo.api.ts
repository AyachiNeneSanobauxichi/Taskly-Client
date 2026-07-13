import type {
  Todo,
  TodoListParams,
  TodoListResponse,
} from "@/features/todo/types";
import type { CreateTodoInput, UpdateTodoInput } from "@/features/todo/schemas";
import type { TodoDto, TodoListDto } from "@/features/todo/api/todo.dto";
import { apiClient } from "@/lib/request";

/** 后端 DTO → 前端模型转换 */
function toTodo(dto: TodoDto): Todo {
  return {
    _id: dto._id,
    name: dto.name,
    content: dto.content,
    type: dto.type,
    status: dto.status,
    userId: dto.userId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/** 列表响应转换 */
function toTodoListResponse(dto: TodoListDto): TodoListResponse {
  return {
    docs: dto.docs.map(toTodo),
    totalDocs: dto.totalDocs,
    limit: dto.limit,
    totalPages: dto.totalPages,
    page: dto.page,
    pagingCounter: dto.pagingCounter,
    hasPrevPage: dto.hasPrevPage,
    hasNextPage: dto.hasNextPage,
    prevPage: dto.prevPage,
    nextPage: dto.nextPage,
  };
}

const todoApi = {
  /** 创建 todo */
  create: async (input: CreateTodoInput): Promise<Todo> => {
    const { data } = await apiClient.post<TodoDto>("/todo/create", input);
    return toTodo(data);
  },

  /** 更新 todo */
  update: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
    const { data } = await apiClient.patch<TodoDto>("/todo/update", {
      id,
      ...input,
    });
    return toTodo(data);
  },

  /** 删除 todo */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/todo/delete/${id}`);
  },

  /** 获取单个 todo 详情 */
  detail: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.get<TodoDto>(`/todo/todo-detail/${id}`);
    return toTodo(data);
  },

  /** 获取 todo 列表(POST,分页、过滤和排序参数走请求体) */
  list: async (params?: TodoListParams): Promise<TodoListResponse> => {
    const { data } = await apiClient.post<TodoListDto>(
      "/todo/todo-list",
      params ?? {},
    );
    return toTodoListResponse(data);
  },
};

export { todoApi };
