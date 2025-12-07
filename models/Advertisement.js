import mongoose from 'mongoose';

const AdvertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  type: {
    type: String,
    enum: ['local', 'google'],
    required: true,
  },
  placement: {
    type: String,
    default: 'everywhere', // Can be used for specific slots like 'home_hero', 'share_sidebar'
  },
  // For Local Ads
  imageUrl: {
    type: String,
    required: function() { return this.type === 'local'; }
  },
  linkUrl: {
    type: String,
    required: function() { return this.type === 'local'; }
  },
  // For Google Ads
  adCode: {
    type: String,
    required: function() { return this.type === 'google'; }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Analytics
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);
