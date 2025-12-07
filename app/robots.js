export default function robots() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://yourdomain.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
