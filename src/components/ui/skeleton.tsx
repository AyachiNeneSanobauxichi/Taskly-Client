import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** 骨架屏占位块:用尺寸类拼出与真实内容一致的结构,避免加载完成后布局跳动 */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton as ShadcnSkeleton };
