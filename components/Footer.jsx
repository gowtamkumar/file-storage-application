"use client";

import {
  FacebookFilled,
  GithubFilled,
  InstagramFilled,
  LinkedinFilled,
  TwitterCircleFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [settings, setSettings] = useState({
    footerText: `© ${new Date().getFullYear()} FileStore. All rights reserved.`,
    footerLinks: [],
    socialLinks: {},
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings/site");
        const data = await res.json();
        if (data.success && data.data) {
          setSettings({
            footerText:
              data.data.footerText ||
              `© ${new Date().getFullYear()} FileStore. All rights reserved.`,
            footerLinks: data.data.footerLinks || [],
            socialLinks: data.data.socialLinks || {},
          });
        }
      } catch (error) {
        console.error("Failed to fetch footer settings");
      }
    };
    fetchSettings();
  }, []);

  const socialIcons = {
    facebook: <FacebookFilled className="w-5 h-5" />,
    twitter: <TwitterCircleFilled className="w-5 h-5" />,
    instagram: <InstagramFilled className="w-5 h-5" />,
    linkedin: <LinkedinFilled className="w-5 h-5" />,
    github: <GithubFilled className="w-5 h-5" />,
    youtube: <YoutubeFilled className="w-5 h-5" />,
  };

  const socialColors = {
    facebook: "hover:bg-blue-600",
    twitter: "hover:bg-blue-400",
    instagram: "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600",
    linkedin: "hover:bg-blue-700",
    github: "hover:bg-gray-800",
    youtube: "hover:bg-red-600",
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black">FileStore</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Secure, fast, and reliable file storage for modern teams.
              Experience the future of cloud storage.
            </p>

            {/* Social Links */}
            {settings.socialLinks &&
              Object.values(settings.socialLinks).some(Boolean) && (
                <div className="flex gap-3">
                  {Object.entries(settings.socialLinks).map(([key, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:text-white ${socialColors[key]}`}
                      >
                        {socialIcons[key]}
                      </a>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {settings.footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
              {settings.footerLinks.length === 0 && (
                <>
                  <li>
                    <Link
                      href="/pricing"
                      className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/docs"
                      className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      Documentation
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-black mb-6 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates and exclusive offers delivered to your
              inbox.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {settings.footerText}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
