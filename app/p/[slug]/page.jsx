'use client';

import NavBar from '@/components/NavBar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';

export default function DynamicPage() {
  const params = useParams();
  const { slug } = params;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/pages/public/${slug}`);
        const data = await res.json();

        if (data.success) {
          setPage(data.data);
        } else {
          setError(data.message || 'Page not found');
        }
      } catch (err) {
        setError('An error occurred loading the page');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 text-lg mb-8">{error || 'Page not found'}</p>
          <a href="/" className="text-blue-600 hover:underline">Return Home</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />

      <main className="flex-grow pt-24 pb-12">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 border-b pb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              {page.title}
            </h1>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(page.updatedAt).toLocaleDateString()}
            </div>
          </header>

          <div
            className="prose prose-lg prose-indigo max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
