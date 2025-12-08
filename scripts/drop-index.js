
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function dropIndex() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('subscriptions');

    // List indexes index to confirm
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the unique index on userId
    const indexName = 'userId_1';
    if (indexes.find(idx => idx.name === indexName)) {
      await collection.dropIndex(indexName);
      console.log(`Dropped index: ${indexName}`);
    } else {
      console.log(`Index ${indexName} not found`);
    }

    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

dropIndex();
