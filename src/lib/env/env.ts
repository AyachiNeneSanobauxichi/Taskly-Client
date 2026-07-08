import { z } from "zod";

/**
 * 环境变量校验。启动即校验，缺失或格式错误直接抛错，
 * 避免运行到一半才发现某个变量没配。
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default("/api"),
  VITE_APP_NAME: z.string().min(1).default("Taskly"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("❌ 环境变量校验失败：", z.treeifyError(parsed.error));
  throw new Error("环境变量配置无效，请检查 .env 文件");
}

export const env = parsed.data;
