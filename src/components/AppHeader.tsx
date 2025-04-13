// components/AppHeader.tsx
import { useContext } from "react";
import { GlobalContext } from "@/components/ThemeProvider";
import {
  App,
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  MenuProps,
  Space,
  Spin,
} from "antd";
import {
  MailOutlined,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ThemeToggle from "./ThemeToggle";
import KubernetesIcon from "@/assets/kubernetes.svg?react";
import { UserLogout } from "@/services/user";
import { useRequest } from "ahooks";
import { UserInfoResponse } from "@/types/user";
import { openNewWindow } from "@/utils/openWindowns";
import { useUserStore } from "@/stores/userStore";

interface AppHeaderProps {
  background: string;
  userData: UserInfoResponse | undefined;
  userLoad: boolean;
}
export default function AppHeader({
  background,
  userData,
  userLoad,
}: AppHeaderProps) {
  const { message } = App.useApp();
  const { theme } = useContext(GlobalContext);
  const { clearUser } = useUserStore();
  const { run: logoutRun } = useRequest(UserLogout, {
    manual: true,
    onSuccess: () => {
      clearUser();
      window.location.href = "/login";
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Card loading={userLoad}>
          <div className="flex flex-wrap gap-y-3">
            <div className="w-full">
              <p
                className="font-medium m-0"
                style={{ color: theme === "dark" ? "#fff" : "#1890ff" }}
              >
                {userData?.nickName || userData?.name || "未知用户"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {userData?.roleName &&
                userData?.roleName.map((role) => {
                  return (
                    <span
                      key={role}
                      className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    >
                      {role}
                    </span>
                  );
                })}
            </div>
          </div>

          <Divider className="my-3" style={{ margin: "8px 0" }} />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserOutlined className="opacity-60" />
              <span className="opacity-90">{userData?.name || ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <MailOutlined className="opacity-60" />
              <span className="opacity-90">{userData?.email || ""}</span>
            </div>
          </div>
        </Card>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "setting",
      label: (
        <div className="w-full text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none">
          <Button
            type="link"
            style={{ color: "#1890ff" }}
            onClick={() => openNewWindow("/user/info")}
            icon={<UserOutlined />}
          >
            个人信息
          </Button>
        </div>
      ),
    },
    {
      key: "logout",
      label: (
        <div className="w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none">
          <Button
            type="link"
            style={{ color: "#ff4d4f" }}
            onClick={() => logoutRun()}
            icon={<PoweroffOutlined />}
          >
            退出登录
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      className="flex items-center justify-between px-6 h-16"
      style={{
        backgroundColor: theme === "dark" ? background : "#fff",
        borderBottom:
          theme === "dark" ? "1px solid #303030" : "1px solid #f0f0f0",
      }}
    >
      <div className="flex items-center gap-2 text-lg font-semibold">
        <KubernetesIcon width={200} height="80%" fill="#69b1ff" />
      </div>

      <Space size="middle" className="flex items-center gap-4">
        <ThemeToggle />
        {userLoad ? (
          <Spin size="small" />
        ) : (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Avatar
              style={{ cursor: "pointer" }}
              src={userData?.avatar}
              icon={!userData?.avatar && <UserOutlined />}
            />
          </Dropdown>
        )}
      </Space>
    </div>
  );
}
