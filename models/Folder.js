import mongoose from 'mongoose';

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a folder name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // null means root folder
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate folder names within the same parent for the same user
FolderSchema.index({ name: 1, userId: 1, parentId: 1 }, { unique: true });

export default mongoose.models.Folder || mongoose.model('Folder', FolderSchema);
