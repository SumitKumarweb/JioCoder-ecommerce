import mongoose from 'mongoose';
import databaseConfig from '@/config/database';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Configure Mongoose with project-specific settings
    mongoose.set('strictQuery', true);

    const opts = {
      bufferCommands: false,
      maxPoolSize: databaseConfig.connectionOptions.maxPoolSize,
      minPoolSize: databaseConfig.connectionOptions.minPoolSize,
      serverSelectionTimeoutMS: databaseConfig.connectionOptions.serverSelectionTimeoutMS,
      socketTimeoutMS: databaseConfig.connectionOptions.socketTimeoutMS,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log(`✅ MongoDB connected to ${databaseConfig.projectName} (${databaseConfig.projectId})`);
        console.log(`📍 Timezone: ${databaseConfig.timezone} (${databaseConfig.connectionOptions.tz})`);
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset promise so the next call will retry the connection
        cached.promise = null;
        console.error('❌ MongoDB connection error:', err);
        throw err;
      });
  }

  // Wait for the connection to complete, then cache and return it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

