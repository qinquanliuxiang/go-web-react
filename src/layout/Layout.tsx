import { GetMemuItem } from "@/route";
import { Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import useApp from "antd/es/app/useApp";
import { useUserStore } from "@/stores/userStore";
interface openKeys {
  openKey: string[];
  selectKeys: string[];
}

interface menuType {
  key: string;
  keyPath: string[];
}

const perfix = "/workspace/";
const LayoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = useApp();
  const { fetchUser, error, loading: userLoad } = useUserStore();
  const userData = useUserStore((state) => state.userData);
  const searchParams = new URLSearchParams(location.search);
  const tenant = searchParams.get("tenant");
  const newSearch = tenant ? `?tenant=${tenant}` : "";
  const [openKey, setOpenkey] = useState<openKeys>({
    openKey: [],
    selectKeys: [],
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 错误处理
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error) {
      message.error(error.message);
      timeoutId = setTimeout(() => {
        useUserStore.setState({ error: null });
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  // 自动获取用户信息
  useEffect(() => {
    if (!userData && !userLoad) {
      fetchUser();
    }
  }, [userData, userLoad]);

  // 子菜单点击事件
  const menuClick = (item: menuType) => {
    setOpenkey({
      openKey: [item.keyPath[1]],
      selectKeys: [item.keyPath[0]],
    });
    const paht = perfix + item.keyPath.reverse().join("/");
    navigate(paht + newSearch);
  };
  // 主菜单点击事件
  const menuChange = (openKeys: string[]) => {
    setOpenkey((pre) => ({
      ...pre,
      openKey: openKeys,
    }));
  };

  const menuItems = useMemo(() => {
    return GetMemuItem(userData?.roleName || []);
  }, [userData?.roleName]);

  useEffect(() => {
    const path = location.pathname.split("/");
    setOpenkey({
      openKey: [path[2]],
      selectKeys: [path[3]],
    });
  }, [location.pathname]);

  return (
    <Layout className="h-screen">
      <AppHeader
        userData={userData}
        userLoad={userLoad}
        background={colorBgContainer}
      />
      <Layout
        style={{
          padding: "15px 0",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Sider
          style={{
            background: colorBgContainer,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Menu
            style={{ background: colorBgContainer, height: "100%" }}
            items={menuItems}
            mode="inline"
            onClick={menuClick}
            onOpenChange={menuChange}
            openKeys={openKey.openKey}
            selectedKeys={openKey.selectKeys}
          />
        </Sider>
        <Content
          style={{
            minHeight: 0,
            borderLeft: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
