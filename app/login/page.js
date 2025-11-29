'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        message.error(res.error);
        setLoading(false);
        return;
      }

      // Fetch the session after successful login
      const session = await getSession();
      
      console.log("session", session);

      if (session?.user) {
        message.success('Logged in successfully');
        
        // Route based on user role
        if (session.user.role === 'admin') {
          console.log("Admin user, redirecting to dashboard");
          router.push('/dashboard');
        } else {
          console.log("Regular user, redirecting to user page");
          router.push('/user');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Please sign in to continue</Text>
        </div>
        
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
          
          <div className="text-center">
            <Text>Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}


