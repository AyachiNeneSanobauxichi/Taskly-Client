import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少 6 位"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "昵称至少 2 个字符"),
    email: z.email("邮箱格式不正确"),
    password: z.string().min(6, "密码至少 6 位"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;
