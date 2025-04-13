import { RoleAdd } from "@/services/role";
import type { PolicyOptions } from "@/types";
import { useRequest } from "ahooks";
import { Form, Input, Select } from "antd";
import useApp from "antd/es/app/useApp";
import ModalComponent from "../base/Modal";

interface CreateRoleComponentProps {
  open: boolean;
  onCancel: () => void;
  policyOptions: PolicyOptions[] | undefined;
  refresh: () => void;
}
const CreateRoleComponent = ({
  open,
  onCancel,
  policyOptions,
  refresh,
}: CreateRoleComponentProps) => {
  const [form] = Form.useForm();
  const { message } = useApp();

  const reset = () => {
    form.resetFields();
    onCancel();
  };
  const handleCancle = () => {
    reset();
  };

  const { run: roleAdd, loading: roleLoad } = useRequest(RoleAdd, {
    manual: true,
    onSuccess: () => {
      message.success("创建成功");
      refresh();
      reset();
    },
    onError: (err) => {
      message.error(`${err.message}`);
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      roleAdd(values);
    });
  };
  return (
    <ModalComponent
      open={open}
      handleCancel={handleCancle}
      handleOk={handleOk}
      confirmLoading={roleLoad}
      title="创建角色"
    >
      <Form
        form={form}
        layout="vertical"
        size={"large"}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: "请输入角色名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="describe"
          label="角色描述"
          rules={[{ required: true, message: "请输入角色描述" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="policyIds" label="角色权限">
          <Select
            mode="multiple"
            placeholder="请选择角色权限"
            options={policyOptions}
          />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default CreateRoleComponent;
