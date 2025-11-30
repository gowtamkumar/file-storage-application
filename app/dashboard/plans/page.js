'use client';

import {
    AppstoreOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
} from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title } = Typography;
const { TextArea } = Input;

export default function PlansManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();

  // Redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      message.error('Access denied. Admin only.');
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Fetch plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/plans');
      const data = await res.json();
      
      if (data.success) {
        setPlans(data.data);
      } else {
        message.error(data.error || 'Failed to fetch plans');
      }
    } catch (error) {
      message.error('Error fetching plans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchPlans();
    }
  }, [session]);

  // Handle create/update plan
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Convert features from textarea to array
      const featuresArray = values.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f);

      const planData = {
        ...values,
        features: featuresArray,
        limits: {
          storage: values.storageLimit,
          files: values.fileLimit,
        },
      };

      // Remove temporary fields
      delete planData.storageLimit;
      delete planData.fileLimit;

      const url = editingPlan
        ? `/api/admin/plans/${editingPlan._id}`
        : '/api/admin/plans';
      
      const method = editingPlan ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      const data = await res.json();

      if (data.success) {
        message.success(editingPlan ? 'Plan updated successfully' : 'Plan created successfully');
        setModalVisible(false);
        setEditingPlan(null);
        form.resetFields();
        fetchPlans();
      } else {
        message.error(data.error || 'Failed to save plan');
      }
    } catch (error) {
      message.error('Error saving plan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete (deactivate) plan
  const handleDelete = async (planId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        message.success('Plan deactivated successfully');
        fetchPlans();
      } else {
        message.error(data.error || 'Failed to deactivate plan');
      }
    } catch (error) {
      message.error('Error deactivating plan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle activate plan
  const handleActivate = async (planId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      });

      const data = await res.json();

      if (data.success) {
        message.success('Plan activated successfully');
        fetchPlans();
      } else {
        message.error(data.error || 'Failed to activate plan');
      }
    } catch (error) {
      message.error('Error activating plan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for editing
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      planId: plan.planId,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      description: plan.description,
      features: plan.features.join('\n'),
      storageLimit: plan.limits.storage,
      fileLimit: plan.limits.files,
      highlighted: plan.highlighted,
      active: plan.active,
      displayOrder: plan.displayOrder,
    });
    setModalVisible(true);
  };

  // Open modal for creating
  const handleCreate = () => {
    setEditingPlan(null);
    form.resetFields();
    form.setFieldsValue({
      currency: 'USD',
      interval: 'month',
      highlighted: false,
      active: true,
      displayOrder: 0,
    });
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Plan ID',
      dataIndex: 'planId',
      key: 'planId',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Price',
      key: 'price',
      width: 120,
      render: (_, record) => (
        <span>
          {record.currency} {record.price.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Interval',
      dataIndex: 'interval',
      key: 'interval',
      width: 100,
      render: (interval) => (
        <Tag color={interval === 'forever' ? 'green' : 'blue'}>{interval}</Tag>
      ),
    },
    {
      title: 'Storage',
      key: 'storage',
      width: 100,
      render: (_, record) => {
        const storage = record.limits.storage;
        if (storage >= 1024) {
          return `${(storage / 1024).toFixed(1)} GB`;
        }
        return `${storage} MB`;
      },
    },
    {
      title: 'Files',
      key: 'files',
      width: 100,
      render: (_, record) => {
        const files = record.limits.files;
        return files === -1 ? 'Unlimited' : files;
      },
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Highlighted',
      dataIndex: 'highlighted',
      key: 'highlighted',
      width: 100,
      render: (highlighted) => (highlighted ? <Tag color="gold">Yes</Tag> : '-'),
    },
    {
      title: 'Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 80,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          {record.active ? (
            <Popconfirm
              title="Deactivate this plan?"
              description="Users won't be able to subscribe to this plan."
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Button
              type="link"
              onClick={() => handleActivate(record._id)}
            >
              Activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (status === 'loading') {
    return null;
  }

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <AppstoreOutlined /> Subscription Plans
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Plan
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={plans}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPlan(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={700}
        okText={editingPlan ? 'Update' : 'Create'}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Plan ID"
            name="planId"
            rules={[
              { required: true, message: 'Please enter plan ID' },
              { pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, and hyphens' },
            ]}
          >
            <Input placeholder="e.g., pro-monthly" disabled={editingPlan} />
          </Form.Item>

          <Form.Item
            label="Plan Name"
            name="name"
            rules={[{ required: true, message: 'Please enter plan name' }]}
          >
            <Input placeholder="e.g., Pro Plan" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={2} placeholder="e.g., Best for professionals" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please enter price' }]}
              style={{ width: 200 }}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: '100%' }}
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              label="Currency"
              name="currency"
              rules={[{ required: true }]}
              style={{ width: 120 }}
            >
              <Select>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
                <Select.Option value="BDT">BDT</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Interval"
              name="interval"
              rules={[{ required: true }]}
              style={{ width: 140 }}
            >
              <Select>
                <Select.Option value="month">Monthly</Select.Option>
                <Select.Option value="year">Yearly</Select.Option>
                <Select.Option value="forever">Forever</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            label="Features (one per line)"
            name="features"
            rules={[{ required: true, message: 'Please enter at least one feature' }]}
          >
            <TextArea
              rows={4}
              placeholder="10 GB Storage&#10;1000 Files&#10;API Access&#10;Priority Support"
            />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="Storage Limit (MB)"
              name="storageLimit"
              rules={[{ required: true, message: 'Please enter storage limit' }]}
              style={{ width: 200 }}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="1024"
              />
            </Form.Item>

            <Form.Item
              label="File Limit"
              name="fileLimit"
              rules={[{ required: true, message: 'Please enter file limit' }]}
              style={{ width: 200 }}
              tooltip="-1 for unlimited"
            >
              <InputNumber
                min={-1}
                style={{ width: '100%' }}
                placeholder="100"
              />
            </Form.Item>

            <Form.Item
              label="Display Order"
              name="displayOrder"
              style={{ width: 140 }}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0"
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="Highlighted"
              name="highlighted"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Active"
              name="active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
