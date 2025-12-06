'use client';

import { Check, Copy, Download, FileText, Link as LinkIcon, Upload } from 'lucide-react';
import { useState } from 'react';

export default function PublicUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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
        // Reset file input
        document.getElementById('fileInput').value = '';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Public File Upload
          </h1>
          <p className="text-lg text-gray-600">
            Upload your file and get a shareable link instantly - no account required
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleUpload}>
            <div className="mb-6">
              <label
                htmlFor="fileInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose File
              </label>
              <div className="relative">
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-blue-600 file:to-purple-600
                    file:text-white
                    hover:file:from-blue-700 hover:file:to-purple-700
                    file:cursor-pointer
                    cursor-pointer"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Supported: Images (JPEG, PNG, WebP, GIF), PDF, Text, Word documents. Max size: 5MB
              </p>
            </div>

            {file && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-4 px-6 rounded-full font-semibold text-white
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:from-blue-700 hover:to-purple-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg hover:shadow-xl
                flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload File
                </>
              )}
            </button>
          </form>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Successful!</h2>
                <p className="text-gray-600">Your file is now available</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Shareable URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shareable Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uploadResult.shareableUrl}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(uploadResult.shareableUrl)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* File Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">File Name</p>
                  <p className="font-medium text-gray-900">{uploadResult.file.originalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="font-medium text-gray-900">{formatFileSize(uploadResult.file.size)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Type</p>
                  <p className="font-medium text-gray-900">{uploadResult.file.mimetype}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Shareable ID</p>
                  <p className="font-mono text-sm text-gray-900">{uploadResult.shareableId}</p>
                </div>
              </div>

              {/* Direct Download Link */}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href={uploadResult.file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
            How It Works
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mr-3 text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
              <p>Select a file from your device (max 5MB)</p>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mr-3 text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
              <p>Click upload and get an instant shareable link</p>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mr-3 text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
              <p>Share the link with anyone - no login required to view or download</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
