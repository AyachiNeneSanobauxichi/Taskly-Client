import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks";

/** 双语切换按钮:展示当前语言,点击切到另一种 */
function LanguageSwitcher() {
  const { current, next, toggle } = useLanguage();

  return (
    <Button variant="ghost" size="sm" onClick={toggle} title={next.label}>
      <Languages className="size-4" />
      {current.label}
    </Button>
  );
}

export { LanguageSwitcher };
