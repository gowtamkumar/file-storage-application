import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const SiteSettingsSchema = new mongoose.Schema({
  navbarLinks: {
    type: [LinkSchema],
    default: [
      { label: 'Pricing', path: '/pricing', order: 0 },
      { label: 'Docs', path: '/docs', order: 1 },
      { label: 'API Docs', path: '/docs/api', order: 2 },
    ],
  },
  footerText: {
    type: String,
    default: '© 2024 FileStore. All rights reserved.',
  },
  footerLinks: {
    type: [LinkSchema],
    default: [],
  },
  showNavbarOnSharePage: {
    type: Boolean,
    default: true,
  },
  showFooterOnSharePage: {
    type: Boolean,
    default: true,
  },
  branding: {
    companyName: { type: String, default: 'FileStore' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
  },
  seo: {
    siteTitle: { type: String, default: 'FileStore - Secure File Sharing' },
    titleTemplate: { type: String, default: '%s | FileStore' },
    metaDescription: { type: String, default: 'Securely store and share your files with FileStore.' },
    keywords: { type: String, default: 'file sharing, cloud storage, secure upload' },
    ogImage: { type: String, default: '' },
    twitterHandle: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' },
  },
}, { collection: 'site_settings', timestamps: true });

// Ensure only one document exists
SiteSettingsSchema.statics.getSettings = async function () {
  const model = this;
  let settings = await model.findOne();
  if (!settings) {
    settings = await model.create({});
  }
  return settings;
};

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
