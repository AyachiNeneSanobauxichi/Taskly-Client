import { apiClient } from "@/lib/api-client";
import type { Todo } from "../types";
import type { CreateTodoInput, UpdateTodoInput } from "../schemas";

export const todoApi = {
  list: async (): Promise<Todo[]> => {
    const { data } = await apiClient.get<Todo[]>("/todos");
    return data;
  },

  create: async (input: CreateTodoInput): Promise<Todo> => {
    const { data } = await apiClient.post<Todo>("/todos", input);
    return data;
  },

  update: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
    const { data } = await apiClient.patch<Todo>(`/todos/${id}`, input);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },
};
