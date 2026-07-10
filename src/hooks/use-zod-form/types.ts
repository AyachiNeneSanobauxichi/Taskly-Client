import type { FieldValues, UseFormProps } from "react-hook-form";

/** useZodForm 的配置:沿用 useForm 除 resolver 外的全部选项(resolver 由 hook 内部接管) */
type UseZodFormOptions<TFieldValues extends FieldValues> = Omit<
  UseFormProps<TFieldValues>,
  "resolver"
>;

export type { UseZodFormOptions };
