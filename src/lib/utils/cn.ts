import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 Tailwind class，处理冲突（如 px-2 + px-4 -> px-4）。shadcn 组件依赖此函数 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cn };
