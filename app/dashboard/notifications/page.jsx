'use client';

import {
  SendOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Table,
  Tag,
  Typography
} from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      message.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSending(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, recipient: 'all' }), // Currently hardcoded to 'all'
      });
      const data = await res.json();
      if (data.success) {
        message.success('Notification sent successfully');
        form.resetFields();
        fetchNotifications();
      } else {
        message.error(data.message || 'Failed to send');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setSending(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colors = {
          info: 'blue',
          success: 'green',
          warning: 'orange',
          error: 'red',
        };
        return <Tag color={colors[type] || 'default'}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Sent At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Read By',
      dataIndex: 'readBy',
      key: 'readBy',
      render: (readBy) => readBy.length,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Notifications Manager</h1>
        <p className="text-gray-500">Send announcements to all users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card title="Send Broadcast Notification" bordered={false} className="shadow-sm">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input placeholder="e.g. System Maintenance" />
              </Form.Item>

              <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                <Input.TextArea rows={4} placeholder="Detailed message..." />
              </Form.Item>

              <Form.Item name="type" label="Type" initialValue="info">
                <Select>
                  <Option value="info">Info</Option>
                  <Option value="success">Success</Option>
                  <Option value="warning">Warning</Option>
                  <Option value="error">Error</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={sending} block>
                  Send Broadcast
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Notification History" bordered={false} className="shadow-sm">
            <Table
              columns={columns}
              dataSource={notifications}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
