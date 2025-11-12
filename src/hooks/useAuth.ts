import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    setLoading,
    initializeAuth,
  } = useAuthStore();

  const navigate = useNavigate();

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const result = await authService.processGoogleCallback(credentialResponse.credential);
      
      if (result) {
        login(result.user, result.token);
        
        // Redirect based on user role
        if (result.user.role === 'counselor') {
          navigate('/counselor/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Failed to process Google authentication');
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google authentication failed');
    setLoading(false);
    // Handle error (show toast, etc.)
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const requireAuth = (allowedRoles?: ('student' | 'counselor')[]) => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      navigate('/unauthorized');
      return false;
    }

    return true;
  };

  const requireRole = (role: 'student' | 'counselor') => {
    return requireAuth([role]);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    handleGoogleSuccess,
    handleGoogleError,
    logout: handleLogout,
    requireAuth,
    requireRole,
  };
};

export default useAuth;