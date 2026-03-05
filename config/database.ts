/**
 * MongoDB Database Configuration
 * Project: JioCoder
 * Project ID: 69a6bf316c74219f0cc1ad19
 */

export const databaseConfig = {
  projectId: '69a6bf316c74219f0cc1ad19',
  projectName: 'JioCoder',
  timezone: '+05:30', // New Delhi, India
  defaultDatabase: 'JioCoder',
  
  // Connection options
  connectionOptions: {
    // Use Indian timezone
    tz: 'Asia/Kolkata',
    // Connection pool settings
    maxPoolSize: 10,
    minPoolSize: 1,
    // Retry settings
    retryWrites: true,
    w: 'majority',
    // Timeout settings
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

export default databaseConfig;

