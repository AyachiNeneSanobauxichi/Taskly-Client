import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { supportedLanguages } from "@/lib/i18n";

/** 仅支持两种语言，按钮展示当前语言，点击切到另一种 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current =
    supportedLanguages.find((l) => l.code === i18n.language) ??
    supportedLanguages[0];
  const next =
    supportedLanguages.find((l) => l.code !== current.code) ??
    supportedLanguages[0];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void i18n.changeLanguage(next.code)}
      title={next.label}
    >
      <Languages className="size-4" />
      {current.label}
    </Button>
  );
}
