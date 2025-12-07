import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this page.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this page.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this page.'],
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters'],
  },
  keywords: {
    type: String,
  },
  ogImage: {
    type: String,
  },
  canonicalUrl: {
    type: String,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { collection: 'pages', timestamps: true });

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
