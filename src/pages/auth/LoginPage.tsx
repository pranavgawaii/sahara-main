import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SaharaAuthLayout from '@/components/layout/SaharaAuthLayout';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SaharaAuthLayout>
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          {/* Logo Badge */}
          <div className="flex justify-center">
            <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <div className="text-[#2E5A7D] text-[40px] font-bold">+</div>
            </div>
          </div>

          <h1 className="text-[32px] font-bold text-white font-dm">Sahara</h1>
          <p className="text-white/90 text-[16px] font-inter">Your anonymous mental health companion</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-0 bg-white/95 backdrop-blur-md rounded-[24px] overflow-hidden">
            <CardHeader className="space-y-1 text-center pt-8 pb-4">
              <CardTitle className="text-2xl font-bold text-[#2E5A7D] font-dm">Choose Your Portal</CardTitle>
              <CardDescription className="text-[#6B6B6B] font-inter text-[15px]">
                Select your role to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {/* Portal Selection */}
              <div className="space-y-4">
                {/* Student Portal */}
                <div
                  className="p-5 cursor-pointer rounded-[16px] bg-[#F8F9FA] border-2 border-transparent hover:border-[#7BA5C8] hover:bg-white hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                  onClick={() => navigate('/student/login')}
                >
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#E1EFF8] rounded-full flex items-center justify-center group-hover:bg-[#7BA5C8] transition-colors duration-300">
                        <GraduationCap className="h-6 w-6 text-[#2E5A7D] group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1A1A1A] font-dm">Student Portal</h3>
                      <p className="text-sm text-[#6B6B6B] font-inter leading-tight">Resources, chat & support</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#9EC2DC] group-hover:text-[#2E5A7D] transition-colors transform group-hover:translate-x-1 duration-300" />
                  </div>
                </div>

                {/* Counselor Portal */}
                <div
                  className="p-5 cursor-pointer rounded-[16px] bg-[#F8F9FA] border-2 border-transparent hover:border-[#9B7EDE] hover:bg-white hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                  onClick={() => navigate('/counselor/login')}
                >
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#F0EBF8] rounded-full flex items-center justify-center group-hover:bg-[#9B7EDE] transition-colors duration-300">
                        <UserCheck className="h-6 w-6 text-[#5B3E96] group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1A1A1A] font-dm">Counselor Portal</h3>
                      <p className="text-sm text-[#6B6B6B] font-inter leading-tight">Matches & tracking tools</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#9EC2DC] group-hover:text-[#5B3E96] transition-colors transform group-hover:translate-x-1 duration-300" />
                  </div>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-[#6B6B6B] hover:text-[#2E5A7D] hover:bg-transparent font-medium font-inter"
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
          className="text-center text-sm text-white/70 font-inter"
        >
          <p>By signing in, you agree to our Terms of Service</p>
        </motion.div>
      </div>
    </SaharaAuthLayout>
  );
};

export default LoginPage;