"use client";

import {
  FacebookFilled,
  GithubFilled,
  InstagramFilled,
  LinkedinFilled,
  TwitterCircleFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import { Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Title } = Typography;

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
    facebook: (
      <FacebookFilled className="text-xl hover:text-blue-600 transition-colors" />
    ),
    twitter: (
      <TwitterCircleFilled className="text-xl hover:text-blue-400 transition-colors" />
    ),
    instagram: (
      <InstagramFilled className="text-xl hover:text-pink-600 transition-colors" />
    ),
    linkedin: (
      <LinkedinFilled className="text-xl hover:text-blue-700 transition-colors" />
    ),
    github: (
      <GithubFilled className="text-xl hover:text-gray-800 transition-colors" />
    ),
    youtube: (
      <YoutubeFilled className="text-xl hover:text-red-600 transition-colors" />
    ),
  };

  return (
    <footer className="py-12 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm order-2 md:order-1">
            {settings.footerText}
          </div>

          <div className="flex items-center gap-6 order-1 md:order-2">
            {/* Footer Links */}
            <div className="flex gap-6 text-sm text-gray-600">
              {settings.footerLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  className="hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            {settings.socialLinks &&
              Object.values(settings.socialLinks).some(Boolean) && (
                <div className="flex gap-4 border-l pl-6 border-gray-200">
                  {Object.entries(settings.socialLinks).map(([key, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400"
                      >
                        {socialIcons[key]}
                      </a>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>
    </footer>
  );
}
