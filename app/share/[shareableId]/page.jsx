'use client';

import AdDisplay from '@/components/AdDisplay';
import NavBar from '@/components/NavBar';
import {
  CheckCircle,
  Clock,
  Copy,
  Download,
  Eye,
  FileIcon,
  FileText,
  Image as ImageIcon,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import Loading from '../../../components/Loading';

export default function SharedFilePage() {
  const params = useParams();
  const { shareableId } = params;

  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    showNavbarOnSharePage: true,
    showFooterOnSharePage: true,
  });

  useEffect(() => {
    fetch('/api/settings/site')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`/api/public-files/${shareableId}`);
        const result = await response.json();

        if (result.success) {
          setFileData(result.data);
        } else {
          setError(result.message || 'File not found');
        }
      } catch (err) {
        setError('Failed to load file details');
      } finally {
        setLoading(false);
      }
    };

    if (shareableId) {
      fetchFile();
    }
  }, [shareableId]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to get icon based on mime type
  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return <ImageIcon className="w-20 h-20 text-purple-600" />;
    if (mimetype === 'application/pdf') return <FileText className="w-20 h-20 text-red-500" />;
    return <FileIcon className="w-20 h-20 text-blue-500" />;
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-white/60">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Oops! Access Denied</h1>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <a
            href="/"
            className="inline-flex w-full items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl hover:from-black hover:to-gray-900 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {settings.showNavbarOnSharePage && <NavBar />}

      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[100%] h-[100%] rounded-full bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/40 blur-3xl animate-pulse"></div>
        <div className="absolute top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-blue-200/30 via-cyan-200/20 to-teal-200/30 blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute -bottom-[20%] right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-violet-200/30 via-fuchsia-200/20 to-rose-200/30 blur-3xl animate-pulse [animation-delay:4s]"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left Column: Premium File Preview */}
          <div className="order-2 lg:order-1 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-[3rem]"></div>

              {/* Main Card */}
              <div className="relative bg-white/70 backdrop-blur-2xl rounded-[3rem] p-3 shadow-2xl border border-white/60 transform transition-all duration-500 hover:scale-[1.02] hover:rotate-1">
                {/* Inner Frame */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[2.5rem] overflow-hidden aspect-[4/3] flex items-center justify-center relative border border-gray-200/50">
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                  {/* Radial Gradient Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]"></div>

                  {fileData.mimetype.startsWith('image/') ? (
                    <img
                      src={fileData.directUrl}
                      alt={fileData.originalName}
                      className="w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                  ) : (
                    <div className="text-center p-8 z-10">
                      <div className="w-40 h-40 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:-translate-y-3 group-hover:rotate-6 transition-all duration-500 border border-gray-100">
                        {getFileIcon(fileData.mimetype)}
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-lg">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <p className="font-bold text-gray-500 tracking-wider text-sm">Preview Unavailable</p>
                      </div>
                    </div>
                  )}

                  {/* Premium Type Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xl">
                      <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        {fileData.mimetype.split('/')[1]}
                      </span>
                    </div>
                  </div>

                  {/* Compressed Badge */}
                  {fileData.isCompressed && (
                    <div className="absolute bottom-6 left-6">
                      <div className="px-4 py-2 bg-green-500/90 backdrop-blur rounded-full shadow-lg">
                        <span className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          Compressed
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tl from-pink-400 to-rose-500 rounded-full blur-2xl opacity-30 animate-pulse animation-delay-1000"></div>
            </div>
          </div>

          {/* Right Column: Premium File Details */}
          <div className="order-1 lg:order-2 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-black mb-8 shadow-lg border-2 border-white/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <CheckCircle className="w-4 h-4" />
              READY TO DOWNLOAD
            </div>

            {/* File Name */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-none tracking-tighter break-words">
              {fileData.originalName}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-base font-semibold text-gray-600 mb-10">
              <span className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <Clock className="w-4 h-4 text-indigo-600" />
                {formatDate(fileData.createdAt)}
              </span>
              <span className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                {formatFileSize(fileData.size)}
              </span>
              <span className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-md">
                <Lock className="w-4 h-4" />
                SECURE
              </span>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/10 group-hover:to-indigo-400/10 transition-all duration-300"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-1">Virus Scanned</h3>
                    <p className="text-sm text-gray-600">100% safe and secure</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-300"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-1">Lightning Fast</h3>
                    <p className="text-sm text-gray-600">Optimized delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={fileData.downloadUrl}
                download
                onClick={() => {
                  setFileData(prev => ({
                    ...prev,
                    analytics: {
                      ...prev.analytics,
                      downloadCount: (prev.analytics?.downloadCount || 0) + 1
                    }
                  }));
                }}
                className="group flex-1 relative overflow-hidden inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Download className="relative w-6 h-6 mr-3 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative">DOWNLOAD NOW</span>
                <Sparkles className="relative w-5 h-5 ml-2 group-hover:scale-125 transition-transform duration-300" />
              </a>

              <button
                onClick={copyToClipboard}
                className="inline-flex items-center justify-center px-10 py-5 bg-white/80 backdrop-blur text-gray-700 border-2 border-gray-200 rounded-2xl font-black text-lg hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-200"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-6 h-6 mr-3" />
                    COPY LINK
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-8 p-6 bg-white/60 backdrop-blur rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-black text-gray-900 mb-1">
                  <Download className="w-5 h-5 text-indigo-600" />
                  {fileData.analytics?.downloadCount || 0}
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Downloads</p>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-black text-gray-900 mb-1">
                  <Eye className="w-5 h-5 text-purple-600" />
                  {fileData.analytics?.viewCount || 0}
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Views</p>
              </div>
            </div>

            {/* Ad Space */}
            <div className="mt-8">
              <AdDisplay placement="share_sidebar" />
            </div>
          </div>
        </div>
      </div>

      {settings.showFooterOnSharePage && <div className="relative z-10"><Footer /></div>}
    </div>
  );
}
