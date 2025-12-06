'use client';

import { Check, Cloud, Copy, Download, FileText, Globe, Link as LinkIcon, Lock, Sparkles, Upload, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

export default function PublicUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/public-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
        setFile(null);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <Cloud className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Share Files Instantly
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Drop your file, get a link. No sign-up, no hassle. Just pure simplicity.
          </p>
          {/* <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Powered by AI-optimized compression</span>
          </div> */}
        </div>

        {/* Upload Area */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <form onSubmit={handleUpload}>
            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
                ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                }`}
            >
              <input
                ref={fileInputRef}
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />

              <div className="flex flex-col items-center">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-6 transform transition-all duration-300 ${isDragging ? 'scale-110 rotate-12' : 'scale-100'
                  }`}>
                  <Upload className="w-12 h-12 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {isDragging ? 'Drop your file here!' : 'Drag and Drop your file here'}
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>

                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </div>

                <p className="mt-6 text-xs text-gray-400">
                  Images, PDFs, Documents - Max 5MB - Secure and Private
                </p>
              </div>
            </div>

            {file && (
              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 animate-slide-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 rounded-2xl border-2 border-red-200 animate-shake">
                <p className="text-sm text-red-600 font-medium">Warning: {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full mt-8 py-5 px-8 rounded-2xl font-bold text-lg text-white
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 shadow-2xl hover:shadow-3xl
                transform hover:scale-105 active:scale-95
                flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading your file...
                </>
              ) : (
                <>
                  <Cloud className="w-6 h-6" />
                  Upload and Generate Link
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl p-8 border-2 border-green-300 animate-slide-up">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mr-5 shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Success!</h2>
                <p className="text-gray-600 text-lg">Your file is ready to share</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Shareable URL */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-indigo-600" />
                  Your Shareable Link
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={uploadResult.shareableUrl}
                    readOnly
                    className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl bg-white text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => copyToClipboard(uploadResult.shareableUrl)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* File Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">File Name</p>
                  <p className="font-semibold text-gray-900 text-sm truncate">{uploadResult.file.originalName}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Size</p>
                  <p className="font-semibold text-gray-900 text-sm">{formatFileSize(uploadResult.file.size)}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-900 text-sm truncate">{uploadResult.file.mimetype}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">ID</p>
                  <p className="font-mono text-xs text-gray-900 truncate">{uploadResult.shareableId}</p>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex flex-col md:flex-row gap-4">
                <a
                  href={uploadResult.file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download File
                </a>
                <button
                  onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}${uploadResult.file.path}`)}
                  className="flex-1 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold flex items-center justify-center"
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
                <button
                  onClick={() => {
                    setUploadResult(null);
                    setFile(null);
                  }}
                  className="flex-1 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
                >
                  Upload Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">Upload and share files in seconds with our optimized infrastructure</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure and Private</h3>
            <p className="text-gray-600 text-sm">Your files are protected with enterprise-grade security measures</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Share Anywhere</h3>
            <p className="text-gray-600 text-sm">Anyone with the link can access your files, no account needed</p>
          </div>
        </div>
      </div>


    </div>
  );
}
