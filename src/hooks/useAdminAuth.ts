import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const adminData = localStorage.getItem('admin_user');
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    } catch (error) {
      // Clear invalid session data
      localStorage.removeItem('admin_user');
      logger.warn('Invalid admin session data cleared');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Query admin users from Supabase
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('id, email, name, password_hash')
        .eq('email', email.toLowerCase().trim())
        .limit(1);

      if (error) {
        logger.error('Database error during admin authentication', error);
        throw new Error('Authentication system error');
      }

      if (!adminUsers || adminUsers.length === 0) {
        logger.warn('Admin login attempt with invalid email', { email });
        throw new Error('Invalid credentials');
      }

      const adminUser = adminUsers[0];
      
      // For production, implement proper password hashing verification
      // This is a simplified check for development
      const isValidPassword = password === 'admin123' && email === 'admin@baraton.com';
      
      if (!isValidPassword) {
        logger.warn('Admin login attempt with invalid password', { email });
        throw new Error('Invalid credentials');
      }

      const sessionData = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name
      };
      
      localStorage.setItem('admin_user', JSON.stringify(sessionData));
      setAdmin(sessionData);
      logger.info('Admin login successful', { email: adminUser.email });
      
      return { success: true };
    } catch (error: any) {
      logger.error('Admin login failed', { error: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('admin_user');
      setAdmin(null);
      logger.info('Admin logout successful');
    } catch (error) {
      logger.error('Admin logout error', error);
    }
  };

  return {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  };
};