// components/AppHeader.tsx
import { useContext } from "react";
import { GlobalContext } from "@/components/ThemeProvider";
import {
  Avatar,
  Card,
  Divider,
  Dropdown,
  MenuProps,
  message,
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
import { UserInfo, UserLogout } from "@/services/user";
import { useRequest } from "ahooks";
export default function AppHeader({ background }: { background: string }) {
  const [messageApi, contextHolder] = message.useMessage();
  const { theme } = useContext(GlobalContext);
  const { data, loading } = useRequest(UserInfo, {
    onError: (error) => {
      messageApi.error(error.message);
    },
  });
  const { run: logoutRun } = useRequest(UserLogout, {
    manual: true,
    onSuccess: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onError: (error) => {
      messageApi.error(error.message);
    },
  });
  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Card loading={loading}>
          <div className="flex flex-wrap gap-y-3">
            <div className="w-full">
              <p
                className="font-medium m-0"
                style={{ color: theme === "dark" ? "#fff" : "#1890ff" }}
              >
                {data?.nickName || data?.name || "未知用户"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {data?.roleName &&
                data?.roleName.map((role) => {
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
              <span className="opacity-90">{data?.name || "未提供用户名"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MailOutlined className="opacity-60" />
              <span className="opacity-90">{data?.email || "未提供邮箱"}</span>
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
      key: "logout",
      label: (
        <div
          className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors py-2 px-4 rounded"
          style={{ color: "#ff4d4f" }}
          onClick={() => logoutRun()}
        >
          <PoweroffOutlined className="mr-2" />
          退出登录
        </div>
      ),
      style: { margin: 0 },
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
      {contextHolder}
      <div className="flex items-center gap-2 text-lg font-semibold">
        <KubernetesIcon width={200} height="80%" fill="#69b1ff" />
      </div>

      <Space size="middle" className="flex items-center gap-4">
        <ThemeToggle />
        {loading ? (
          <Spin size="small" />
        ) : (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Avatar
              style={{ cursor: "pointer" }}
              src={data?.avatar}
              icon={!data?.avatar && <UserOutlined />}
            />
          </Dropdown>
        )}
      </Space>
    </div>
  );
}
