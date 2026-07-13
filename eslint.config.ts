import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { localPlugin } from "./eslint-rules/index.ts";

// ── 导入禁令(dev-workflow / react-19 / ui-style / api-request 技能)──
const RESTRICTED_IMPORT_PATHS = [
  {
    name: "react",
    importNames: ["forwardRef", "useContext"],
    message:
      "React 19:ref 是普通 prop,Context 用 use() 读取,不要用 forwardRef/useContext(见 react-19 技能)",
  },
  {
    name: "lodash",
    message: "工具函数统一用 es-toolkit,禁止 lodash(见 dev-workflow 技能)",
  },
  {
    name: "lodash-es",
    message: "工具函数统一用 es-toolkit,禁止 lodash(见 dev-workflow 技能)",
  },
  {
    name: "radix-ui",
    message:
      "业务代码禁止直接导入 radix-ui,通过 src/components/ui 的 shadcn 封装使用(见 ui-style 技能)",
  },
];

const RESTRICTED_IMPORT_PATTERNS = [
  {
    group: ["lodash/*", "lodash.*"],
    message: "工具函数统一用 es-toolkit,禁止 lodash(见 dev-workflow 技能)",
  },
  {
    group: ["@radix-ui/*"],
    message:
      "业务代码禁止直接导入 radix-ui,通过 src/components/ui 的 shadcn 封装使用(见 ui-style 技能)",
  },
];

// mock 假数据只允许被同目录的 api 文件引用(见 api-request 技能);api/ 目录的 override 会放开
const MOCK_IMPORT_PATTERN = {
  group: ["**/mock", "**/mock/**"],
  message:
    "mock 假数据只允许被同目录的 api 文件引用,hooks/页面不感知 mock(见 api-request 技能)",
};

// 禁止相对路径导入:一律 @/ 绝对路径,从不产生循环依赖前提下最上层的出口导入(见 project-structure 技能)
const RELATIVE_IMPORT_BAN = {
  regex: String.raw`^\.\.?(/|$)`,
  message:
    "禁止相对路径导入,一律用 @/ 绝对路径,并从不产生循环依赖前提下最上层的出口(index.ts)导入(见 project-structure 技能)",
};

// index.ts 出口文件例外:允许 ./ 聚合同目录文件(barrel 固有职责),但仍禁止 ../ 向上相对
const PARENT_RELATIVE_IMPORT_BAN = {
  regex: String.raw`^\.\.(/|$)`,
  message:
    "index.ts 出口只能用 ./ 聚合同目录文件,禁止 ../ 相对路径,跨目录一律 @/ 绝对路径(见 project-structure 技能)",
};

// Tailwind 调色板色名:业务代码必须用主题 token(text-primary 等),不许 text-red-500 这类裸色
const PALETTE_COLOR_CLASS = String.raw`(?:^|[\s:])(?:text|bg|border|ring|fill|stroke|from|via|to|outline|decoration|divide|shadow|accent|caret)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d`;

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
      "no-restricted-imports": [
        "error",
        {
          paths: RESTRICTED_IMPORT_PATHS,
          patterns: [
            ...RESTRICTED_IMPORT_PATTERNS,
            MOCK_IMPORT_PATTERN,
            RELATIVE_IMPORT_BAN,
          ],
        },
      ],

      // ── 导出/文案/React 19/主题规范 ─────────────────────────
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
          message: "UI 属性文案禁止硬编码中文,必须走 i18n 的 t()(见 i18n 技能)",
        },
        // ── React 19:禁老写法(见 react-19 技能)──
        {
          selector:
            "ImportDeclaration[source.value='react'] > ImportDefaultSpecifier",
          message:
            "无需 import React —— 新 JSX transform 下按需具名导入即可(见 react-19 技能)",
        },
        {
          selector:
            "TSTypeReference[typeName.left.name='React'][typeName.right.name=/^(FC|FunctionComponent)$/]",
          message:
            "禁用 React.FC,直接写函数 + 显式 props 类型(见 react-19 技能)",
        },
        {
          selector: "JSXMemberExpression[property.name='Provider']",
          message:
            "React 19:直接渲染 <Context value={…}>,不要 <Context.Provider>(见 react-19 技能)",
        },
        {
          selector: "CallExpression[callee.name='useRef'][arguments.length=0]",
          message:
            "React 19:useRef 必须传初始值,写 useRef<T>(null)(见 react-19 技能)",
        },
        {
          selector:
            "AssignmentExpression[left.property.name=/^(defaultProps|propTypes)$/]",
          message:
            "React 19 已移除函数组件的 defaultProps/propTypes,默认值用参数解构默认值(见 react-19 技能)",
        },
        // ── 颜色/字体只走主题 token(见 ui-style 技能)──
        {
          selector: `JSXAttribute[name.name='className'] Literal[value=/${PALETTE_COLOR_CLASS}/]`,
          message:
            "禁止 Tailwind 裸色类(如 text-red-500),用主题 token(text-primary / text-destructive 等,见 ui-style 技能)",
        },
        {
          selector: String.raw`JSXAttribute[name.name='className'] Literal[value=/\[#|(?:text|font)-\[/]`,
          message:
            "禁止任意值颜色/字号/字体(bg-[#…]、text-[13px]、font-[…]),先在 src/index.css 的 @theme 加 token 再引用(见 ui-style 技能)",
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
    // shadcn 生成的 ui 基础组件视为第三方代码,豁免项目自定风格;
    // 但导出名必须加 Shadcn 前缀,与自定义业务组件区分(见 ui-style 技能)
    files: ["src/components/ui/**/*.{ts,tsx}"],
    plugins: { local: localPlugin },
    rules: {
      "react-refresh/only-export-components": "off",
      "no-restricted-syntax": "off",
      "no-restricted-imports": "off",
      "max-lines": "off",
      "perfectionist/sort-imports": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "local/shadcn-export-prefix": "error",
    },
  },
  {
    // api/ 目录允许引用同目录 mock(接口未就绪期间;接通后删除 mock/,见 api-request 技能)
    files: ["src/features/*/api/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: RESTRICTED_IMPORT_PATHS,
          patterns: [...RESTRICTED_IMPORT_PATTERNS, RELATIVE_IMPORT_BAN],
        },
      ],
    },
  },
  {
    // index.ts 出口文件:放宽到只禁 ../(允许 ./ 聚合同目录),其余禁令保持
    files: ["**/index.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: RESTRICTED_IMPORT_PATHS,
          patterns: [
            ...RESTRICTED_IMPORT_PATTERNS,
            MOCK_IMPORT_PATTERN,
            PARENT_RELATIVE_IMPORT_BAN,
          ],
        },
      ],
    },
  },
  {
    // 构建/工具配置文件(vite.config.ts、eslint.config.ts 等):default export、
    // 相对路径引根级文件(@/ 只指向 src/,够不到 eslint-rules 等)、长度均放行
    files: ["**/*.config.ts"],
    rules: {
      "no-restricted-syntax": "off",
      "no-restricted-imports": "off",
      "max-lines": "off",
    },
  },
]);
