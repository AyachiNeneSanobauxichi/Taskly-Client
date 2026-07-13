import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";
import type { UseZodFormOptions } from "@/hooks/use-zod-form/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * zod + react-hook-form 的标准组合。
 * 传入 zod schema(校验文案需 i18n 时用 schema 工厂 + useMemo,见 features/<模块>/schemas.ts),
 * 自动挂载 zodResolver,表单类型从 schema 推导,其余选项与 useForm 一致。
 */
function useZodForm<TFieldValues extends FieldValues>(
  schema: ZodType<TFieldValues, TFieldValues>,
  options?: UseZodFormOptions<TFieldValues>,
): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema),
  });
}

export { useZodForm };
