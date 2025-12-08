'use client';

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Result,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function TransactionDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const params = useParams();
  const router = useRouter();

  const fetchTransactionDetails = async () => {
    try {
      const response = await fetch(`/api/admin/transactions/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setTransaction(result.data);
      } else {
        message.error(result.message || 'Failed to fetch transaction details');
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      message.error('Error fetching details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTransactionDetails();
    }
  }, [params.id]);

  const getStatusTag = (status) => {
    switch (status) {
      case 'success':
        return <Tag icon={<CheckCircleOutlined />} color="success">Success</Tag>;
      case 'pending':
        return <Tag icon={<SyncOutlined spin />} color="processing">Pending</Tag>;
      case 'failed':
        return <Tag icon={<CloseCircleOutlined />} color="error">Failed</Tag>;
      case 'cancelled':
        return <Tag icon={<CloseCircleOutlined />} color="default">Cancelled</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading transaction details..." />
      </div>
    );
  }

  if (!transaction) {
    return (
      <Result
        status="404"
        title="Transaction not found"
        subTitle="The transaction you are looking for does not exist."
        extra={
          <Button type="primary" onClick={() => router.push('/dashboard/transactions')}>
            Back to Transactions
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/dashboard/transactions')}
        style={{ marginBottom: 16 }}
      >
        Back to List
      </Button>

      <Card bordered={false} className="shadow-md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={3} style={{ margin: 0 }}>Transaction Details</Title>
          {getStatusTag(transaction.status)}
        </div>

        <Divider />

        <Descriptions title="Payment Information" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Transaction ID">{transaction.transactionId}</Descriptions.Item>
          <Descriptions.Item label="Amount">
            <Text strong style={{ fontSize: '16px' }}>
              {transaction.amount} {transaction.currency.toUpperCase()}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Date">{new Date(transaction.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            <Space>
              <CreditCardOutlined />
              {transaction.paymentMethod?.toUpperCase() || 'UNKNOWN'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Plan ID">{transaction.planId}</Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title="User Information" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">
            <Space>
              <Avatar icon={<UserOutlined />} src={transaction.userId?.image} />
              {transaction.userId?.name || 'Unknown'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email">{transaction.userId?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="User ID">{transaction.userId?._id || transaction.userId}</Descriptions.Item>
        </Descriptions>

        {Object.keys(transaction.metadata || {}).length > 0 && (
          <>
            <Divider />
            <Descriptions title="Metadata" bordered column={1}>
              <Descriptions.Item label="Data">
                <pre style={{ margin: 0, maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </div>
  );
}

// Helper to make imports work if Space was missed above
import { Space } from 'antd';
