import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioManagerProvider } from "@/components/audio/AudioManager";
import BackgroundAudio from "@/components/audio/BackgroundAudio";
import LiquidEther from "@/components/cursor/BlobCursor";
import { NotificationContainer } from "@/components/ui/notification";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SkipLinks, LiveRegion } from "@/components/ui/accessible";
import { initializePerformanceMonitoring } from "@/utils/performance";
import { useEffect } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import StudentLoginPage from "./pages/auth/StudentLoginPage";
import CounselorLoginPage from "./pages/auth/CounselorLoginPage";
import LandingPage from "./pages/LandingPage";
import OnboardingFlow from "./pages/OnboardingFlow";
import SimpleOnboarding from "./pages/SimpleOnboarding";
import StudentDashboard from "./pages/StudentDashboard";
import CounsellorLandingPage from "./pages/CounsellorLandingPage";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import ProblemInterface from "./pages/problems/ProblemInterface";
import ChatPage from "./pages/ChatPage";
import BookingPage from "./pages/BookingPage";
import ResourcesPage from "./pages/ResourcesPage";
import TrackerPage from "./pages/TrackerPage";
import UserProfile from "./pages/UserProfile";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import GoogleCallback from "./pages/auth/GoogleCallback";
import MentalHealthGateway from "./pages/MentalHealthGateway";
import AnxietySupport from "./pages/mental-health/AnxietySupport";
import CareerSupport from "./pages/mental-health/CareerSupport";
import FamilySupport from "./pages/mental-health/FamilySupport";
import RelationshipSupport from "./pages/mental-health/RelationshipSupport";
import FinancialSupport from "./pages/mental-health/FinancialSupport";
import AntiRaggingSupport from "./pages/mental-health/AntiRaggingSupport";
import InterfaithSupport from "./pages/mental-health/InterfaithSupport";
import './i18n';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize performance monitoring and analytics
    initializePerformanceMonitoring();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <TooltipProvider>
          <AudioManagerProvider>
            <BackgroundAudio />
            <SkipLinks />
            <LiveRegion />
            <LiquidEther />
             <NotificationContainer />
             <Toaster />
             <Sonner />
             <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/student/login" element={<StudentLoginPage />} />
            <Route path="/counselor/login" element={<CounselorLoginPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            
            {/* Protected Student Routes */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <OnboardingFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/simple-onboarding" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <SimpleOnboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/problems/:problemId" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProblemInterface />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ResourcesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tracker" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TrackerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MentalHealthGateway />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health/anxiety" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AnxietySupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health/career" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CareerSupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health/family" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <FamilySupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health/relationship" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <RelationshipSupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health/financial" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <FinancialSupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health/anti-ragging" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AntiRaggingSupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health/interfaith" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <InterfaithSupport />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Counselor Routes */}
            <Route 
              path="/counselor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounsellorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counsellor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounsellorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counsellor" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounsellorLandingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counsellor/sessions" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <div className="p-8"><h1 className="text-2xl font-bold">Session Management</h1><p className="text-gray-600 mt-2">Session scheduling and management interface will be implemented here.</p></div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counsellor/alerts" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <div className="p-8"><h1 className="text-2xl font-bold">Crisis Alerts</h1><p className="text-gray-600 mt-2">Crisis intervention and emergency alerts interface will be implemented here.</p></div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counsellor/resources" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <div className="p-8"><h1 className="text-2xl font-bold">Resource Library</h1><p className="text-gray-600 mt-2">Professional resources and student materials library will be implemented here.</p></div>
                </ProtectedRoute>
              } 
            />
            
            {/* Shared Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['student', 'counselor']}>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/logout" 
              element={
                <ProtectedRoute allowedRoles={['student', 'counselor']}>
                  <Logout />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
     </BrowserRouter>
           </AudioManagerProvider>
         </TooltipProvider>
       </GoogleOAuthProvider>
     </QueryClientProvider>
  );
};

export default App;
