import type { useTranslation } from "react-i18next";
import { z } from "zod";

type TodoT = ReturnType<typeof useTranslation<"todo">>["t"];

/** 校验文案依赖当前语言，需在组件内传入 t 后再创建 schema */
const createTodoSchema = (t: TodoT) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("validation.nameRequired"))
      .max(200, t("validation.nameMax")),
    content: z
      .string()
      .trim()
      .min(1, t("validation.contentRequired"))
      .max(2000, t("validation.contentMax")),
    type: z
      .enum(["normal", "important", "urgent"])
      .refine((val) => ["normal", "important", "urgent"].includes(val), {
        message: t("validation.typeInvalid"),
      }),
    status: z
      .enum(["pending", "completed", "doing", "deleted"])
      .refine(
        (val) => ["pending", "completed", "doing", "deleted"].includes(val),
        { message: t("validation.statusInvalid") },
      ),
  });
type CreateTodoInput = z.infer<ReturnType<typeof createTodoSchema>>;

const updateTodoSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  content: z.string().trim().min(1).max(2000).optional(),
  type: z.enum(["normal", "important", "urgent"]).optional(),
  status: z.enum(["pending", "completed", "doing", "deleted"]).optional(),
});
type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

export { createTodoSchema, updateTodoSchema };
export type { CreateTodoInput, UpdateTodoInput };
