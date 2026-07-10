import type { ESLint, Rule } from "eslint";

/**
 * 本地自定义 ESLint 规则插件(在 eslint.config.ts 中以 `local` 命名空间注册)。
 * 承载无法用 no-restricted-* 表达、需要读 AST 结构的项目规范。
 */

/** shadcn 组件(src/components/ui)导出名必须加 Shadcn 前缀,与自定义业务组件区分(见 ui-style 技能) */
const shadcnExportPrefix: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "src/components/ui 下导出的组件(大写开头)必须以 Shadcn 为前缀",
    },
    schema: [],
    messages: {
      missingPrefix:
        'shadcn 组件导出名必须加 Shadcn 前缀(如 "{{suggested}}"),与自定义业务组件区分(见 ui-style 技能)',
    },
  },
  create(context) {
    return {
      ExportNamedDeclaration(node) {
        for (const specifier of node.specifiers) {
          // 只处理标识符导出(项目不使用字符串形式的导出名)
          if (specifier.exported.type !== "Identifier") continue;
          const exported = specifier.exported.name;
          // 只约束组件(大写开头);buttonVariants 这类工具导出不加前缀
          if (/^[A-Z]/.test(exported) && !exported.startsWith("Shadcn")) {
            context.report({
              node: specifier,
              messageId: "missingPrefix",
              data: { suggested: `Shadcn${exported}` },
            });
          }
        }
      },
    };
  },
};

const localPlugin: ESLint.Plugin = {
  meta: { name: "local" },
  rules: {
    "shadcn-export-prefix": shadcnExportPrefix,
  },
};

export { localPlugin };
