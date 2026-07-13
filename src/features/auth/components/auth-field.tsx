import type { ComponentProps } from "react";
import { ShadcnInput } from "@/components/ui/input";
import { ShadcnLabel } from "@/components/ui/label";

interface AuthFieldProps extends ComponentProps<typeof ShadcnInput> {
  id: string;
  label: string;
  error?: string;
}

/** 登录/注册表单里的单个字段:标签 + 输入框 + 校验错误信息,供 auth 各页面复用,避免复制粘贴 */
function AuthField({ id, label, error, ...inputProps }: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <ShadcnLabel htmlFor={id}>{label}</ShadcnLabel>
      <ShadcnInput id={id} {...inputProps} />
      {error && <p className="text-destructive text-caption">{error}</p>}
    </div>
  );
}

export { AuthField };
