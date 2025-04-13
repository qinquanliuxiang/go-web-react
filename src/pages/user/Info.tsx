import LoadingComponent from "@/components/base/Loading";
import { UserInfo, userUpdate, userUpdatePassword } from "@/services/user";
import { UserUpdateRequest, UserUpPwdRequest } from "@/types/user";
import { useRequest } from "ahooks";
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Avatar,
  Descriptions,
  theme,
} from "antd";
import { useEffect, useRef, useState } from "react";

const InfoPage = () => {
  const { token } = theme.useToken();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const [showPwdModal, setShowPwdModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  // 获取用户信息
  const {
    data: userInfo,
    loading,
    refresh,
  } = useRequest(UserInfo, {
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const { run: upRun, loading: upLoad } = useRequest(userUpdate, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      message.success("修改成功");
      refresh();
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handlePwdOk = () => {
    pwdForm.resetFields();
    setShowPwdModal(false);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const { run: upPwdRun, loading: upPwdLoad } = useRequest(userUpdatePassword, {
    manual: true,
    onSuccess: () => {
      message.success("修改成功");
      // 设置新定时器并保存引用
      timerRef.current = setTimeout(() => {
        handlePwdOk();
      }, 1000);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish = (values: UserUpdateRequest) => {
    upRun(values);
  };

  const onPwdFinish = (values: UserUpPwdRequest) => {
    upPwdRun(values);
  };

  // 清理 setTimeout
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (loading) {
    return <LoadingComponent loading />;
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: token.colorBgContainerDisabled }}
    >
      <Card
        title="个人信息"
        className="shadow-lg rounded-lg flex-1"
        styles={{
          header: {
            background: `${token.colorPrimaryBg}`,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            fontSize: token.fontSizeLG,
          },
          body: {
            padding: "24px 32px",
            height: "calc(100% - 57px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <div className="w-full max-w-3xl">
          {/* 展示区域 */}
          <Descriptions
            column={1}
            bordered
            className="bg-gray-50 rounded-lg p-4"
            styles={{
              label: {
                color: token.colorTextSecondary,
                width: 100, // 固定标签宽度
                whiteSpace: "nowrap",
                padding: "12px 16px",
                fontSize: token.fontSize,
              },
              content: {
                color: token.colorText,
                fontWeight: token.fontWeightStrong,
                padding: "12px 16px",
                maxWidth: 300, // 限制内容最大宽度
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            <Descriptions.Item label="头像">
              <Avatar
                src={userInfo?.avatar}
                className="!w-20 !h-20 !text-2xl shadow-md border-2 border-white"
              />
            </Descriptions.Item>
            <Descriptions.Item label="用户ID">{userInfo?.id}</Descriptions.Item>
            <Descriptions.Item label="用户名">
              {userInfo?.name}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {userInfo?.email}
            </Descriptions.Item>
            <Descriptions.Item label="角色">
              {userInfo?.roleName?.join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <span
                style={{
                  color:
                    userInfo?.status === 1
                      ? token.colorSuccess
                      : token.colorError,
                }}
              >
                {userInfo?.status === 1 ? "正常" : "禁用"}
              </span>
            </Descriptions.Item>
          </Descriptions>

          {/* 编辑表单 */}
          <Form
            form={form}
            layout="vertical"
            className="flex-1 min-w-[300px]"
            onFinish={onFinish}
          >
            <div className=" rounded-lg p-4 mb-6">
              <Form.Item
                label="头像链接"
                name="avatar"
                rules={[
                  { type: "url", message: "请输入有效的图片链接" },
                  { required: true, message: "请输入头像链接" },
                ]}
              >
                <Input
                  placeholder="输入新头像URL"
                  allowClear
                  className="!rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="昵称"
                name="nickName"
                rules={[{ required: true, message: "请输入昵称" }]}
              >
                <Input
                  placeholder="请输入昵称"
                  allowClear
                  className="hover:!border-primary !rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="手机号"
                name="mobile"
                rules={[
                  { required: true, message: "请输入手机号" },
                  { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
                ]}
              >
                <Input
                  placeholder="请输入手机号"
                  allowClear
                  className="hover:!border-primary !rounded-lg"
                />
              </Form.Item>

              <div className="flex gap-4 mt-auto pt-6">
                <Button
                  type="primary"
                  // htmlType="submit"
                  onClick={() => {
                    modal.confirm({
                      title: "确认修改个人信息？",
                      okText: "确认",
                      okType: "danger",
                      cancelText: "取消",
                      onOk: () => {
                        form.submit();
                      },
                    });
                  }}
                  className="!rounded-lg"
                  loading={upLoad}
                  style={{
                    background: token.colorPrimary,
                    minWidth: 120,
                    height: 40,
                  }}
                >
                  保存修改
                </Button>
                <Button
                  onClick={() => setShowPwdModal(true)}
                  className="!rounded-lg"
                  style={{
                    borderColor: token.colorPrimary,
                    color: token.colorPrimary,
                    minWidth: 120,
                    height: 40,
                  }}
                >
                  修改密码
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Card>

      {/* 密码修改弹窗（保持不变） */}
      <Modal
        confirmLoading={upPwdLoad}
        title="修改密码"
        open={showPwdModal}
        onCancel={() => setShowPwdModal(false)}
        footer={null}
        destroyOnClose
        styles={{
          header: {
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: "16px 24px",
          },
          body: {
            padding: "24px",
          },
        }}
      >
        <Form form={pwdForm} layout="vertical" onFinish={onPwdFinish}>
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[
              { required: true, message: "请输入原密码" },
              { min: 8, message: "密码至少8位" },
            ]}
          >
            <Input.Password
              placeholder="请输入原密码"
              className="hover:!border-primary"
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 8, message: "密码至少8位" },
            ]}
          >
            <Input.Password
              placeholder="请输入新密码"
              className="hover:!border-primary"
            />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="请确认新密码"
              className="hover:!border-primary"
            />
          </Form.Item>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => setShowPwdModal(false)}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: token.colorPrimary }}
            >
              确认修改
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InfoPage;
