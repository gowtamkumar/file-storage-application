'use client';

import {
    ApiOutlined,
    BookOutlined,
    DollarOutlined,
    FileTextOutlined,
    HomeOutlined,
    MenuOutlined,
    QuestionCircleOutlined,
    RocketOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Drawer, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DocsNav() {
  const pathname = usePathname();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: '/docs',
      icon: <HomeOutlined />,
      label: <Link href="/docs">Documentation Home</Link>,
    },
    {
      key: '/docs/getting-started',
      icon: <RocketOutlined />,
      label: <Link href="/docs/getting-started">Getting Started</Link>,
    },
    {
      key: '/docs/user-guide',
      icon: <BookOutlined />,
      label: <Link href="/docs/user-guide">User Guide</Link>,
    },
    {
      key: '/docs/admin-guide',
      icon: <SafetyCertificateOutlined />,
      label: <Link href="/docs/admin-guide">Admin Guide</Link>,
    },
    {
      key: '/docs/plans',
      icon: <DollarOutlined />,
      label: <Link href="/docs/plans">Plans & Pricing</Link>,
    },
    {
      key: '/docs/api',
      icon: <ApiOutlined />,
      label: <Link href="/docs/api">API Documentation</Link>,
    },
    {
      key: '/docs/faq',
      icon: <QuestionCircleOutlined />,
      label: <Link href="/docs/faq">FAQ</Link>,
    },
  ];

  const getBreadcrumbs = () => {
    const breadcrumbMap = {
      '/docs': 'Documentation',
      '/docs/getting-started': 'Getting Started',
      '/docs/user-guide': 'User Guide',
      '/docs/admin-guide': 'Admin Guide',
      '/docs/plans': 'Plans & Pricing',
      '/docs/api': 'API Documentation',
      '/docs/faq': 'FAQ',
    };

    const items = [
      {
        title: <Link href="/">Home</Link>,
      },
    ];

    if (pathname !== '/docs') {
      items.push({
        title: <Link href="/docs">Documentation</Link>,
      });
    }

    if (pathname in breadcrumbMap) {
      items.push({
        title: breadcrumbMap[pathname],
      });
    }

    return items;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <Button
          type="default"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          size="large"
        >
          Documentation Menu
        </Button>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Documentation"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
      >
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Drawer>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: '100px',
          }}
        >
          <h3 style={{ padding: '8px 16px', marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            Documentation
          </h3>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            style={{ border: 'none', background: 'transparent' }}
          />
        </div>
      </div>

      {/* Breadcrumb (for all screens) */}
      <div className="mb-6">
        <Breadcrumb items={getBreadcrumbs()} />
      </div>
    </>
  );
}
