'use client';

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

export default function PageContent({ page }) {
  if (!page) return null;

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
