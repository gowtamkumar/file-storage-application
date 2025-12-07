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
