import { useEffect, useState } from "react";

/** 防抖:值停止变化 delay 毫秒后才更新返回值，用于搜索输入避免每次按键都触发查询 */
function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export { useDebouncedValue };
