'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export default function PagesDashboard() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data.success) {
        setPages(data.data);
      } else {
        message.error('Failed to fetch pages');
      }
    } catch (error) {
      message.error('Error fetching pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        message.success('Page deleted successfully');
        fetchPages();
      } else {
        message.error(data.message || 'Failed to delete page');
      }
    } catch (error) {
      message.error('Error deleting page');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium">{text}</span>
          <span className="text-xs text-gray-400">/p/{record.slug}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isPublished',
      key: 'status',
      width: 120,
      render: (published) => (
        <Tag color={published ? 'success' : 'default'}>
          {published ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Link href={`/pages/${record.slug}`} target="_blank">
            <Button
              type="text"
              icon={<EyeOutlined />}
              title="View Live"
              disabled={!record.isPublished}
            />
          </Link>
          <Link href={`/dashboard/pages/${record._id}`}>
            <Button type="text" icon={<EditOutlined />} style={{ color: '#1890ff' }} title="Edit" />
          </Link>
          <Popconfirm
            title="Delete this page?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-gray-500">Manage your site's custom pages.</p>
        </div>
        <Link href="/dashboard/pages/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Create New Page
          </Button>
        </Link>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={pages}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
