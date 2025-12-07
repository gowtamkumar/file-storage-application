'use client';

import {
  ArrowLeftOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Switch,
  Typography,
} from 'antd';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function PageEditor() {
  const router = useRouter();
  const params = useParams();
  const PAGE_ID = params.id;
  const isNew = PAGE_ID === 'new';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [PAGE_ID]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages/${PAGE_ID}`);
      const data = await res.json();
      if (data.success) {
        form.setFieldsValue(data.data);
      } else {
        message.error('Failed to fetch page data');
        router.push('/dashboard/pages');
      }
    } catch (error) {
      message.error('Error loading page');
    } finally {
      setFetching(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const url = isNew ? '/api/pages' : `/api/pages/${PAGE_ID}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data.success) {
        message.success(`Page ${isNew ? 'created' : 'updated'} successfully`);
        if (isNew) {
          router.push(`/dashboard/pages/${data.data._id}`);
        }
      } else {
        message.error(data.message || 'Operation failed');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Simple slug generator helper
  const handleTitleChange = (e) => {
    if (isNew) {
      const title = e.target.value;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setFieldsValue({ slug });
    }
  };

  if (fetching) return <div className="p-10 text-center">Loading editor...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Space>
          <Link href="/dashboard/pages">
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
          <h1 className="text-2xl font-bold m-0">{isNew ? 'Create New Page' : 'Edit Page'}</h1>
        </Space>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => form.submit()}
          loading={loading}
        >
          {isNew ? 'Create Page' : 'Save Changes'}
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isPublished: false }}
        autoComplete="off"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Form.Item
                name="title"
                label="Page Title"
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input size="large" placeholder="e.g. Terms of Service" onChange={handleTitleChange} />
              </Form.Item>

              <Form.Item
                name="content"
                label="Content (HTML/Markdown)"
                rules={[{ required: true, message: 'Please enter content' }]}
                help="You can write HTML or plain text here."
              >
                <Input.TextArea
                  rows={20}
                  placeholder="<h1>Welcome</h1><p>Write your content here...</p>"
                  className="font-mono text-sm"
                />
              </Form.Item>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Publishing">
              <Form.Item name="slug" label="URL Slug" rules={[{ required: true }]}>
                <Input prefix="/p/" placeholder="my-page-slug" />
              </Form.Item>

              <Form.Item name="isPublished" label="Status" valuePropName="checked">
                <Switch checkedChildren="Published" unCheckedChildren="Draft" />
              </Form.Item>
            </Card>

            <Card title="SEO Settings">
              <Form.Item name="metaDescription" label="Meta Description">
                <Input.TextArea rows={3} maxLength={160} showCount placeholder="Brief summary for search engines" />
              </Form.Item>

              <Form.Item name="keywords" label="Keywords">
                <Input placeholder="comma, separated, keywords" />
              </Form.Item>

              <Form.Item name="ogImage" label="Social Share Image URL">
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>

              <Form.Item name="canonicalUrl" label="Canonical URL">
                <Input placeholder="https://example.com/p/my-page" />
              </Form.Item>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
}
