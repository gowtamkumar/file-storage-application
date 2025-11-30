'use client';

import { CrownOutlined, DollarOutlined, RocketOutlined, StarOutlined, TeamOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscription/all');
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (plan) => {
    const icons = {
      free: <ThunderboltOutlined style={{ fontSize: '20px', color: '#667eea' }} />,
      basic: <StarOutlined style={{ fontSize: '20px', color: '#f5576c' }} />,
      pro: <RocketOutlined style={{ fontSize: '20px', color: '#00f2fe' }} />,
      enterprise: <CrownOutlined style={{ fontSize: '20px', color: '#38f9d7' }} />,
    };
    return icons[plan] || icons.free;
  };

  const getPlanColor = (plan) => {
    const colors = {
      free: 'default',
      basic: 'pink',
      pro: 'blue',
      enterprise: 'green',
    };
    return colors[plan] || 'default';
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.userId?.name || 'Unknown'}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.userId?.email}</Text>
        </div>
      ),
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan) => (
        <Space>
          {getPlanIcon(plan)}
          <Tag color={getPlanColor(plan)} style={{ textTransform: 'capitalize', fontWeight: 500 }}>
            {plan}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'cancelled' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Storage Limit',
      dataIndex: 'storageLimit',
      key: 'storage',
      render: (limit) => limit === -1 ? 'Unlimited' : `${limit} MB`,
    },
    {
      title: 'File Limit',
      dataIndex: 'fileLimit',
      key: 'files',
      render: (limit) => limit === -1 ? 'Unlimited' : limit,
    },
    {
      title: 'Features',
      key: 'features',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          {record.features.apiAccess && <div>✓ API Access</div>}
          {record.features.customBranding && <div>✓ Custom Branding</div>}
          {record.features.prioritySupport && <div>✓ Priority Support</div>}
          {record.features.analytics && <div>✓ Analytics</div>}
        </div>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => (
        record.paymentInfo?.amount ? (
          <div>
            <div style={{ fontWeight: 500 }}>${record.paymentInfo.amount}</div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {record.paymentInfo.transactionId}
            </Text>
          </div>
        ) : (
          <Text type="secondary">Free</Text>
        )
      ),
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '100px',
       paddingBottom: '80px',
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px 32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Subscription Management
          </Title>
          <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
            Monitor and manage all user subscriptions
          </Text>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Subscriptions</span>}
                  value={stats.total}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: 'white', fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Active Subscriptions</span>}
                  value={stats.active}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: 'white', fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Revenue</span>}
                  value={stats.totalRevenue.toFixed(2)}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: 'white', fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ color: 'white' }}>
                  <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Plan Distribution</div>
                  <div style={{ fontSize: '12px' }}>
                    <div>Free: {stats.free}</div>
                    <div>Basic: {stats.basic}</div>
                    <div>Pro: {stats.pro}</div>
                    <div>Enterprise: {stats.enterprise}</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Subscriptions Table */}
        <Card
          style={{ 
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
          bodyStyle={{ padding: '28px' }}
        >
          <Title level={4} style={{ marginBottom: 20 }}>
            All Subscriptions ({subscriptions.length})
          </Title>
          <Table 
            columns={columns} 
            dataSource={subscriptions} 
            rowKey="_id" 
            loading={loading}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true, 
              showTotal: (total) => `Total ${total} subscriptions` 
            }}
            scroll={{ x: 1400 }}
          />
        </Card>
      </div>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
          font-weight: 600 !important;
          color: #262626 !important;
          border-bottom: 2px solid #667eea !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #f0f5ff !important;
        }
      `}</style>
    </div>
  );
}
