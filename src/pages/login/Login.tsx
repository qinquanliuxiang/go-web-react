import { UserLogin } from "@/services/user";
import { useRequest } from "ahooks";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const { run: loginRun, loading: loginLoading } = useRequest(UserLogin, {
    manual: true,
    onError: (error) => {
      messageApi.error(error.message);
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res?.token);
      navigate("/");
    },
  });
  // 登录处理逻辑
  const onFinish = (values: { email: string; password: string }) => {
    loginRun(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {contextHolder}
      <Card
        className="w-full max-w-lg p-8"
        style={{
          borderRadius: "12px",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} className="text-center text-gray-800 mb-8 font-bold">
          登录
        </Title>

        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="email"
            rules={[{ required: true, message: "请输入用户名!" }]}
            required={false}
          >
            <Input
              placeholder="请输入用户名"
              className="focus:ring-indigo-500 focus:border-indigo-500"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            label="密码"
            required={false}
            name="password"
            rules={[
              { required: true, message: "请输入密码!" },
              { message: "密码长度不能小于8位", min: 8 },
            ]}
          >
            <Input.Password
              placeholder="请输入密码"
              className="focus:ring-indigo-500 focus:border-indigo-500"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginLoading}
              style={{
                backgroundColor: "#4c6ef5",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              className="hover:bg-indigo-700"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
