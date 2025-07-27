// Environment configuration for deployment
export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API configuration
  supabase: {
    url: 'https://uasjnnipbgwkbkcidllr.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc2pubmlwYmd3a2JrY2lkbGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTc0MzksImV4cCI6MjA2NDI3MzQzOX0.5_Ea3QqH7ZtgvJHvZAevsNsVgUQs6f2P_Mvyh-pcDKM'
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