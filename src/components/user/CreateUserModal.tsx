import { UserRegistry } from "@/services/user";
import { useRequest } from "ahooks";
import { App, Form, Input } from "antd";
import ModalComponent from "../base/Modal";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}
const CreateUserModal = ({ open, onClose, refresh }: CreateUserModalProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { run, loading } = useRequest(UserRegistry, {
    manual: true,
    debounceWait: 300,
    onSuccess: () => {
      message.success("创建成功");
      handleCancel();
      refresh();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const handleOk = async () => {
    const values = await form.validateFields();
    run({
      ...values,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <ModalComponent
      open={open}
      handleCancel={handleCancel}
      handleOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" size="large">
        <Form.Item
          name="name"
          label="名称"
          rules={[
            { required: true, min: 2, max: 20, message: "请输入名称" },
            { pattern: /^[A-Za-z0-9]+$/, message: "名称必须只包含字母和数字" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "请输入有效的邮箱地址" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              min: 8,
              max: 20,
              message: "密码长度在 8-20 个字符",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="nickName"
          label="昵称"
          rules={[{ min: 2, max: 20, message: "昵称长度在 2-20 个字符" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="手机号"
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="avatar" label="头像">
          <Input />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default CreateUserModal;
