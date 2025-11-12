import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, UserCheck, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center">
              <img 
                src="/sahara-logo.svg" 
                alt="Sahara Logo" 
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Sahara</h1>
            <p className="text-gray-600">Your anonymous mental health companion</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold">Choose Your Portal</CardTitle>
                <CardDescription>
                  Select your role to access the appropriate login page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Portal Selection */}
                <div className="space-y-4">
                  {/* Student Portal */}
                  <Card 
                    className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300 group"
                    onClick={() => navigate('/student/login')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">Student Portal</h3>
                        <p className="text-sm text-gray-600">Access mental health resources, chat support, and wellness tools</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Card>

                  {/* Counselor Portal */}
                  <Card 
                    className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-300 group"
                    onClick={() => navigate('/counselor/login')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserCheck className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">Counselor Portal</h3>
                        <p className="text-sm text-gray-600">Professional dashboard for managing students and crisis interventions</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </Card>
                </div>

                {/* Back to Home */}
                <div className="text-center pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ← Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-sm text-gray-500"
          >
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </motion.div>
        </div>
      </div>
  );
};

export default LoginPage;