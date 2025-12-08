'use client';

import {
  DatabaseOutlined
} from '@ant-design/icons';
import { Menu, Sparkles, X } from 'lucide-react';
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
  const [navLinks, setNavLinks] = useState([]);
  const [siteName, setSiteName] = useState('FileStore');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

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
        if (data.success && data.data) {
          const { navbarLinks, branding } = data.data;
          if (navbarLinks) {
            setNavLinks(navbarLinks.sort((a, b) => a.order - b.order));
          }
          if (branding) {
            setSiteName(branding.companyName || 'FileStore');
            setLogoUrl(branding.logo || '');
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 backdrop-blur-2xl shadow-lg border-b border-white/60'
        : 'bg-white/40 backdrop-blur-xl'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-lg transition-all duration-300 ${scrolled ? 'shadow-indigo-500/30' : 'shadow-indigo-500/50'
              } group-hover:scale-110 group-hover:rotate-6`}>
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="w-7 h-7 object-contain" />
              ) : (
                <DatabaseOutlined className="text-white text-2xl" />
              )}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              {navLinks.map(link => (
                <Link key={link.path} href={link.path}>
                  <button className="px-5 py-2.5 font-bold text-gray-700 hover:text-indigo-600 transition-colors rounded-xl hover:bg-white/60">
                    {link.label}
                  </button>
                </Link>
              ))}

              {session ? (
                <button
                  onClick={() => router.push(session.user.role === 'admin' ? '/dashboard' : '/user')}
                  className="px-6 py-3 bg-white/80 backdrop-blur border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-gray-300 hover:bg-white transition-all"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link href="/login">
                    <button className="px-5 py-2.5 font-bold text-gray-700 hover:text-indigo-600 transition-colors rounded-xl hover:bg-white/60">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative">Get Started</span>
                      <Sparkles className="relative w-4 h-4 group-hover:scale-125 transition-transform" />
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl bg-white/60 backdrop-blur border border-gray-200 hover:bg-white transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="pb-6 animate-fade-in">
            <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/60">
              {navLinks.map(link => (
                <Link key={link.path} href={link.path}>
                  <button className="w-full text-left px-4 py-3 font-bold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition-colors">
                    {link.label}
                  </button>
                </Link>
              ))}

              {session ? (
                <button
                  onClick={() => router.push(session.user.role === 'admin' ? '/dashboard' : '/user')}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link href="/login">
                    <button className="w-full text-left px-4 py-3 font-bold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                      Get Started
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}