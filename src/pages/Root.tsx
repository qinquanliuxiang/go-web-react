import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Root() {
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }

    let path = "";
    if (isLoggedIn) {
      switch (location.pathname) {
        case "/login":
          path = "/workspace/ram/user";
          break;
        case "/":
          path = "/workspace/ram/user";
          break;
        default:
          path = location.pathname;
          break;
      }
    }
    const search = location.search;
    navigate(path + search, { replace: true });
  }, []);

  return <Outlet />;
}

export default Root;
