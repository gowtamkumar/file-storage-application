'use client';

import { CrownOutlined, DatabaseOutlined, FileOutlined, MailOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Progress, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        message.error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const totalStorage = users.reduce((acc, u) => acc + (u.stats?.storageUsed || 0), 0);
  const totalFiles = users.reduce((acc, u) => acc + (u.stats?.fileCount || 0), 0);

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserOutlined />
            {record.name || 'N/A'}
            {record.role === 'admin' && <Tag color="red">ADMIN</Tag>}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            <MailOutlined style={{ marginRight: '4px' }} />
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Subscription',
      key: 'subscription',
      render: (_, record) => (
        <div>
          <Tag
            color={
              record.subscription?.plan === 'enterprise'
                ? 'gold'
                : record.subscription?.plan === 'pro'
                ? 'blue'
                : record.subscription?.plan === 'basic'
                ? 'green'
                : 'default'
            }
            style={{ fontWeight: 600 }}
          >
            {record.subscription?.plan?.toUpperCase() || 'FREE'}
          </Tag>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            {record.subscription?.status || 'active'}
          </div>
        </div>
      ),
    },
    {
      title: 'Files',
      key: 'files',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.stats?.fileCount || 0} / {record.subscription?.fileLimit === -1 ? '∞' : record.subscription?.fileLimit}
          </div>
          <Progress
            percent={
              record.subscription?.fileLimit === -1
                ? 0
                : Math.min(100, ((record.stats?.fileCount || 0) / record.subscription?.fileLimit) * 100)
            }
            size="small"
            showInfo={false}
            status={(record.stats?.fileCount || 0) >= record.subscription?.fileLimit * 0.9 ? 'exception' : 'active'}
          />
        </div>
      ),
    },
    {
      title: 'Storage',
      key: 'storage',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.stats?.storageUsedMB || 0} MB / {record.subscription?.storageLimit === -1 ? '∞' : `${record.subscription?.storageLimit} MB`}
          </div>
          <Progress
            percent={
              record.subscription?.storageLimit === -1
                ? 0
                : Math.min(
                    100,
                    ((parseFloat(record.stats?.storageUsedMB) || 0) / record.subscription?.storageLimit) * 100
                  )
            }
            size="small"
            showInfo={false}
            status={
              (parseFloat(record.stats?.storageUsedMB) || 0) >= record.subscription?.storageLimit * 0.9
                ? 'exception'
                : 'active'
            }
          />
        </div>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              User Management
            </Title>
            <Text type="secondary">Manage all users and view their statistics</Text>
          </div>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Card>
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#667eea' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Admin Users"
              value={adminUsers}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#f5576c' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Files"
              value={totalFiles}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Storage"
              value={(totalStorage / (1024 * 1024)).toFixed(2)}
              suffix="MB"
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </div>

        {/* Users Table */}
        <Card
          title={
            <Space>
              <UserOutlined />
              <span>All Users ({filteredUsers.length})</span>
            </Space>
          }
          extra={
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
          }
        >
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
