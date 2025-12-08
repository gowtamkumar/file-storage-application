import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for public uploads
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // null means file is in root
  },
  isPublic: {
    type: Boolean,
    default: false, // false for authenticated uploads, true for public uploads
  },
  shareableId: {
    type: String,
    unique: true,
    sparse: true, // Only enforce uniqueness when value is present
    index: true, // Index for fast lookup
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  lastViewed: {
    type: Date,
    default: null,
  },
  lastDownloaded: {
    type: Date,
    default: null,
  },
  isCompressed: {
    type: Boolean,
    default: false, // True if file is compressed with gzip
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.File || mongoose.model('File', FileSchema);
