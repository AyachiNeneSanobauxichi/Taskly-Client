import { Navigate, Outlet, useLocation } from "react-router-dom";
import { routeNames } from "@/app/router/route-names";
import { useIsAuthenticated } from "@/features/auth/store";

/** 需要登录才能访问；未登录跳转到 /login 并记住来源 */
function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={routeNames.login} replace state={{ from: location }} />
    );
  }
  return <Outlet />;
}

/** 仅未登录可访问（登录/注册页）；已登录直接进主页 */
function PublicOnlyRoute() {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={routeNames.home} replace />;
  }
  return <Outlet />;
}

export { ProtectedRoute, PublicOnlyRoute };
