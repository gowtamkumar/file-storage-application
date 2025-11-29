const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/file-storage';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

async function test() {
  console.log('Testing Environment...');
  if (!NEXTAUTH_SECRET) {
    console.error('ERROR: NEXTAUTH_SECRET is not set in .env.local');
  } else {
    console.log('NEXTAUTH_SECRET is set');
  }

  console.log('Testing DB Connection...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
    }));

    const count = await User.countDocuments();
    console.log(`Found ${count} users`);

    if (count > 0) {
      const user = await User.findOne({});
      console.log('First user:', user.email, user.role);
    } else {
      console.log('No users found. Please register a user first.');
    }

  } catch (error) {
    console.error('DB Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

test();
