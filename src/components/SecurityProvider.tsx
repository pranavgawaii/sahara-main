import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth, useRateLimit, useContentSecurity, useDataSecurity, useSecurityMonitoring, useInputSecurity } from '../hooks/useSecurity';
import { useUIStore } from '../stores/useUIStore';

// Define SecurityEvent interface
interface SecurityEventDetails {
  type: string;
  severity: 'low' | 'medium' | 'high';
  details: any;
  timestamp: Date;
}

interface SecurityContextType {
  auth: ReturnType<typeof useAuth>;
  rateLimit: ReturnType<typeof useRateLimit>;
  contentSecurity: ReturnType<typeof useContentSecurity>;
  dataSecurity: ReturnType<typeof useDataSecurity>;
  monitoring: ReturnType<typeof useSecurityMonitoring>;
  inputSecurity: ReturnType<typeof useInputSecurity>;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const auth = useAuth();
  const rateLimit = useRateLimit();
  const contentSecurity = useContentSecurity();
  const dataSecurity = useDataSecurity();
  const monitoring = useSecurityMonitoring();
  const inputSecurity = useInputSecurity();
  const { addToast } = useUIStore();

  // Global security monitoring
  useEffect(() => {
    const handleSecurityEvent = (event: Event) => {
      monitoring.logSecurityEvent('browser_security', {
        eventType: event.type,
        timestamp: new Date()
      });
    };

    // Monitor for security-related events
    const events = ['securitypolicyviolation', 'error'];
    events.forEach(eventType => {
      window.addEventListener(eventType, handleSecurityEvent);
    });

    return () => {
      events.forEach(eventType => {
        window.removeEventListener(eventType, handleSecurityEvent);
      });
    };
  }, [monitoring]);

  // Content Security Policy violation handler
  useEffect(() => {
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      monitoring.logSecurityEvent('csp_violation', {
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        timestamp: new Date()
      });

      addToast({
        type: 'error',
        title: 'Security Policy Violation',
        description: 'A security policy violation was detected and blocked.',
        duration: 5000
      });
    };

    document.addEventListener('securitypolicyviolation', handleCSPViolation);
    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, [monitoring, addToast]);

  // Global error boundary for security-related errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error?.name === 'SecurityError' || 
          event.message?.includes('security') ||
          event.message?.includes('permission')) {
        monitoring.logSecurityEvent('security_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date()
        });
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [monitoring]);

  const securityContext: SecurityContextType = {
    auth,
    rateLimit,
    contentSecurity,
    dataSecurity,
    monitoring,
    inputSecurity
  };

  return (
    <SecurityContext.Provider value={securityContext}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

// Security HOC for protecting components
export const withSecurity = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[]
) => {
  const WrappedComponent = (props: P) => {
    const { auth } = useSecurity();
    const { addToast } = useUIStore();

    useEffect(() => {
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission => 
          // In a real app, you'd check permissions here
          auth.isAuthenticated
        );

        if (!hasAllPermissions) {
          addToast({
            type: 'error',
            title: 'Access Denied',
            description: 'You do not have permission to access this feature.',
            duration: 5000
          });
        }
      }
    }, [auth.isAuthenticated, addToast]);

    if (!auth.isAuthenticated) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600">
              Please log in to access this feature.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
  
  return WrappedComponent;
};

// Security boundary component for error handling
export class SecurityErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log security-related errors
    if (error.name === 'SecurityError' || 
        error.message?.includes('security') ||
        error.message?.includes('permission')) {
      console.error('Security Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Security Error
            </h3>
            <p className="text-gray-600">
              A security error occurred. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}