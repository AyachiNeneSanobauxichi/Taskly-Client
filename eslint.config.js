import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: { perfectionist },
    rules: {
      // 下划线前缀 = 有意不使用(如解构剥离字段 const { confirmPassword: _confirmPassword, ...payload }）
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // ── 导入规范(coding-style 技能)─────────────────────────
      // 仅类型使用的导入必须写成 import type(自动修复为独立语句）
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      // import type 统一置顶,其余导入保持书写顺序
      "perfectionist/sort-imports": [
        "error",
        {
          type: "type-import-first",
          fallbackSort: { type: "unsorted" },
          groups: [],
        },
      ],

      // ── 导出与文案规范(coding-style / i18n 技能)────────────
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message:
            "禁止 default export,使用命名导出并统一在文件底部 export {}(见 coding-style 技能)",
        },
        {
          selector: "ExportNamedDeclaration[declaration]",
          message:
            "禁止行内导出:先声明,再在文件底部统一 export { … } / export type { … }(见 coding-style 技能)",
        },
        {
          selector: "ImportSpecifier[importKind='type']",
          message:
            "类型导入用独立的 import type 语句,不要与值导入混写(见 coding-style 技能)",
        },
        {
          selector: String.raw`JSXText[value=/[一-鿿]/]`,
          message: "UI 文案禁止硬编码中文,必须走 i18n 的 t()(见 i18n 技能)",
        },
        {
          selector: String.raw`JSXAttribute > Literal[value=/[一-鿿]/]`,
          message:
            "UI 属性文案禁止硬编码中文,必须走 i18n 的 t()(见 i18n 技能)",
        },
      ],

      // ── 其他强规范 ─────────────────────────────────────────
      "no-console": ["error", { allow: ["warn", "error"] }],
      // 单文件过长说明该拆 hooks / 子组件了(见 coding-style 技能)
      "max-lines": [
        "error",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    // shadcn 生成的 ui 基础组件视为第三方代码,豁免项目自定风格
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
      "no-restricted-syntax": "off",
      "max-lines": "off",
      "perfectionist/sort-imports": "off",
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
  {
    // 构建配置文件按官方约定使用 default export(如 vite.config.ts)
    files: ["**/*.config.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
]);
