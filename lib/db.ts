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
  // Check if connection is already established and healthy
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection exists but is not ready, reset it
  if (cached.conn && mongoose.connection.readyState !== 1) {
    console.warn('⚠️ MongoDB connection state:', mongoose.connection.readyState, '- reconnecting...');
    cached.conn = null;
    cached.promise = null;
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
      // Add connection event handlers for better reliability
      retryWrites: true,
      retryReads: true,
    };

    // Set up connection event handlers
    mongoose.connection.on('connected', () => {
      console.log(`✅ MongoDB connected to ${databaseConfig.projectName} (${databaseConfig.projectId})`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      // Reset cache on error
      cached.conn = null;
      cached.promise = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      // Reset cache on disconnect
      cached.conn = null;
      cached.promise = null;
    });

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log(`📍 Timezone: ${databaseConfig.timezone} (${databaseConfig.connectionOptions.tz})`);
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset promise so the next call will retry the connection
        cached.promise = null;
        cached.conn = null;
        console.error('❌ MongoDB connection error:', err);
        throw err;
      });
  }

  // Wait for the connection to complete, then cache and return it
  try {
    cached.conn = await cached.promise;
    // Verify connection is actually ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Connection established but not ready');
    }
    return cached.conn;
  } catch (error) {
    // Reset on failure
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

export default connectDB;

