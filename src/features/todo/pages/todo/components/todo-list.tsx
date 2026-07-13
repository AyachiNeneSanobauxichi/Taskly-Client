import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShadcnSkeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/features/todo/constants";
import { useTodos } from "@/features/todo/hooks";
import { SKELETON_ROW_COUNT } from "@/features/todo/pages/todo/components/constants";
import { TodoItem } from "@/features/todo/pages/todo/components/todo-item";
import { TodoPagination } from "@/features/todo/pages/todo/components/todo-pagination";

/** 加载骨架屏:行结构与 TodoItem 卡片一致(名称行 + 描述行),避免加载完成后跳动 */
function TodoListSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: SKELETON_ROW_COUNT }, (_item, index) => (
        <li key={index} className="space-y-2 rounded-xl border p-4">
          <ShadcnSkeleton className="h-5 w-1/2" />
          <ShadcnSkeleton className="h-4 w-full" />
        </li>
      ))}
    </ul>
  );
}

/** 任务列表:管理分页状态,处理加载/错误/空态,正常时渲染卡片列表 + 分页控件 */
function TodoList({ search }: { search?: string }) {
  const { t } = useTranslation("todo");
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // 搜索词变化时回到第一页(渲染期调整状态,避免用 effect,见 React 官方建议)
  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setPageNumber(DEFAULT_PAGE_NUMBER);
  }

  const { data, isPending, isError, error } = useTodos({
    todoName: search || undefined,
    pageNumber,
    pageSize,
  });

  if (isPending) {
    return <TodoListSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-destructive text-caption py-10 text-center">
        {t("list.loadError")}
        {error.message || t("list.unknownError")}
      </p>
    );
  }

  if (data.docs.length === 0) {
    return (
      <p className="text-muted-foreground text-caption py-10 text-center">
        {t("list.empty")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {data.docs.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </ul>
      <TodoPagination
        page={data.page}
        totalPages={data.totalPages}
        pageSize={pageSize}
        hasPrevPage={data.hasPrevPage}
        hasNextPage={data.hasNextPage}
        onPrev={() =>
          setPageNumber((prev) => Math.max(DEFAULT_PAGE_NUMBER, prev - 1))
        }
        onNext={() => setPageNumber((prev) => prev + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageNumber(DEFAULT_PAGE_NUMBER);
        }}
      />
    </div>
  );
}

export { TodoList };
