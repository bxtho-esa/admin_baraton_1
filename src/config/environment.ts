// Environment configuration for deployment
export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API configuration
  backend: {
    url: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
  },
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || 'your-api-key',
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'your-api-secret',
  },

  // App configuration
  app: {
    name: 'Baraton Oasis Hotel Admin',
    version: '1.0.0',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    maxRoomsPerType: 50,
    maxBookingAmount: 10000000, // 100,000 KES in kobo
    minBookingAmount: 100 // 1 KES in kobo
  },

  // Feature flags
  features: {
    enableRealTimeUpdates: true,
    enableImageUpload: true,
    enableAdvancedAnalytics: true
  }
};