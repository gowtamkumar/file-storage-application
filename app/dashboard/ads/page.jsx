'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

export default function AdsManagementPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [form] = Form.useForm();
  const [adType, setAdType] = useState('local');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      if (data.success) {
        setAds(data.data);
      } else {
        message.error(data.message || 'Failed to fetch ads');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (ad = null) => {
    setEditingAd(ad);
    if (ad) {
      form.setFieldsValue(ad);
      setAdType(ad.type);
    } else {
      form.resetFields();
      setAdType('local');
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingAd(null);
    form.resetFields();
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      const url = editingAd ? `/api/ads/${editingAd._id}` : '/api/ads';
      const method = editingAd ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        message.success(editingAd ? 'Ad updated successfully' : 'Ad created successfully');
        fetchAds(); // Refresh list
        handleCancel();
      } else {
        message.error(data.message || 'Operation failed');
      }
    } catch (error) {
      message.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        message.success('Ad deleted successfully');
        fetchAds();
      } else {
        message.error(data.message || 'Delete failed');
      }
    } catch (error) {
      message.error('An error occurred');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Local', value: 'local' },
        { text: 'Google', value: 'google' },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
      render: (type) => <Tag color={type === 'google' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive) => <Tag color={isActive ? 'success' : 'default'}>{isActive ? 'ACTIVE' : 'INACTIVE'}</Tag>,
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      sorter: (a, b) => a.clicks - b.clicks,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  // Analytics Calculations
  const totalAds = ads.length;
  const activeAds = ads.filter(ad => ad.isActive).length;
  const totalViews = ads.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalClicks = ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advertisement Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          New Ad
        </Button>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic title="Total Ads" value={totalAds} styles={{ content: { color: '#3f8600' } }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Active Ads" value={activeAds} styles={{ content: { color: '#3f8600' } }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Views" value={totalViews} styles={{ content: { color: '#3f8600' } }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Clicks" value={totalClicks} styles={{ content: { color: '#cf1322' } }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table columns={columns} dataSource={ads} rowKey="_id" loading={loading} />
      </Card>

      <Modal
        title={editingAd ? 'Edit Ad' : 'Create New Ad'}
        open={modalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Ad Type" initialValue="local" rules={[{ required: true }]}>
            <Select onChange={(value) => setAdType(value)}>
              <Option value="local">Local (Image)</Option>
              <Option value="google">Google Ads</Option>
            </Select>
          </Form.Item>

          <Form.Item name="placement" label="Placement" initialValue="everywhere">
            <Select>
              <Option value="everywhere">Everywhere (Rotation)</Option>
              <Option value="home_top">Home Page Top</Option>
              <Option value="home_bottom">Home Page Bottom</Option>
              <Option value="share_sidebar">Share Page Sidebar</Option>
            </Select>
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked" initialValue={true}>
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>

          {adType === 'local' && (
            <>
              <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true }]}>
                <Input placeholder="https://example.com/banner.jpg" />
              </Form.Item>
              <Form.Item name="linkUrl" label="Destination Link" rules={[{ required: true }]}>
                <Input placeholder="https://example.com" />
              </Form.Item>
            </>
          )}

          {adType === 'google' && (
            <Form.Item name="adCode" label="Ad Code / Script" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="<script>...</script>" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
