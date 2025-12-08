import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-100/20 to-pink-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Loading Spinner */}
      <div className="relative">
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-500 border-l-blue-500 animate-spin animation-delay-150"></div>
        </div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600 animate-pulse" />
      </div>
      <p className="mt-8 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
        Loading your file...
      </p>
      <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
    </div>
  );
}
