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
    required: false, // Optional for backward compatibility or public uploads if allowed later
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.File || mongoose.model('File', FileSchema);
