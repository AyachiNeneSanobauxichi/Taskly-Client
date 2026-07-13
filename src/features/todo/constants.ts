import type { TodoStatus, TodoType } from "@/features/todo/types";

/** 列表分页默认参数(v2:查询必传) */
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

/** 每页条数可选项 */
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

/** 有序的优先级 / 状态取值，供 Select 遍历 */
const TODO_TYPES = [
  "normal",
  "important",
  "urgent",
] as const satisfies readonly TodoType[];

const TODO_STATUSES = [
  "pending",
  "doing",
  "completed",
  "deleted",
] as const satisfies readonly TodoStatus[];

/** 优先级 → i18n 文案 key + Badge 主题变体(只用主题 token 变体，见 ui-style 规范) */
const TODO_TYPE_META = {
  normal: { labelKey: "form.typeNormal", variant: "secondary" },
  important: { labelKey: "form.typeImportant", variant: "default" },
  urgent: { labelKey: "form.typeUrgent", variant: "destructive" },
} as const;

/** 状态 → i18n 文案 key + Badge 主题变体 */
const TODO_STATUS_META = {
  pending: { labelKey: "form.statusPending", variant: "outline" },
  doing: { labelKey: "form.statusDoing", variant: "default" },
  completed: { labelKey: "form.statusCompleted", variant: "secondary" },
  deleted: { labelKey: "form.statusDeleted", variant: "destructive" },
} as const;

export {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  TODO_TYPES,
  TODO_STATUSES,
  TODO_TYPE_META,
  TODO_STATUS_META,
};
