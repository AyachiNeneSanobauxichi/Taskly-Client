import { User } from "lucide-react";
import {
  ShadcnAvatar,
  ShadcnAvatarFallback,
  ShadcnAvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// TODO: mock —— 占位头像，后端用户模型补上 avatar 字段后替换为真实地址
const MOCK_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b6ef0"/><stop offset="1" stop-color="#6d4bd6"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="15" fill="#ffffff" fill-opacity="0.95"/><path d="M22 82c0-15 11.6-25 26-25s26 10 26 25z" fill="#ffffff" fill-opacity="0.95"/></svg>`;
const mockAvatarUrl = `data:image/svg+xml,${encodeURIComponent(MOCK_AVATAR_SVG)}`;

/** 登录/注册页顶部的占位头像，两页共用避免复制粘贴 */
function AuthAvatar({ className }: { className?: string }) {
  return (
    <ShadcnAvatar className={cn("size-16", className)}>
      <ShadcnAvatarImage src={mockAvatarUrl} alt="" />
      <ShadcnAvatarFallback>
        <User className="size-7" />
      </ShadcnAvatarFallback>
    </ShadcnAvatar>
  );
}

export { AuthAvatar };
