'use client';

import {
  CrownOutlined,
  DashboardOutlined,
  FileOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          // Automatically collapse on mobile/tablet
          setCollapsed(broken);
        }}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[

            ...(session?.user?.role === 'admin' ? [{
              key: '1',
              icon: <HomeOutlined />,
              label: 'Dashboard',
              onClick: () => router.push('/dashboard'),
            }, {
              key: '0',
              icon: <FileOutlined />,
              label: 'File',
              onClick: () => router.push('/dashboard/file'),
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: 'Users',
              onClick: () => router.push('/dashboard/users'),
            },
            {
              key: '3',
              icon: <CrownOutlined />,
              label: 'Subscriptions',
              onClick: () => router.push('/dashboard/subscriptions'),
            },
            {
              key: '4',
              icon: <DashboardOutlined />,
              label: 'Plans',
              onClick: () => router.push('/dashboard/plans'),
            },
            {
              key: '5',
              icon: <NotificationOutlined />,
              label: 'Ads',
              onClick: () => router.push('/dashboard/ads'),
            },
            {
              key: '6',
              icon: <SettingOutlined />,
              label: 'Settings',
              onClick: () => router.push('/dashboard/settings'),
            },

            ] : [])
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 0 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 20px 0 0',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            <span style={{
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {session?.user?.name} ({session?.user?.role})
            </span>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => signOut({ callbackUrl: '/login' })}
              size="small"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
