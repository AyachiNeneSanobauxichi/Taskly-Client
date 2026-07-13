import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnButton } from "@/components/ui/button";
import {
  ShadcnSelect,
  ShadcnSelectContent,
  ShadcnSelectItem,
  ShadcnSelectTrigger,
  ShadcnSelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/features/todo/constants";

interface TodoPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPageSizeChange: (size: number) => void;
}

/** 列表分页控件:每页条数下拉 + 上/下一页 + 页码信息 */
function TodoPagination({
  page,
  totalPages,
  pageSize,
  hasPrevPage,
  hasNextPage,
  onPrev,
  onNext,
  onPageSizeChange,
}: TodoPaginationProps) {
  const { t } = useTranslation("todo");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-caption">
          {t("pagination.pageSize")}
        </span>
        <ShadcnSelect
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <ShadcnSelectTrigger size="sm" className="w-20">
            <ShadcnSelectValue />
          </ShadcnSelectTrigger>
          <ShadcnSelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <ShadcnSelectItem key={size} value={String(size)}>
                {size}
              </ShadcnSelectItem>
            ))}
          </ShadcnSelectContent>
        </ShadcnSelect>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-caption">
          {t("pagination.pageInfo", { page, total: totalPages })}
        </span>
        <ShadcnButton
          variant="outline"
          size="icon"
          aria-label={t("pagination.prev")}
          onClick={onPrev}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="size-4" />
        </ShadcnButton>
        <ShadcnButton
          variant="outline"
          size="icon"
          aria-label={t("pagination.next")}
          onClick={onNext}
          disabled={!hasNextPage}
        >
          <ChevronRight className="size-4" />
        </ShadcnButton>
      </div>
    </div>
  );
}

export { TodoPagination };
