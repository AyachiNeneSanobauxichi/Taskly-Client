import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "@/app/router/guards";
import { routeNames } from "@/app/router/route-names";
import { AppLayout } from "@/components/layout/app-layout";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { TodoPage } from "@/features/todo/pages/todo-page";
import { NotFoundPage } from "@/components";

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: routeNames.login, element: <LoginPage /> },
      { path: routeNames.register, element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, path: routeNames.todo, element: <TodoPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export { router };
