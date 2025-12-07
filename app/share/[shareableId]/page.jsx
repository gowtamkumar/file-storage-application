'use client';

import {
  CheckCircle,
  Clock,
  Copy,
  Download,
  FileIcon,
  FileText,
  Image as ImageIcon,
  Shield,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SharedFilePage() {
  const params = useParams();
  const { shareableId } = params;

  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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
    if (mimetype.startsWith('image/')) return <ImageIcon className="w-16 h-16 text-purple-600" />;
    if (mimetype === 'application/pdf') return <FileText className="w-16 h-16 text-red-500" />;
    return <FileIcon className="w-16 h-16 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-xl font-medium text-gray-400 animate-pulse">Fetching your file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <a href="/" className="inline-flex w-full items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-semibold">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] relative selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-indigo-100/50 to-purple-100/50 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-100/40 to-pink-100/40 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Column: File Preview */}
          <div className="order-2 lg:order-1 animate-fade-in-up">
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-[2rem]" />

              <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-2 shadow-2xl border border-white/60 transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
                <div className="bg-gray-50 rounded-[2rem] overflow-hidden aspect-[4/3] flex items-center justify-center relative border border-gray-100">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                  {fileData.mimetype.startsWith('image/') ? (
                    <img
                      src={fileData.directUrl}
                      alt={fileData.originalName}
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-32 h-32 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                        {getFileIcon(fileData.mimetype)}
                      </div>
                      <p className="font-semibold text-gray-400 tracking-wider text-sm uppercase">Preview Unavailable</p>
                    </div>
                  )}

                  {/* Overlay Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-200 uppercase tracking-wide">
                      {fileData.mimetype.split('/')[1].toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: File Details */}
          <div className="order-1 lg:order-2 animate-fade-in-up delay-100">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Ready for download
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                {fileData.originalName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {formatDate(fileData.createdAt)}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{formatFileSize(fileData.size)}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Secure</span>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Virus Scanned</h3>
                  <p className="text-xs text-gray-500">File is safe and clean</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">High Speed</h3>
                  <p className="text-xs text-gray-500">Optimized for fast download</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
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
                className="flex-1 inline-flex items-center justify-center px-8 py-4.5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Download File
              </a>

              <button
                onClick={copyToClipboard}
                className="inline-flex items-center justify-center px-8 py-4.5 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            <p className="mt-8 text-center sm:text-left text-xs text-gray-400">
              Total Downloads: <span className="text-gray-600 font-medium">{fileData.analytics?.downloadCount || 0}</span> • Views: <span className="text-gray-600 font-medium">{fileData.analytics?.viewCount || 0}</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
