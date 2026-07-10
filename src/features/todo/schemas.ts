import type { useTranslation } from "react-i18next";
import { z } from "zod";

type TodoT = ReturnType<typeof useTranslation<"todo">>["t"];

/** 校验文案依赖当前语言，需在组件内传入 t 后再创建 schema */
const createTodoSchema = (t: TodoT) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, t("validation.titleRequired"))
      .max(200, t("validation.titleMax")),
  });
type CreateTodoInput = z.infer<ReturnType<typeof createTodoSchema>>;

const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  completed: z.boolean().optional(),
});
type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

export { createTodoSchema, updateTodoSchema };
export type { CreateTodoInput, UpdateTodoInput };
