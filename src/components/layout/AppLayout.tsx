import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MobileNavigation } from './MobileNavigation';
import { useStore } from '@/stores/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { ROUTES } from '@/constants';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const ROUTES_WITHOUT_SIDEBAR = [
  ROUTES.home,
  ROUTES.onboarding,
  ROUTES.simpleOnboarding,
  ROUTES.counsellor,
  ROUTES.notFound,
];

const ROUTES_WITHOUT_HEADER = [
  ROUTES.onboarding,
  ROUTES.simpleOnboarding,
];

const ROUTES_WITHOUT_FOOTER = [
  ROUTES.onboarding,
  ROUTES.simpleOnboarding,
  ROUTES.chat,
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { student } = useStore();
  
  const currentPath = location.pathname;
  const showSidebar = !ROUTES_WITHOUT_SIDEBAR.includes(currentPath as any) && student;
  const showHeader = !ROUTES_WITHOUT_HEADER.includes(currentPath as any);
  const showFooter = !ROUTES_WITHOUT_FOOTER.includes(currentPath as any);
  const showMobileNav = isMobile && student && !ROUTES_WITHOUT_SIDEBAR.includes(currentPath as any);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {showHeader && (
        <Header 
          className={cn(
            "sticky top-0 z-40",
            showSidebar && !isMobile && "lg:pl-64"
          )}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Sidebar - Desktop */}
        {showSidebar && !isMobile && (
          <Sidebar className="fixed left-0 top-0 z-30 h-screen w-64 border-r bg-card/50 backdrop-blur-sm" />
        )}

        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 flex flex-col min-h-0",
            showSidebar && !isMobile && "lg:pl-64",
            showHeader && "pt-0",
            showMobileNav && "pb-16"
          )}
        >
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            {children || <Outlet />}
          </div>

          {/* Footer */}
          {showFooter && !isMobile && (
            <Footer className="mt-auto" />
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      {showMobileNav && (
        <MobileNavigation className="fixed bottom-0 left-0 right-0 z-40" />
      )}
    </div>
  );
};

// Layout variants for specific use cases
export const AuthLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-soothing flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export const OnboardingLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-ambient flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export const ChatLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {children || <Outlet />}
    </div>
  );
};

export const DashboardLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {children || <Outlet />}
    </div>
  );
};

export const CenteredLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {children || <Outlet />}
      </div>
    </div>
  );
};