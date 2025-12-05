
import { CloudUploadOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mobile menu items for dropdown
  const mobileMenuItems = [
    {
      key: 'pricing',
      label: <Link href="/pricing" className="block py-2 px-4">Pricing</Link>,
    },
    {
      key: 'docs',
      label: <Link href="/docs" className="block py-2 px-4">Docs</Link>,
    },
    {
      key: 'api',
      label: <Link href="/docs/api" className="block py-2 px-4">API Docs</Link>,
    },
    ...(session ? [{
      key: 'dashboard',
      label: (
        <div
          onClick={() => router.push(session.user.role === 'admin' ? '/dashboard' : '/user')}
          className="block py-2 px-4 cursor-pointer"
        >
          Dashboard
        </div>
      ),
    }] : [
      {
        key: 'login',
        label: <Link href="/login" className="block py-2 px-4">Login</Link>,
      },
      {
        key: 'register',
        label: <Link href="/register" className="block py-2 px-4">Get Started</Link>,
      }
    ]),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
      <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 hover:text-blue-700 transition-colors">
          <CloudUploadOutlined /> FileStore
        </Link>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <Space size="middle">
          <Link href="/pricing">
            <Button type="text" className="font-medium">Pricing</Button>
          </Link>
          <Link href="/docs">
            <Button type="text" className="font-medium">Docs</Button>
          </Link>
          <Link href="/docs/api">
            <Button type="text" className="font-medium">API Docs</Button>
          </Link>

          {session ? (
            <Button
              type="primary"
              onClick={() => router.push(session.user.role === 'admin' ? '/dashboard' : '/user')}
              style={{
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Dashboard
            </Button>
          ) : (
            <Link href="/login">
              <Button type="text" className="font-medium">Login</Button>
            </Link>
          )}

          {!session && (
            <Link href="/register">
              <Button type="primary" style={{ borderRadius: '8px', fontWeight: 600 }}>Get Started</Button>
            </Link>
          )}
        </Space>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <Dropdown
          menu={{ items: mobileMenuItems }}
          trigger={['click']}
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Dropdown>
      )}
    </nav>
  );
}