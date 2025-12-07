'use client';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  DatabaseOutlined,
  FileOutlined,
  MailOutlined,
  SearchOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Drawer,
  Input,
  message,
  Modal,
  Progress,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

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
        setStats(data.stats);
      } else {
        message.error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    Modal.confirm({
      title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} User?`,
      content: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this user? ${newStatus === 'inactive' ? 'They will not be able to log in.' : 'They will be able to log in again.'
        }`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status: newStatus }),
          });
          const data = await res.json();
          if (data.success) {
            message.success(data.message);
            fetchUsers();
          } else {
            message.error(data.message || 'Failed to update user status');
          }
        } catch (error) {
          message.error('Failed to update user status');
        }
      },
    });
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setDetailsVisible(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;
  const totalStorage = users.reduce((acc, u) => acc + (u.stats?.storageUsed || 0), 0);
  const totalFiles = users.reduce((acc, u) => acc + (u.stats?.fileCount || 0), 0);

  // Subscription plan colors
  const getPlanColor = (plan) => {
    const colors = {
      free: 'default',
      basic: 'green',
      pro: 'blue',
      enterprise: 'gold',
    };
    return colors[plan?.toLowerCase()] || 'default';
  };

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
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Badge
          status={record.status === 'active' ? 'success' : 'error'}
          text={
            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {record.status || 'active'}
            </span>
          }
        />
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Subscription',
      key: 'subscription',
      render: (_, record) => (
        <div>
          <Tag color={getPlanColor(record.subscription?.plan)} style={{ fontWeight: 600 }}>
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
            {record.stats?.fileCount || 0} /{' '}
            {record.subscription?.fileLimit === -1 ? '∞' : record.subscription?.fileLimit}
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
            {record.stats?.storageUsedMB || 0} MB /{' '}
            {record.subscription?.storageLimit === -1 ? '∞' : `${record.subscription?.storageLimit} MB`}
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => showUserDetails(record)}>
            View Details
          </Button>
          <Switch
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren={<StopOutlined />}
            checked={record.status === 'active'}
            onChange={() => toggleUserStatus(record._id, record.status)}
          />
        </Space>
      ),
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
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}
        >
          <Card>
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
              styles={{ content: { color: '#667eea' } }}
            />
          </Card>
          <Card>
            <Statistic
              title="Active Users"
              value={stats?.activeUsers || 0}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
          <Card>
            <Statistic
              title="Inactive Users"
              value={stats?.inactiveUsers || 0}
              prefix={<CloseCircleOutlined />}
              styles={{ content: { color: '#f5222d' } }}
            />
          </Card>
          <Card>
            <Statistic title="Admin Users" value={adminUsers} prefix={<CrownOutlined />}
              styles={{ content: { color: '#f5576c' } }}
            />
          </Card>
        </div>

        {/* Subscription Statistics */}
        <Card title="Users by Subscription Plan" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {stats?.subscriptionCounts &&
              Object.entries(stats.subscriptionCounts).map(([plan, count]) => (
                <Card.Grid key={plan} style={{ textAlign: 'center', width: '100%' }}>
                  <Statistic
                    title={
                      <Tag color={getPlanColor(plan)} style={{ fontSize: '14px', fontWeight: 600 }}>
                        {plan.toUpperCase()}
                      </Tag>
                    }
                    value={count}
                    suffix={`/ ${totalUsers}`}
                    styles={{ content: { fontSize: '24px' } }}
                  />
                  <Progress
                    percent={Math.round((count / totalUsers) * 100)}
                    size="small"
                    strokeColor={
                      getPlanColor(plan) === 'gold'
                        ? '#faad14'
                        : getPlanColor(plan) === 'blue'
                          ? '#1890ff'
                          : getPlanColor(plan) === 'green'
                            ? '#52c41a'
                            : '#d9d9d9'
                    }
                  />
                </Card.Grid>
              ))}
          </div>
        </Card>

        {/* Storage & Files Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Card>
            <Statistic
              title="Total Files"
              value={totalFiles}
              prefix={<FileOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Storage"
              value={(totalStorage / (1024 * 1024)).toFixed(2)}
              suffix="MB"
              prefix={<DatabaseOutlined />}
              styles={{ content: { color: '#faad14' } }}
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
            <Space>
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{ width: 300 }}
              />
            </Space>
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

        {/* User Details Drawer */}
        <Drawer
          title="User Details"
          placement="right"
          onClose={() => setDetailsVisible(false)}
          open={detailsVisible}
          size="large"
        >
          {selectedUser && (
            <div>
              <Descriptions title="Basic Information" bordered column={1}>
                <Descriptions.Item label="Name">{selectedUser.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={selectedUser.role === 'admin' ? 'red' : 'blue'}>{selectedUser.role?.toUpperCase()}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge
                    status={selectedUser.status === 'active' ? 'success' : 'error'}
                    text={selectedUser.status?.toUpperCase()}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="User ID">
                  <Text copyable={{ text: selectedUser._id }} style={{ fontSize: '12px' }}>
                    {selectedUser._id}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Joined">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="Subscription Details" bordered column={1} style={{ marginTop: '24px' }}>
                <Descriptions.Item label="Plan">
                  <Tag color={getPlanColor(selectedUser.subscription?.plan)} style={{ fontWeight: 600 }}>
                    {selectedUser.subscription?.plan?.toUpperCase() || 'FREE'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">{selectedUser.subscription?.status || 'active'}</Descriptions.Item>
                <Descriptions.Item label="Storage Limit">
                  {selectedUser.subscription?.storageLimit === -1
                    ? 'Unlimited'
                    : `${selectedUser.subscription?.storageLimit} MB`}
                </Descriptions.Item>
                <Descriptions.Item label="File Limit">
                  {selectedUser.subscription?.fileLimit === -1 ? 'Unlimited' : selectedUser.subscription?.fileLimit}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="Usage Statistics" bordered column={1} style={{ marginTop: '24px' }}>
                <Descriptions.Item label="Files">
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                      {selectedUser.stats?.fileCount || 0} /{' '}
                      {selectedUser.subscription?.fileLimit === -1 ? '∞' : selectedUser.subscription?.fileLimit}
                    </div>
                    <Progress
                      percent={
                        selectedUser.subscription?.fileLimit === -1
                          ? 0
                          : Math.min(
                            100,
                            ((selectedUser.stats?.fileCount || 0) / selectedUser.subscription?.fileLimit) * 100
                          )
                      }
                      status={
                        (selectedUser.stats?.fileCount || 0) >= selectedUser.subscription?.fileLimit * 0.9
                          ? 'exception'
                          : 'active'
                      }
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Storage">
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                      {selectedUser.stats?.storageUsedMB || 0} MB /{' '}
                      {selectedUser.subscription?.storageLimit === -1 ? '∞' : `${selectedUser.subscription?.storageLimit} MB`}
                    </div>
                    <Progress
                      percent={
                        selectedUser.subscription?.storageLimit === -1
                          ? 0
                          : Math.min(
                            100,
                            ((parseFloat(selectedUser.stats?.storageUsedMB) || 0) /
                              selectedUser.subscription?.storageLimit) *
                            100
                          )
                      }
                      status={
                        (parseFloat(selectedUser.stats?.storageUsedMB) || 0) >=
                          selectedUser.subscription?.storageLimit * 0.9
                          ? 'exception'
                          : 'active'
                      }
                    />
                  </div>
                </Descriptions.Item>
              </Descriptions>

              {selectedUser.subscription?.features && (
                <Descriptions title="Features" bordered column={1} style={{ marginTop: '24px' }}>
                  <Descriptions.Item label="API Access">
                    {selectedUser.subscription.features.apiAccess ? (
                      <Tag color="green">Enabled</Tag>
                    ) : (
                      <Tag>Disabled</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Custom Branding">
                    {selectedUser.subscription.features.customBranding ? (
                      <Tag color="green">Enabled</Tag>
                    ) : (
                      <Tag>Disabled</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Priority Support">
                    {selectedUser.subscription.features.prioritySupport ? (
                      <Tag color="green">Enabled</Tag>
                    ) : (
                      <Tag>Disabled</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Analytics">
                    {selectedUser.subscription.features.analytics ? (
                      <Tag color="green">Enabled</Tag>
                    ) : (
                      <Tag>Disabled</Tag>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              )}

              <div style={{ marginTop: '24px' }}>
                <Button
                  type="primary"
                  danger={selectedUser.status === 'active'}
                  block
                  icon={selectedUser.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
                  onClick={() => {
                    toggleUserStatus(selectedUser._id, selectedUser.status);
                    setDetailsVisible(false);
                  }}
                >
                  {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                </Button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
}
