import type { TodoStatus, TodoType } from "@/features/todo/types";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import { ShadcnInput } from "@/components/ui/input";
import {
  ShadcnSelect,
  ShadcnSelectContent,
  ShadcnSelectItem,
  ShadcnSelectTrigger,
  ShadcnSelectValue,
} from "@/components/ui/select";
import {
  TODO_STATUSES,
  TODO_STATUS_META,
  TODO_TYPES,
  TODO_TYPE_META,
} from "@/features/todo/constants";

interface TodoFiltersProps {
  search: string;
  type: TodoType | "all";
  status: TodoStatus | "all";
  canClear: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TodoType | "all") => void;
  onStatusChange: (value: TodoStatus | "all") => void;
  onClear: () => void;
}

/** 任务筛选栏:名称搜索 + 优先级/状态过滤 + 一键清空 */
function TodoFilters({
  search,
  type,
  status,
  canClear,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onClear,
}: TodoFiltersProps) {
  const { t } = useTranslation("todo");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-48 flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <ShadcnInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("search.placeholder")}
          className="pl-9"
        />
      </div>

      <ShadcnSelect
        value={type}
        onValueChange={(value) => onTypeChange(value as TodoType | "all")}
      >
        <ShadcnSelectTrigger className="w-36">
          <ShadcnSelectValue />
        </ShadcnSelectTrigger>
        <ShadcnSelectContent>
          <ShadcnSelectItem value="all">
            {t("filters.typeAll")}
          </ShadcnSelectItem>
          {TODO_TYPES.map((item) => (
            <ShadcnSelectItem key={item} value={item}>
              {t(TODO_TYPE_META[item].labelKey)}
            </ShadcnSelectItem>
          ))}
        </ShadcnSelectContent>
      </ShadcnSelect>

      <ShadcnSelect
        value={status}
        onValueChange={(value) => onStatusChange(value as TodoStatus | "all")}
      >
        <ShadcnSelectTrigger className="w-36">
          <ShadcnSelectValue />
        </ShadcnSelectTrigger>
        <ShadcnSelectContent>
          <ShadcnSelectItem value="all">
            {t("filters.statusAll")}
          </ShadcnSelectItem>
          {TODO_STATUSES.map((item) => (
            <ShadcnSelectItem key={item} value={item}>
              {t(TODO_STATUS_META[item].labelKey)}
            </ShadcnSelectItem>
          ))}
        </ShadcnSelectContent>
      </ShadcnSelect>

      {canClear && (
        <ShadcnButton variant="ghost" size="sm" onClick={onClear}>
          <X className="size-4" />
          {t("actions.clear")}
        </ShadcnButton>
      )}
    </div>
  );
}

export { TodoFilters };
