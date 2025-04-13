import { Navigate, Outlet, useLocation } from "react-router-dom";

function Root() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  if (!token) {
    const fullPath = location.pathname + location.search;
    return (
      <Navigate to={`/login?from=${encodeURIComponent(fullPath)}`} replace />
    );
  }

  if (location.pathname === "/") {
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
}

export default Root;
