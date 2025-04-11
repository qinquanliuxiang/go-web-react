import { Input, Modal, Space } from "antd";

interface EnableUserComponentProps {
  enableUser: {
    open: boolean;
    name: string;
    id: string;
    password: string;
  };
  setEnableUser: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      name: string;
      id: string;
      password: string;
    }>
  >;
  enableUserRun: (id: string, password: string) => void;
  loading: boolean;
}
const EnableUserComponent = ({
  enableUser,
  setEnableUser,
  enableUserRun,
  loading,
}: EnableUserComponentProps) => {
  return (
    <Modal
      open={enableUser.open}
      destroyOnClose={true}
      maskClosable={false}
      title={
        <Space>
          <span>启用用户 {enableUser.name}</span>
          <span style={{ color: "red" }}>（需要重新设置密码）</span>
        </Space>
      }
      onCancel={() => {
        setEnableUser({
          open: false,
          name: "",
          id: "",
          password: "",
        });
      }}
      onOk={() => {
        enableUserRun(enableUser.id, enableUser.password);
      }}
      okText="启用"
      cancelText="取消"
      confirmLoading={loading}
    >
      <Input.Password
        max={20}
        min={8}
        value={enableUser.password}
        onChange={(e) =>
          setEnableUser((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
        placeholder="请输入密码"
      />
    </Modal>
  );
};
export default EnableUserComponent;
