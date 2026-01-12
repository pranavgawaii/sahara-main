import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { GraduationCap, Shield, Heart, BookOpen, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SaharaAuthLayout from '@/components/layout/SaharaAuthLayout';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

const CounselorLoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect directly to Clerk sign-in page for students
    // NOTE: In a real app we might not redirect if we want to show this landing first, 
    // but the original code had this redirect. We'll keep the UI for now in case logic changes.
    navigate('/auth/sign-in?role=student');
  }, [navigate]);

  return (
    <SaharaAuthLayout>
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-[80px] h-[80px] bg-white rounded-full mb-4 shadow-lg"
            >
              <GraduationCap className="h-10 w-10 text-[#2E5A7D]" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white font-dm mb-2">Student Portal</h1>
            <p className="text-white/90 font-inter">Access your mental health support resources</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-0 bg-white/95 backdrop-blur-md rounded-[24px] overflow-hidden">
            <CardHeader className="text-center pb-4 pt-8">
              <CardTitle className="text-xl font-bold text-[#1A1A1A] font-dm">
                Welcome Back, Student
              </CardTitle>
              <CardDescription className="text-[#6B6B6B] font-inter">
                Sign in to access your personalized mental health journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              {/* Student Benefits */}
              <div className="bg-[#F8F9FA] p-5 rounded-[16px] border border-[#E8E8E8]">
                <h3 className="font-semibold text-[#2E5A7D] mb-3 flex items-center font-dm">
                  <Heart className="h-4 w-4 mr-2" />
                  What you'll get access to:
                </h3>
                <ul className="space-y-2 text-sm text-[#4A4A4A] font-inter">
                  <li className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-2 text-[#7BA5C8]" />
                    Anonymous chat support
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-2 text-[#7BA5C8]" />
                    Mental health resources
                  </li>
                  <li className="flex items-center">
                    <GraduationCap className="h-3 w-3 mr-2 text-[#7BA5C8]" />
                    Progress tracking tools
                  </li>
                </ul>
              </div>

              <Separator className="my-6 bg-[#E8E8E8]" />

              {/* Google Login */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-[#6B6B6B] font-inter mb-4">
                    Sign in with your student Google account
                  </p>
                </div>

                <GoogleLoginButton
                  userType="student"
                  variant="default"
                  size="lg"
                  className="w-full bg-[#2E5A7D] hover:bg-[#1A3A5A] font-dm font-medium text-white shadow-lg transition-all rounded-[12px]"
                />
              </div>

              {/* Privacy Notice */}
              <div className="bg-[#F0F7FA] p-4 rounded-[16px] border border-transparent">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-[#2E5A7D] mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#2E5A7D] font-dm">Your Privacy Matters</p>
                    <p className="text-xs text-[#4A4A4A] mt-1 font-inter leading-relaxed">
                      All conversations are anonymous and encrypted. Your identity is protected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Links */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#6B6B6B] mb-2 font-inter">
                  Need help? Contact student support or
                </p>
                <Link
                  to="/counselor/login"
                  className="text-xs text-[#2E5A7D] hover:text-[#1A3A5A] font-medium underline font-inter"
                >
                  Are you a student? Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-white/80 hover:text-white font-inter transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </SaharaAuthLayout>
  );
};

export default CounselorLoginPage;