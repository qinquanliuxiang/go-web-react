import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import { MenuProps } from "antd";
import RolePage from "./pages/role/Role";
import LayoutPage from "./layout/layout";
import loginPage from "./pages/login/login";
import UserPage from "./pages/user/User";
type MenuItem = Required<MenuProps>["items"][number];

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "/workspace",
        Component: LayoutPage,
        children: [
          {
            path: "ram",
            children: [
              {
                path: "user",
                Component: UserPage,
              },
              {
                path: "role",
                Component: RolePage,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    Component: loginPage,
  },
]);

export default router;

const GetMemuItem = (): MenuItem[] => {
  return [
    {
      key: "ram",
      icon: null,
      label: "用户",
      children: [
        {
          key: "user",
          icon: null,
          label: "用户列表",
        },
        {
          key: "role",
          icon: null,
          label: "角色列表",
        },
      ],
    },
  ];
};

export { GetMemuItem };
