
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
  const [links, setLinks] = useState([]);

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/site');
        const data = await res.json();
        if (data.success && data.data && data.data.navbarLinks) {
          setLinks(data.data.navbarLinks.sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  // Mobile menu items for dropdown
  const mobileMenuItems = [
    ...links.map(link => ({
      key: link.path,
      label: <Link href={link.path} className="block py-2 px-4">{link.label}</Link>
    })),
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
          {links.map(link => (
            <Link key={link.path} href={link.path}>
              <Button type="text" className="font-medium">{link.label}</Button>
            </Link>
          ))}

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