import "i18next";
import type common from "./locales/zh/common.json";
import type auth from "./locales/zh/auth.json";
import type todo from "./locales/zh/todo.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      auth: typeof auth;
      todo: typeof todo;
    };
  }
}
