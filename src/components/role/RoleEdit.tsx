import type { RoleItem } from "@/types/role";
import ModalComponent from "../base/Modal";
import { App, Form, Input } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import { UpdateRole } from "@/services/role";

interface RoleEditComponentProps {
  open: boolean;
  handleCancel: () => void;
  refresh: () => void;
  data: RoleItem | undefined;
}

const RoleEditComponent = ({
  open,
  refresh,
  handleCancel,
  data,
}: RoleEditComponentProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  useEffect(() => {
    if (!data || !open) return;
    const createdAt = dayjs
      .unix(Number(data.createdAt))
      .format("YYYY-MM-DD HH:mm:ss");

    const updatedAt = dayjs
      .unix(Number(data.updatedAt))
      .format("YYYY-MM-DD HH:mm:ss");
    form.setFieldsValue({
      id: data.id,
      createdAt: createdAt,
      updatedAt: updatedAt,
      name: data.name,
      describe: data.description,
    });
  }, [data, open]);

  const OnCancel = () => {
    form.resetFields();
    handleCancel();
  };

  const { run, loading } = useRequest(UpdateRole, {
    manual: true,
    onSuccess: () => {
      message.success("修改成功");
      refresh();
      OnCancel();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  const handleOk = () => {
    form.validateFields().then((values) => {
      run(values.id, { describe: values.describe });
    });
  };
  return (
    <>
      <ModalComponent
        open={open}
        handleCancel={OnCancel}
        handleOk={handleOk}
        confirmLoading={loading}
        title="编辑角色"
      >
        <Form
          form={form}
          layout="horizontal"
          size="large"
          labelAlign="left"
          labelCol={{ span: 6 }}
        >
          <Form.Item
            label="角色ID"
            rules={[{ required: true, message: "请输入角色描述" }]}
            name="id"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="创建时间"
            rules={[{ required: true, message: "请输入角色描述" }]}
            name="createdAt"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="更新时间"
            rules={[{ required: true, message: "请输入角色描述" }]}
            name="updatedAt"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="角色名称"
            rules={[{ required: true, message: "请输入角色描述" }]}
            name="name"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "请输入角色描述" }]}
            label="角色描述"
            name="describe"
          >
            <Input />
          </Form.Item>
        </Form>
      </ModalComponent>
    </>
  );
};
export default RoleEditComponent;
