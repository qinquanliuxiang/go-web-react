import { Input, Space } from "antd";
import ModalComponent from "../base/Modal";

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
  const handleOk = () => {
    enableUserRun(enableUser.id, enableUser.password);
  };
  const handleCancel = () => {
    setEnableUser({
      open: false,
      name: "",
      id: "",
      password: "",
    });
  };
  return (
    <ModalComponent
      open={enableUser.open}
      handleCancel={handleCancel}
      handleOk={handleOk}
      confirmLoading={loading}
      title={
        <Space>
          <span>启用用户 {enableUser.name}</span>
          <span style={{ color: "red" }}>（需要重新设置密码）</span>
        </Space>
      }
    >
      <Input.Password
        className="m-4"
        size="large"
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
    </ModalComponent>
  );
};
export default EnableUserComponent;
