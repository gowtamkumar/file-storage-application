import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import dbConnect from "@/lib/db";
import Page from "@/models/Page";
import SiteSettings from "@/models/SiteSettings";
import PageContent from "./PageContent";

async function getPage(slug) {
  await dbConnect();
  const page = await Page.findOne({ slug, isPublished: true }).lean();
  return page;
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const page = await getPage(slug);
  await dbConnect();
  const settings = await SiteSettings.findOne().lean();

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const titleTemplate = settings?.seo?.titleTemplate || "%s | FileStore";
  const ogImage = page.ogImage || settings?.seo?.ogImage || "";

  return {
    title: page.title,
    description: page.metaDescription || settings?.seo?.metaDescription,
    openGraph: {
      title: page.title,
      description: page.metaDescription || settings?.seo?.metaDescription,
      images: ogImage ? [ogImage] : [],
      url: page.canonicalUrl || `${process.env.NEXTAUTH_URL || ''}/p/${slug}`,
    },
    keywords: page.keywords ? page.keywords.split(',').map(k => k.trim()) : [],
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = params;
  const page = await getPage(slug);

  if (!page) {
    // Return 404 UI manually if needed, or use notFound() to trigger global not-found
    // Using custom UI to match previous implementation style
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 text-lg mb-8">Page not found</p>
          <a href="/" className="text-blue-600 hover:underline">Return Home</a>
        </div>
        <Footer />
      </div>
    );
  }

  // Pass serializable data to client component
  // Convert _id and dates to strings if necessary, but lean() helps.
  const serializedPage = {
    ...page,
    _id: page._id.toString(),
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };

  return <PageContent page={serializedPage} />;
}
