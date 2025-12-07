'use client';

import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, InputNumber, Select, Space, Switch, Tabs, message } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

export default function SiteSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [pages, setPages] = useState([]);
  const [testEmailLoading, setTestEmailLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data.success) {
        setPages(data.data.filter(p => p.isPublished));
      }
    } catch (error) {
      console.error('Error fetching pages', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/site');
      const data = await res.json();
      if (data.success) {
        form.setFieldsValue(data.data);
      } else {
        message.error('Failed to fetch settings');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setFetching(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success('Settings updated successfully');
      } else {
        message.error(data.message || 'Update failed');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    const smtpSettings = form.getFieldValue('smtp');
    if (!smtpSettings?.host || !smtpSettings?.user) {
      message.warning('Please configure and save SMTP settings first');
      return;
    }

    const testEmail = smtpSettings.fromEmail || smtpSettings.user;

    setTestEmailLoading(true);
    try {
      const res = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail }),
      });
      const data = await res.json();
      if (data.success) {
        message.success(`Test email sent to ${testEmail}`);
      } else {
        message.error(data.message || 'Failed to send test email');
      }
    } catch (error) {
      message.error('Error sending test email');
    } finally {
      setTestEmailLoading(false);
    }
  };

  function renderSeoSettings() {
    return (
      <Card title="Search Engine Optimization (SEO)">
        <p className="mb-4 text-gray-500">Configure global SEO settings for your site. These will be used as defaults.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name={['seo', 'siteTitle']} label="Site Title" rules={[{ required: true }]}>
            <Input placeholder="FileStore - Secure File Sharing" />
          </Form.Item>
          <Form.Item name={['seo', 'titleTemplate']} label="Title Template" help="Use %s as a placeholder for page title">
            <Input placeholder="%s | FileStore" />
          </Form.Item>
          <Form.Item name={['seo', 'metaDescription']} label="Default Meta Description" className="md:col-span-2">
            <Input.TextArea rows={2} showCount maxLength={160} />
          </Form.Item>
          <Form.Item name={['seo', 'keywords']} label="Global Keywords" className="md:col-span-2">
            <Input placeholder="files, sharing, cloud, secure" />
          </Form.Item>
          <Form.Item name={['seo', 'ogImage']} label="Default Social Image URL" className="md:col-span-2">
            <Input placeholder="https://example.com/og-image.jpg" />
          </Form.Item>
          <Form.Item name={['seo', 'twitterHandle']} label="Twitter Handle">
            <Input placeholder="@username" prefix="@" />
          </Form.Item>
          <Form.Item name={['seo', 'googleAnalyticsId']} label="Google Analytics ID">
            <Input placeholder="G-XXXXXXXXXX" />
          </Form.Item>
        </div>
      </Card>
    );
  }

  if (fetching) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} loading={loading}>
          Save Changes
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="large"
          items={[
            {
              key: '1',
              label: 'General',
              children: (
                <>
                  <Card title="Company Information" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name={['branding', 'companyName']} label="Company Name">
                        <Input placeholder="e.g. Acme Corp" />
                      </Form.Item>
                      <Form.Item name={['branding', 'email']} label="Email Address">
                        <Input placeholder="contact@example.com" />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name={['branding', 'logo']} label="Logo URL">
                        <Input placeholder="https://example.com/logo.png" />
                      </Form.Item>
                      <Form.Item name={['branding', 'favicon']} label="Favicon URL">
                        <Input placeholder="https://example.com/favicon.ico" />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name={['branding', 'phone']} label="Phone Number">
                        <Input placeholder="+1 (555) 123-4567" />
                      </Form.Item>
                    </div>
                    <Form.Item name={['branding', 'address']} label="Address">
                      <Input.TextArea rows={2} placeholder="123 Main St, City, Country" />
                    </Form.Item>
                    <Form.Item name={['branding', 'description']} label="Company Description">
                      <Input.TextArea rows={3} placeholder="A brief description of your company..." />
                    </Form.Item>
                  </Card>
                </>
              ),
            },
            {
              key: '2',
              label: 'Communication',
              children: (
                <>
                  <Card title="Social Media Links" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name={['socialLinks', 'facebook']} label="Facebook">
                        <Input placeholder="https://facebook.com/yourpage" />
                      </Form.Item>
                      <Form.Item name={['socialLinks', 'twitter']} label="Twitter / X">
                        <Input placeholder="https://twitter.com/yourhandle" />
                      </Form.Item>
                      <Form.Item name={['socialLinks', 'instagram']} label="Instagram">
                        <Input placeholder="https://instagram.com/yourprofile" />
                      </Form.Item>
                      <Form.Item name={['socialLinks', 'linkedin']} label="LinkedIn">
                        <Input placeholder="https://linkedin.com/company/yourcompany" />
                      </Form.Item>
                      <Form.Item name={['socialLinks', 'github']} label="GitHub">
                        <Input placeholder="https://github.com/yourorg" />
                      </Form.Item>
                      <Form.Item name={['socialLinks', 'youtube']} label="YouTube">
                        <Input placeholder="https://youtube.com/@yourchannel" />
                      </Form.Item>
                    </div>
                  </Card>

                  <Card title="Email Configuration (SMTP)" className="mb-6">
                    <p className="mb-4 text-gray-500">Configure SMTP settings to enable the system to send emails.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name={['smtp', 'host']} label="SMTP Host">
                        <Input placeholder="smtp.gmail.com" />
                      </Form.Item>
                      <Form.Item name={['smtp', 'port']} label="SMTP Port">
                        <InputNumber placeholder="587" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item name={['smtp', 'user']} label="SMTP Username">
                        <Input placeholder="your-email@gmail.com" />
                      </Form.Item>
                      <Form.Item name={['smtp', 'password']} label="SMTP Password">
                        <Input.Password placeholder="Your app password" />
                      </Form.Item>
                      <Form.Item name={['smtp', 'fromEmail']} label="From Email">
                        <Input placeholder="noreply@yourdomain.com" />
                      </Form.Item>
                      <Form.Item name={['smtp', 'fromName']} label="From Name">
                        <Input placeholder="FileStore" />
                      </Form.Item>
                    </div>
                    <Form.Item name={['smtp', 'secure']} label="Use SSL/TLS (Port 465)" valuePropName="checked">
                      <Switch />
                    </Form.Item>

                    <Divider />

                    <Button
                      type="default"
                      onClick={handleTestEmail}
                      loading={testEmailLoading}
                    >
                      Send Test Email
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      A test email will be sent to the configured from email address.
                    </p>
                  </Card>
                </>
              ),
            },
            {
              key: '3',
              label: 'Navigation',
              children: (
                <>
                  <Card title="Navbar Configuration" className="mb-6">
                    <Form.List name="navbarLinks">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'label']}
                                rules={[{ required: true, message: 'Missing label' }]}
                              >
                                <Input placeholder="Label (e.g. Pricing)" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'path']}
                                rules={[{ required: true, message: 'Missing path' }]}
                              >
                                <Input placeholder="Path (e.g. /pricing)" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'order']}
                              >
                                <InputNumber placeholder="Order" />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Navbar Link
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Divider />

                    <Form.Item name="showNavbarOnSharePage" label="Show Navbar on Share Page" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Card>

                  <Card title="Footer Configuration" className="mb-6">
                    <Form.Item name="footerText" label="Footer Copyright Text">
                      <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.List name="footerLinks">
                      {(fields, { add, remove }) => (
                        <>
                          <div className="mb-2 font-medium">Footer Links</div>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'label']}
                                rules={[{ required: true, message: 'Missing label' }]}
                              >
                                <Input placeholder="Label" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'path']}
                                rules={[{ required: true, message: 'Missing path' }]}
                              >
                                <Input placeholder="Path" />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Footer Link
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <div style={{ marginTop: 16 }}>
                      <div className="mb-2 font-medium">Add Page to Footer</div>
                      <Select
                        placeholder="Select a page to add"
                        style={{ width: 300 }}
                        onChange={(value, option) => {
                          const currentLinks = form.getFieldValue('footerLinks') || [];
                          form.setFieldsValue({
                            footerLinks: [...currentLinks, { label: option.children, path: `/pages/${value}`, order: currentLinks.length }]
                          });
                          message.success('Added to footer list');
                        }}
                      >
                        {pages.map(page => (
                          <Option key={page._id} value={page.slug}>{page.title}</Option>
                        ))}
                      </Select>
                    </div>

                    <Divider />

                    <Form.Item name="showFooterOnSharePage" label="Show Footer on Share Page" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Card>
                </>
              ),
            },
            {
              key: '4',
              label: 'SEO & Analytics',
              children: (
                <Card title="Search Engine Optimization (SEO)">
                  <p className="mb-4 text-gray-500">Configure global SEO settings for your site. These will be used as defaults.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name={['seo', 'siteTitle']} label="Site Title" rules={[{ required: true }]}>
                      <Input placeholder="FileStore - Secure File Sharing" />
                    </Form.Item>
                    <Form.Item name={['seo', 'titleTemplate']} label="Title Template" help="Use %s as a placeholder for page title">
                      <Input placeholder="%s | FileStore" />
                    </Form.Item>
                    <Form.Item name={['seo', 'metaDescription']} label="Default Meta Description" className="md:col-span-2">
                      <Input.TextArea rows={2} showCount maxLength={160} />
                    </Form.Item>
                    <Form.Item name={['seo', 'keywords']} label="Global Keywords" className="md:col-span-2">
                      <Input placeholder="files, sharing, cloud, secure" />
                    </Form.Item>
                    <Form.Item name={['seo', 'ogImage']} label="Default Social Image URL" className="md:col-span-2">
                      <Input placeholder="https://example.com/og-image.jpg" />
                    </Form.Item>
                    <Form.Item name={['seo', 'twitterHandle']} label="Twitter Handle">
                      <Input placeholder="@username" prefix="@" />
                    </Form.Item>
                    <Form.Item name={['seo', 'googleAnalyticsId']} label="Google Analytics ID">
                      <Input placeholder="G-XXXXXXXXXX" />
                    </Form.Item>
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </Form>
    </div>
  );
}
