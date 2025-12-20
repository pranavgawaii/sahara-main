import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { GraduationCap, Shield, Heart, BookOpen, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect directly to Clerk sign-in page for students
    navigate('/auth/sign-in?role=student');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

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
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
            >
              <GraduationCap className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-600">Access your mental health support resources</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Welcome Back, Student
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your personalized mental health journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Student Benefits */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  What you'll get access to:
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-2" />
                    Anonymous chat support
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-2" />
                    Mental health resources
                  </li>
                  <li className="flex items-center">
                    <GraduationCap className="h-3 w-3 mr-2" />
                    Progress tracking tools
                  </li>
                </ul>
              </div>

              <Separator className="my-6" />

              {/* Google Login */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Sign in with your student Google account
                  </p>
                </div>
                
                <GoogleLoginButton 
                  userType="student"
                  variant="default"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                />
              </div>

              {/* Privacy Notice */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Your Privacy Matters</p>
                    <p className="text-xs text-gray-600 mt-1">
                      All conversations are anonymous and encrypted. Your identity is protected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Links */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 mb-2">
                  Need help? Contact student support or
                </p>
                <Link 
                  to="/counselor/login" 
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Are you a counselor? Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLoginPage;