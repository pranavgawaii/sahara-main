import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import { UserCheck, Shield, Stethoscope, Users, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CounselorLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
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
              className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4"
            >
              <UserCheck className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselor Portal</h1>
            <p className="text-gray-600">Professional mental health support platform</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Welcome, Mental Health Professional
              </CardTitle>
              <CardDescription className="text-gray-600">
                Access your counseling dashboard and student support tools
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Counselor Features */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-3 flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Professional Tools & Features:
                </h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-center">
                    <Users className="h-3 w-3 mr-2" />
                    Student management dashboard
                  </li>
                  <li className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    Session scheduling & tracking
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-2" />
                    Crisis intervention alerts
                  </li>
                </ul>
              </div>

              <Separator className="my-6" />

              {/* Google Login */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Sign in with your professional Google account
                  </p>
                </div>
                
                <GoogleLoginButton 
                  userType="counselor"
                  variant="default"
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                />
              </div>

              {/* Professional Notice */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Professional Access</p>
                    <p className="text-xs text-amber-800 mt-1">
                      This portal is restricted to licensed mental health professionals.
                      All activities are logged for compliance and security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance Notice */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">HIPAA Compliance</p>
                    <p className="text-xs text-gray-600 mt-1">
                      All patient data is encrypted and complies with HIPAA regulations.
                      Unauthorized access is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Links */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 mb-2">
                  Need professional support? Contact admin or
                </p>
                <Link 
                  to="/student/login" 
                  className="text-xs text-purple-600 hover:text-purple-800 underline"
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

export default CounselorLoginPage;