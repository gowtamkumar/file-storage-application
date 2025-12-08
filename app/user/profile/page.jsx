"use client";

import NavBar from "@/components/NavBar";
import {
  ArrowLeftOutlined,
  KeyOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  Layout,
  Tag,
  Typography,
  message,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Content } = Layout;

export default function UserProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        form.setFieldsValue({
          name: data.data.name,
          email: data.data.email,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile");
      message.error("Failed to load profile data");
    }
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success("Profile updated successfully");
        setUser(data.data);
        form.setFieldValue("password", "");
        form.setFieldValue("confirmPassword", "");
      } else {
        message.error(data.message || "Update failed");
      }
    } catch (error) {
      message.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Layout style={{ minHeight: "100vh", marginTop: "64px", background: "#f0f2f5" }}>
        <Content style={{ padding: "24px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/user")}
            style={{ marginBottom: 16, paddingLeft: 0 }}
          >
            Back to Dashboard
          </Button>

          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserOutlined />
                <span>My Profile</span>
              </div>
            }
            className="shadow-sm"
          >
            {/* Read-Only Information */}
            <Descriptions bordered column={1} size="middle" style={{ marginBottom: 32 }}>
              <Descriptions.Item label="Email">
                {user?.email}{" "}
                <Tag color={user?.emailVerified ? "success" : "default"}>
                  {user?.emailVerified ? "Verified" : "Unverified"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Account Status">
                <Badge
                  status={user?.status === "active" ? "success" : "error"}
                  text={user?.status?.toUpperCase() || "ACTIVE"}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color="blue">{user?.role?.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                <Typography.Text copyable>{user?._id}</Typography.Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Edit Details</Divider>

            {/* Editable Form */}
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Your Name" />
              </Form.Item>

              <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
                Change Password <Typography.Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>(Optional)</Typography.Text>
              </Title>

              <Form.Item
                name="password"
                label="New Password"
                rules={[{ min: 6, message: "Password must be at least 6 characters" }]}
              >
                <Input.Password prefix={<KeyOutlined />} placeholder="New Password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={["password"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords that you entered do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Confirm New Password"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 32 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  block
                  size="large"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </>
  );
}
