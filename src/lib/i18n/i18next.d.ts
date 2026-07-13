import "i18next";
import type common from "@/lib/i18n/locales/zh/common.json";
import type auth from "@/lib/i18n/locales/zh/auth.json";
import type todo from "@/lib/i18n/locales/zh/todo.json";

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
