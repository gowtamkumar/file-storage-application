'use client';

import {
  ArrowLeftOutlined,
  BankOutlined,
  CalendarOutlined,
  CloudServerOutlined,
  CrownOutlined,
  FileOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Result,
  Row,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function UserDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const params = useParams();
  const router = useRouter();

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        message.error(result.message || 'Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      message.error('Error fetching details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchUserDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading user details..." />
      </div>
    );
  }

  if (!data) {
    return (
      <Result
        status="404"
        title="User not found"
        subTitle="The user you are looking for does not exist."
        extra={
          <Button type="primary" onClick={() => router.push('/dashboard/users')}>
            Back to Users
          </Button>
        }
      />
    );
  }

  const { user, subscriptions, transactions, stats } = data;

  const subscriptionColumns = [
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      render: (text) => <Tag color={text === 'free' ? 'default' : 'blue'}>{text.toUpperCase()}</Tag>,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => <span>${record.amount || 0}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'expired' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
  ];

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      copyable: true,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => <Text strong>{record.amount} {record.currency}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/dashboard/users')}
        style={{ marginBottom: 16 }}
      >
        Back to Users
      </Button>

      {/* Header Card */}
      <Card bordered={false} className="shadow-sm" style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={4} style={{ textAlign: 'center' }}>
            <Avatar size={100} icon={<UserOutlined />} src={user.image} />
          </Col>
          <Col xs={24} sm={20}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Title level={2} style={{ margin: 0 }}>{user.name}</Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>{user.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color={user.role === 'admin' ? 'purple' : 'default'}>{user.role.toUpperCase()}</Tag>
                  <Tag color={user.status === 'active' ? 'success' : 'error'}>{user.status?.toUpperCase() || 'ACTIVE'}</Tag>
                </div>
              </div>
              <Statistic title="Joined" value={new Date(user.createdAt).toLocaleDateString()} prefix={<CalendarOutlined />} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats Row */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Total Files"
              value={stats.fileCount}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Storage Used"
              value={stats.totalStorageMB}
              suffix="MB"
              prefix={<CloudServerOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm">
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: <span><UserOutlined /> Profile</span>,
            children: (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="User ID">{user._id}</Descriptions.Item>
                <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
                <Descriptions.Item label="Provider">{user.provider || 'credentials'}</Descriptions.Item>
                <Descriptions.Item label="Account Created">{new Date(user.createdAt).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Last Updated">{new Date(user.updatedAt).toLocaleString()}</Descriptions.Item>
              </Descriptions>
            )
          },
          {
            key: '2',
            label: <span><CrownOutlined /> Subscriptions ({subscriptions.length})</span>,
            children: (
              <Table
                dataSource={subscriptions}
                columns={subscriptionColumns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            )
          },
          {
            key: '3',
            label: <span><BankOutlined /> Transactions ({transactions.length})</span>,
            children: (
              <Table
                dataSource={transactions}
                columns={transactionColumns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            )
          }
        ]} />
      </Card>
    </div>
  );
}
