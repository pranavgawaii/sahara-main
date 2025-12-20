import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Shield,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Heart,
  Users,
  Sparkles
} from 'lucide-react';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useStore } from '@/stores/useStore';
import LiquidButton from '@/components/enhanced/LiquidButton';
import { pageVariants, staggerContainer, cardVariants, floatingVariants } from '@/utils/animations';

interface ConsentStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

const CONSENT_STEPS: ConsentStep[] = [
  {
    id: 'data_processing',
    title: 'Anonymous Data Processing',
    description: 'We process your conversations anonymously to provide personalized mental health support. No personally identifiable information is stored.',
    required: true
  },
  {
    id: 'anonymous_chat',
    title: 'Anonymous Chat Sessions',
    description: 'Chat sessions are encrypted and anonymous. You will be assigned a temporary handle that changes each session.',
    required: true
  },
  {
    id: 'counselor_contact',
    title: 'Optional Counselor Contact',
    description: 'You may choose to connect with counselors. Identity reveal is always optional and requires separate consent.',
    required: false
  }
];

const OnboardingFlow = () => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { setStudent, completeOnboarding } = useStore();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(0);
  const [consent, setConsent] = useState<Record<string, boolean>>({});

  // Check if user is already authenticated through Clerk
  useEffect(() => {
    if (isSignedIn && user) {
      console.log("OnboardingFlow: User already authenticated through Clerk");
      // For Clerk users, we still want to show the onboarding/assessment flow
      // but we can pre-fill some data if needed
    }
  }, [isSignedIn, user]);
  const totalSteps = 2; // Consent + Welcome to Chat

  // Check if all required consent is given
  const hasRequiredConsent = CONSENT_STEPS
    .filter(step => step.required)
    .every(step => consent[step.id]);

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsent(prev => ({ ...prev, [id]: checked }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    // For Clerk-authenticated users, preserve their existing data
    if (isSignedIn && user) {
      console.log("OnboardingFlow: Completing onboarding for Clerk user");
      // Just complete onboarding without creating new student data
      completeOnboarding();
      navigate("/dashboard");
      return;
    }

    // For anonymous users, create student profile as before
    const studentToken = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ephemeralHandle = `Guest-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    setStudent({
      token: studentToken,
      institutionCode: "default",
      ephemeralHandle,
      language: "en",
      consentFlags: {
        dataProcessing: consent.data_processing || false,
        anonymousChat: consent.anonymous_chat || false,
        counselorContact: consent.counselor_contact || false
      },
      createdAt: new Date()
    });

    completeOnboarding();
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return hasRequiredConsent;
      default: return true;
    }
  };

  const renderConsentStep = () => (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      {/* Floating background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        variants={floatingVariants}
        animate="animate"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: i * 1.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="text-center mb-12 relative z-10"
        variants={staggerContainer}
        animate="animate"
      >
        <motion.div
          className="relative inline-block mb-6"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <Shield className="w-16 h-16 text-primary mx-auto" />
          <motion.div
            className="absolute inset-0 w-16 h-16 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        </motion.div>

        <motion.h2
          className="text-3xl font-playfair font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Privacy & Consent
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          We prioritize your privacy and anonymity. Please review and consent to the following:
        </motion.p>
      </motion.div>

      <motion.div
        className="space-y-6 relative z-10"
        variants={staggerContainer}
        animate="animate"
      >
        {CONSENT_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            variants={cardVariants}
            whileHover="hover"
          >
            <Card className="glass-card p-8 border-2 border-white/10 hover:border-primary/30 transition-all duration-500">
              <div className="flex items-start space-x-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Checkbox
                    id={step.id}
                    checked={consent[step.id] || false}
                    onCheckedChange={(checked) => handleConsentChange(step.id, checked as boolean)}
                    className="w-6 h-6 border-2 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />

                  {/* Ripple effect when checked */}
                  {consent[step.id] && (
                    <motion.div
                      className="absolute inset-0 rounded border-2 border-primary"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        ease: 'easeOut',
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.div>

                <div className="flex-1">
                  <Label
                    htmlFor={step.id}
                    className="font-semibold text-lg text-foreground cursor-pointer hover:text-primary transition-colors duration-300 flex items-center gap-2"
                  >
                    {step.title}
                    {step.required && (
                      <motion.span
                        className="text-destructive"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        *
                      </motion.span>
                    )}
                    {consent[step.id] && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <CheckCircle className="w-5 h-5 text-success" />
                      </motion.div>
                    )}
                  </Label>

                  <motion.p
                    className="text-muted-foreground mt-2 leading-relaxed"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  const renderWelcomeStep = () => (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 text-center"
    >
      <motion.div
        className="relative inline-block mb-8"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <MessageCircle className="w-24 h-24 text-primary mx-auto" />
        <motion.div
          className="absolute inset-0 w-24 h-24 rounded-full bg-primary/20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </motion.div>

      <motion.h2
        className="text-4xl font-playfair font-semibold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to Your Mental Health Companion
      </motion.h2>

      <motion.div
        className="max-w-3xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xl text-muted-foreground leading-relaxed">
          I'm here to listen, understand, and help you navigate your mental health journey.
          Through our conversation, I'll identify what's on your mind and provide personalized
          support and resources.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <motion.div
            className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Heart className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Empathetic Listening</h3>
            <p className="text-sm text-muted-foreground text-center">
              Share your thoughts and feelings in a safe, judgment-free space
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Sparkles className="w-12 h-12 text-accent mb-4" />
            <h3 className="font-semibold text-lg mb-2">Personalized Support</h3>
            <p className="text-sm text-muted-foreground text-center">
              Receive tailored suggestions and resources based on your unique needs
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Professional Connection</h3>
            <p className="text-sm text-muted-foreground text-center">
              Connect with counselors when you're ready for additional support
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-playfair font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Sahara
            </h1>
            <p className="text-xl text-muted-foreground">
              Your Anonymous Mental Health Companion
            </p>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-center items-center space-x-4 mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <motion.div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-muted'
                    }`}
                  animate={{
                    scale: i === currentStep ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: i === currentStep ? Infinity : 0,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div className="mb-12">
            {currentStep === 0 && renderConsentStep()}
            {currentStep === 1 && renderWelcomeStep()}
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={handleBack}
              className="px-8 py-3 rounded-full border-2 hover:bg-muted/50 transition-all duration-300"
            >
              Back
            </Button>

            <div className="flex-1" />

            {currentStep < totalSteps - 1 ? (
              <LiquidButton
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-3 rounded-full"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </LiquidButton>
            ) : (
              <LiquidButton
                onClick={handleComplete}
                className="px-8 py-3 rounded-full"
              >
                Start Chatting
                <MessageCircle className="w-5 h-5 ml-2" />
              </LiquidButton>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;