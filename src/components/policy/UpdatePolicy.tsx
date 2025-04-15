import { UpdatePolicy } from "@/services/policy";
import type { PolicyItem } from "@/types/policy";
import { useRequest } from "ahooks";
import { App, Form, Input } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import ModalComponent from "../base/Modal";

interface UpdatePolicyComponentProps {
  open: boolean;
  onCancel: () => void;
  refresh: () => void;
  data: PolicyItem;
}

const UpdatePolicyComponent = ({
  open,
  onCancel,
  refresh,
  data,
}: UpdatePolicyComponentProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  useEffect(() => {
    if (!open) {
      return;
    }
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
      method: data.method,
      describe: data.describe,
    });
  }, [data, open]);

  const { run: upRun, loading: upLoad } = useRequest(UpdatePolicy, {
    manual: true,
    debounceMaxWait: 500,
    onSuccess: () => {
      message.success("修改成功");
      refresh();
      handleCancle();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const handleCancle = () => {
    onCancel();
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      upRun(values.id, { describe: values.describe });
    });
  };
  return (
    <ModalComponent
      closable={false}
      title="创建角色"
      open={open}
      handleOk={handleOk}
      handleCancel={handleCancle}
      confirmLoading={upLoad}
    >
      <Form
        form={form}
        size="large"
        labelAlign="left"
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          rules={[{ required: true, message: "请输入描述" }]}
          name={"id"}
          label="ID"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入描述" }]}
          name={"createdAt"}
          label="创建时间"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入描述" }]}
          name={"updatedAt"}
          label="更新时间"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入描述" }]}
          name={"name"}
          label="名称"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入描述" }]}
          name={"method"}
          label="方法"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "请输入描述" }]}
          name={"describe"}
          label="描述"
        >
          <Input />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default UpdatePolicyComponent;
