'use client';

import { AlertCircle, Check, CheckCircle, Clock, Copy, Download, FileText, Shield } from 'lucide-react';
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading file details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a href="/public-upload" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium">
            Go to Upload Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-white/50 relative z-10 animate-fade-in">
        <div className="grid md:grid-cols-2">
          {/* Left Side: Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
            {fileData.mimetype.startsWith('image/') ? (
              <div className="relative group w-full h-64 md:h-full min-h-[300px] flex items-center justify-center">
                <img
                  src={fileData.downloadUrl}
                  alt={fileData.originalName}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-40 h-40 bg-white rounded-2xl shadow-xl flex items-center justify-center transform rotate-3 transition-transform duration-300 hover:rotate-0">
                <FileText className="w-20 h-20 text-indigo-600" />
              </div>
            )}
          </div>

          {/* Right Side: Details & Actions */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-4 uppercase tracking-wide">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready to Download
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 break-words leading-tight">
                {fileData.originalName}
              </h1>
              <div className="flex items-center text-gray-500 text-sm space-x-4 mt-3">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                  {formatFileSize(fileData.size)}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                  {fileData.mimetype.split('/')[1].toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <Shield className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Secure Transfer</h3>
                  <p className="text-xs text-gray-500 mt-1">This file was shared securely via our encrypted platform.</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <Clock className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Uploaded On</h3>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(fileData.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={fileData.downloadUrl}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all flex items-center justify-center group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Download
              </a>
              <button
                onClick={copyToClipboard}
                className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center min-w-[140px]"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            {/* Analytics Display */}
            {fileData.analytics && (
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span>{fileData.analytics.viewCount} {fileData.analytics.viewCount === 1 ? 'view' : 'views'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>{fileData.analytics.downloadCount} {fileData.analytics.downloadCount === 1 ? 'download' : 'downloads'}</span>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-6">
              By downloading, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
