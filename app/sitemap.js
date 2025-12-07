import dbConnect from "@/lib/db";
import Page from "@/models/Page";

export default async function sitemap() {
  await dbConnect();
  const baseUrl = process.env.NEXTAUTH_URL || 'https://yourdomain.com';

  // Dynamic Pages
  const pages = await Page.find({ isPublished: true }).select('slug updatedAt').lean();
  const dynamicRoutes = pages.map((page) => ({
    url: `${baseUrl}/p/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Static Routes
  const staticRoutes = [
    '',
    '/login',
    '/register',
    '/pricing',
    '/docs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
