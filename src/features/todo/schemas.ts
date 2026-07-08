import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "请输入任务内容").max(200, "最多 200 个字符"),
});
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  completed: z.boolean().optional(),
});
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
