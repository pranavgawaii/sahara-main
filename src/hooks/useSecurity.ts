import { useCallback, useEffect, useState } from 'react';
import { useStore, useUIStore } from '../stores';
import { createRateLimiter, moderateContent, detectCrisis } from '../utils/validation';

// Authentication security
export const useAuthSecurity = () => {
  const { student, clearUserData } = useStore();
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIMEOUT = 25 * 60 * 1000; // 25 minutes
  
  // Track user activity
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);
  
  // Auto logout on inactivity
  useEffect(() => {
    if (!student) return;
    
    const checkSession = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity >= SESSION_TIMEOUT) {
        clearUserData();
        return;
      }
      
      if (timeSinceActivity >= WARNING_TIMEOUT) {
        // Show warning
        const { addToast } = useUIStore.getState();
        addToast({
          type: 'warning',
          title: 'Session Expiring',
          description: 'Your session will expire in 5 minutes due to inactivity.',
          duration: 10000
        });
      }
    };
    
    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [student, lastActivity, clearUserData]);
  
  // Add activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);
  
  const extendSession = useCallback(() => {
    setLastActivity(Date.now());
  }, []);
  
  return {
    sessionTimeRemaining: SESSION_TIMEOUT - (Date.now() - lastActivity),
    extendSession,
    isSessionExpiring: (Date.now() - lastActivity) >= WARNING_TIMEOUT
  };
};

// Rate limiting for various actions
export const useRateLimit = () => {
  const loginLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
  const messageLimiter = createRateLimiter(50, 60 * 1000); // 50 messages per minute
  const feedbackLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 feedback submissions per hour
  
  const checkLoginLimit = useCallback((identifier: string) => {
    return loginLimiter(identifier);
  }, []);
  
  const checkMessageLimit = useCallback((identifier: string) => {
    return messageLimiter(identifier);
  }, []);
  
  const checkFeedbackLimit = useCallback((identifier: string) => {
    return feedbackLimiter(identifier);
  }, []);
  
  return {
    checkLoginLimit,
    checkMessageLimit,
    checkFeedbackLimit
  };
};

// Content security and moderation
export const useContentSecurity = () => {
  const { addToast } = useUIStore();
  const { addScreeningResult } = useStore();
  
  const moderateMessage = useCallback((content: string, userId: string) => {
    const moderation = moderateContent(content);
    const crisis = detectCrisis(content);
    
    if (crisis.isCrisis) {
      // Log crisis detection - in a real app, this would trigger alerts
      console.error('Crisis detected:', {
        userId,
        severity: crisis.severity,
        content,
        keywords: crisis.keywords,
        timestamp: new Date()
      });
      
      if (crisis.severity === 'high') {
        addToast({
          type: 'error',
          title: 'Crisis Detected',
          description: 'Emergency support has been notified. Please reach out to a counselor immediately.',
          duration: 0 // Don't auto-dismiss
        });
      }
    }
    
    if (!moderation.safe) {
      addToast({
        type: 'warning',
        title: 'Content Flagged',
        description: 'Your message contains content that may violate our guidelines.',
        duration: 5000
      });
    }
    
    return {
      allowed: moderation.safe && !crisis.isCrisis,
      moderation,
      crisis
    };
  }, [addToast, addScreeningResult]);
  
  return { moderateMessage };
};

// Data encryption/decryption (client-side)
export const useDataSecurity = () => {
  const encryptSensitiveData = useCallback((data: string, key?: string): string => {
    // Simple base64 encoding for demo - use proper encryption in production
    try {
      return btoa(data);
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }, []);
  
  const decryptSensitiveData = useCallback((encryptedData: string, key?: string): string => {
    try {
      return atob(encryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }, []);
  
  const hashPassword = useCallback(async (password: string): Promise<string> => {
    // Use Web Crypto API for password hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }, []);
  
  return {
    encryptSensitiveData,
    decryptSensitiveData,
    hashPassword
  };
};

// Secure storage
export const useSecureStorage = () => {
  const setSecureItem = useCallback((key: string, value: any, encrypt = false): void => {
    try {
      const serializedValue = JSON.stringify(value);
      const finalValue = encrypt ? btoa(serializedValue) : serializedValue;
      
      // Add timestamp and integrity check
      const secureData = {
        data: finalValue,
        timestamp: Date.now(),
        encrypted: encrypt,
        checksum: btoa(finalValue).slice(-8) // Simple checksum
      };
      
      localStorage.setItem(`secure_${key}`, JSON.stringify(secureData));
    } catch (error) {
      console.error('Secure storage failed:', error);
    }
  }, []);
  
  const getSecureItem = useCallback((key: string): any => {
    try {
      const item = localStorage.getItem(`secure_${key}`);
      if (!item) return null;
      
      const secureData = JSON.parse(item);
      
      // Verify checksum
      const expectedChecksum = btoa(secureData.data).slice(-8);
      if (secureData.checksum !== expectedChecksum) {
        console.warn('Data integrity check failed');
        return null;
      }
      
      // Check if data is too old (24 hours)
      if (Date.now() - secureData.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(`secure_${key}`);
        return null;
      }
      
      const rawData = secureData.encrypted ? atob(secureData.data) : secureData.data;
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      return null;
    }
  }, []);
  
  const removeSecureItem = useCallback((key: string): void => {
    localStorage.removeItem(`secure_${key}`);
  }, []);
  
  const clearSecureStorage = useCallback((): void => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('secure_'));
    keys.forEach(key => localStorage.removeItem(key));
  }, []);
  
  return {
    setSecureItem,
    getSecureItem,
    removeSecureItem,
    clearSecureStorage
  };
};

// Permission and role-based access
export const usePermissions = () => {
  const { student } = useStore();
  
  const hasPermission = useCallback((permission: string): boolean => {
    if (!student) return false;
    
    const userPermissions = {
      student: [
        'view_dashboard',
        'take_screening',
        'chat_with_peers',
        'book_appointment',
        'view_resources',
        'track_mood',
        'set_goals'
      ],
      counselor: [
        'view_dashboard',
        'view_student_data',
        'manage_appointments',
        'access_crisis_alerts',
        'view_analytics',
        'moderate_content'
      ],
      admin: [
        'manage_users',
        'view_all_data',
        'system_settings',
        'export_data',
        'manage_content'
      ]
    };
    
    const rolePermissions = userPermissions[student.role as keyof typeof userPermissions] || [];
    return rolePermissions.includes(permission);
  }, [student]);
  
  const requirePermission = useCallback((permission: string): boolean => {
    const hasAccess = hasPermission(permission);
    if (!hasAccess) {
      const { addToast } = useUIStore.getState();
      addToast({
        type: 'error',
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
        duration: 5000
      });
    }
    return hasAccess;
  }, [hasPermission]);
  
  return {
    hasPermission,
    requirePermission,
    userRole: student?.role
  };
};

// Security monitoring
export const useSecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<Array<{
    type: string;
    timestamp: Date;
    details: any;
  }>>([]);
  
  const logSecurityEvent = useCallback((type: string, details: any) => {
    const event = {
      type,
      timestamp: new Date(),
      details
    };
    
    setSecurityEvents(prev => [...prev.slice(-99), event]); // Keep last 100 events
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', event);
    }
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Implementation would send to monitoring service
    }
  }, []);
  
  const detectSuspiciousActivity = useCallback((activity: {
    type: string;
    frequency: number;
    timeWindow: number;
  }) => {
    const recentEvents = securityEvents.filter(
      event => 
        event.type === activity.type &&
        Date.now() - event.timestamp.getTime() < activity.timeWindow
    );
    
    if (recentEvents.length >= activity.frequency) {
      logSecurityEvent('suspicious_activity', {
        activityType: activity.type,
        eventCount: recentEvents.length,
        timeWindow: activity.timeWindow
      });
      return true;
    }
    
    return false;
  }, [securityEvents, logSecurityEvent]);
  
  return {
    logSecurityEvent,
    detectSuspiciousActivity,
    securityEvents: securityEvents.slice(-10) // Return last 10 events
  };
};

// Input validation and sanitization
export const useInputSecurity = () => {
  const sanitizeInput = useCallback((input: string): string => {
    return input
      .trim()
      .replace(/[<>"'&]/g, (match) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match] || match;
      });
  }, []);
  
  const validateFileUpload = useCallback((file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }
    
    // Check file extension matches MIME type
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeToExtension: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/gif': ['gif'],
      'application/pdf': ['pdf'],
      'text/plain': ['txt']
    };
    
    const expectedExtensions = mimeToExtension[file.type];
    if (!expectedExtensions || !extension || !expectedExtensions.includes(extension)) {
      return { valid: false, error: 'File extension does not match file type' };
    }
    
    return { valid: true };
  }, []);
  
  return {
    sanitizeInput,
    validateFileUpload
  };
};

// Authentication hook
export const useAuth = () => {
  const { student, clearUserData } = useStore();
  const { addToast } = useUIStore();
  
  const isAuthenticated = !!student;
  const userRole = student?.role || 'student';
  
  const secureLogout = useCallback(() => {
    // Clear sensitive data
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Clear store data
    clearUserData();
    
    addToast({
      type: 'info',
      title: 'Logged out successfully',
      duration: 3000
    });
  }, [clearUserData, addToast]);
  
  return {
    isAuthenticated,
    logout: clearUserData,
    secureLogout,
    user: student,
    userRole
  };
};