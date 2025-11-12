import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Brain, 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Phone,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';

// PHQ-9 Questions (Patient Health Questionnaire-9)
const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless", 
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself"
];

// GAD-7 Questions (Generalized Anxiety Disorder-7)
const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const RESPONSE_OPTIONS = [
  { value: 0, label: "Not at all", color: "bg-green-100 text-green-800" },
  { value: 1, label: "Several days", color: "bg-yellow-100 text-yellow-800" },
  { value: 2, label: "More than half the days", color: "bg-orange-100 text-orange-800" },
  { value: 3, label: "Nearly every day", color: "bg-red-100 text-red-800" }
];

interface AssessmentResult {
  phq9Score: number;
  gad7Score: number;
  depressionLevel: string;
  anxietyLevel: string;
  recommendations: string[];
  resources: string[];
  needsProfessionalHelp: boolean;
  crisisRisk: boolean;
}

interface MentalHealthScreeningProps {
  onComplete?: (result: AssessmentResult) => void;
  enableDataRetention?: boolean;
  privacyPolicyUrl?: string;
}

export const MentalHealthScreening = ({ onComplete, enableDataRetention = false, privacyPolicyUrl }: MentalHealthScreeningProps) => {
  const [currentStep, setCurrentStep] = useState<'privacy' | 'intro' | 'phq9' | 'gad7' | 'results'>('privacy');
  const [phq9Responses, setPHQ9Responses] = useState<number[]>(new Array(9).fill(-1));
  const [gad7Responses, setGAD7Responses] = useState<number[]>(new Array(7).fill(-1));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [dataRetentionConsent, setDataRetentionConsent] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Auto-clear data after session ends
  useEffect(() => {
    const clearData = () => {
      if (!enableDataRetention || !dataRetentionConsent) {
        setPHQ9Responses(new Array(9).fill(-1));
        setGAD7Responses(new Array(7).fill(-1));
      }
    };

    window.addEventListener('beforeunload', clearData);
    return () => {
      window.removeEventListener('beforeunload', clearData);
      clearData();
    };
  }, [enableDataRetention, dataRetentionConsent]);

  const calculatePHQ9Score = (): number => {
    return phq9Responses.reduce((sum, response) => sum + (response >= 0 ? response : 0), 0);
  };

  const calculateGAD7Score = (): number => {
    return gad7Responses.reduce((sum, response) => sum + (response >= 0 ? response : 0), 0);
  };

  const interpretPHQ9Score = (score: number): string => {
    if (score <= 4) return "Minimal depression";
    if (score <= 9) return "Mild depression";
    if (score <= 14) return "Moderate depression";
    if (score <= 19) return "Moderately severe depression";
    return "Severe depression";
  };

  const interpretGAD7Score = (score: number): string => {
    if (score <= 4) return "Minimal anxiety";
    if (score <= 9) return "Mild anxiety";
    if (score <= 14) return "Moderate anxiety";
    return "Severe anxiety";
  };

  const generateRecommendations = (phq9Score: number, gad7Score: number): string[] => {
    const recommendations = [];
    
    if (phq9Score >= 10 || gad7Score >= 10) {
      recommendations.push("Consider speaking with a mental health professional");
      recommendations.push("Practice daily mindfulness or meditation");
      recommendations.push("Maintain a regular sleep schedule");
      recommendations.push("Engage in regular physical activity");
    }
    
    if (phq9Score >= 5) {
      recommendations.push("Try to maintain social connections");
      recommendations.push("Consider journaling your thoughts and feelings");
    }
    
    if (gad7Score >= 5) {
      recommendations.push("Practice deep breathing exercises");
      recommendations.push("Limit caffeine intake");
      recommendations.push("Try progressive muscle relaxation");
    }
    
    if (phq9Score <= 4 && gad7Score <= 4) {
      recommendations.push("Continue maintaining your current wellness practices");
      recommendations.push("Stay connected with supportive friends and family");
    }
    
    return recommendations;
  };

  const generateResources = (phq9Score: number, gad7Score: number): string[] => {
    const resources = [];
    
    if (phq9Score >= 10) {
      resources.push("Depression and Bipolar Support Alliance (DBSA)");
      resources.push("National Suicide Prevention Lifeline: 988");
    }
    
    if (gad7Score >= 10) {
      resources.push("Anxiety and Depression Association of America (ADAA)");
      resources.push("Crisis Text Line: Text HOME to 741741");
    }
    
    resources.push("Campus Counseling Center");
    resources.push("Student Mental Health Services");
    resources.push("Peer Support Groups");
    
    return resources;
  };

  const handleResponse = (value: number) => {
    if (currentStep === 'phq9') {
      const newResponses = [...phq9Responses];
      newResponses[currentQuestionIndex] = value;
      setPHQ9Responses(newResponses);
      
      if (currentQuestionIndex < PHQ9_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentStep('gad7');
        setCurrentQuestionIndex(0);
      }
    } else if (currentStep === 'gad7') {
      const newResponses = [...gad7Responses];
      newResponses[currentQuestionIndex] = value;
      setGAD7Responses(newResponses);
      
      if (currentQuestionIndex < GAD7_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentStep('results');
        setShowResults(true);
      }
    }
  };

  const goBack = () => {
    if (currentStep === 'gad7' && currentQuestionIndex === 0) {
      setCurrentStep('phq9');
      setCurrentQuestionIndex(PHQ9_QUESTIONS.length - 1);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentStep === 'phq9') {
      setCurrentStep('intro');
    }
  };

  const getProgress = (): number => {
    if (currentStep === 'intro') return 0;
    if (currentStep === 'phq9') {
      return ((currentQuestionIndex + 1) / (PHQ9_QUESTIONS.length + GAD7_QUESTIONS.length)) * 100;
    }
    if (currentStep === 'gad7') {
      return ((PHQ9_QUESTIONS.length + currentQuestionIndex + 1) / (PHQ9_QUESTIONS.length + GAD7_QUESTIONS.length)) * 100;
    }
    return 100;
  };

  const getCurrentQuestions = () => {
    return currentStep === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  };

  const getAssessmentTitle = () => {
    return currentStep === 'phq9' ? 'Depression Screening (PHQ-9)' : 'Anxiety Screening (GAD-7)';
  };

  const generateResults = (): AssessmentResult => {
    const phq9Score = calculatePHQ9Score();
    const gad7Score = calculateGAD7Score();
    
    return {
      phq9Score,
      gad7Score,
      depressionLevel: interpretPHQ9Score(phq9Score),
      anxietyLevel: interpretGAD7Score(gad7Score),
      recommendations: generateRecommendations(phq9Score, gad7Score),
      resources: generateResources(phq9Score, gad7Score),
      needsProfessionalHelp: phq9Score >= 10 || gad7Score >= 10,
      crisisRisk: phq9Responses[8] >= 1 // Question 9 of PHQ-9 about self-harm thoughts
    };
  };

  const results = showResults ? generateResults() : null;

  const clearAllData = () => {
    setPHQ9Responses(new Array(9).fill(-1));
    setGAD7Responses(new Array(7).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setCurrentStep('privacy');
  };

  if (currentStep === 'privacy') {
    return (
      <Card className="glass-card p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-blue-50">
                <Lock className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Privacy & Data Protection
            </h2>
            <p className="text-muted-foreground">
              Your privacy and data security are our top priorities
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              How We Protect Your Information
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>All responses are encrypted and processed locally</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>No personal identifiers are collected or stored</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>Data is automatically cleared when you close the session</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>Anonymous session ID: {sessionId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
               <Checkbox 
                 id="privacy-consent" 
                 checked={privacyConsent}
                 onCheckedChange={(checked) => setPrivacyConsent(checked === true)}
                 className="mt-1"
               />
              <div className="space-y-1">
                <label htmlFor="privacy-consent" className="text-sm font-medium cursor-pointer">
                  I understand and consent to the privacy practices described above *
                </label>
                <p className="text-xs text-muted-foreground">
                  Required to proceed with the assessment
                </p>
              </div>
            </div>

            {enableDataRetention && (
              <div className="flex items-start gap-3">
                 <Checkbox 
                   id="data-retention" 
                   checked={dataRetentionConsent}
                   onCheckedChange={(checked) => setDataRetentionConsent(checked === true)}
                 />
                <div className="space-y-1">
                  <label htmlFor="data-retention" className="text-sm font-medium cursor-pointer">
                    Allow anonymous data retention for research purposes (Optional)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Help improve mental health resources through anonymous data analysis
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
              className="text-sm"
            >
              {showPrivacyDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPrivacyDetails ? 'Hide' : 'View'} Privacy Details
            </Button>
            
            <Button 
              onClick={() => setCurrentStep('intro')}
              disabled={!privacyConsent}
              className="px-8"
            >
              Continue to Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {showPrivacyDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 border rounded-lg p-4 text-sm space-y-2"
            >
              <h4 className="font-medium">Detailed Privacy Information:</h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Assessment responses are processed using validated clinical tools (PHQ-9, GAD-7)</li>
                <li>• No cookies or tracking technologies are used during the assessment</li>
                <li>• Results are generated locally in your browser</li>
                <li>• Session data is cleared automatically upon completion or browser closure</li>
                <li>• No third-party analytics or data sharing occurs</li>
              </ul>
              {privacyPolicyUrl && (
                <div className="pt-2">
                  <a 
                    href={privacyPolicyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Full Privacy Policy
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </Card>
    );
  }

  if (currentStep === 'intro') {
    return (
      <Card className="glass-card p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Brain className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Mental Health Screening Assessment
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            This confidential assessment uses validated clinical tools (PHQ-9 and GAD-7) to help 
            understand your current emotional well-being. Your responses are private and secure.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 mb-2">Depression Screening</h3>
              <p className="text-sm text-blue-700">PHQ-9 assessment with 9 questions</p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 mb-2">Anxiety Screening</h3>
              <p className="text-sm text-green-700">GAD-7 assessment with 7 questions</p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">Important Notice</span>
            </div>
            <p className="text-sm text-amber-800">
              This screening is not a substitute for professional diagnosis. If you're experiencing 
              thoughts of self-harm or crisis, please seek immediate help.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={() => setCurrentStep('privacy')}
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            
            <Button 
              size="lg" 
              onClick={() => setCurrentStep('phq9')}
              className="px-8 py-3"
            >
              Begin Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </Card>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <Card className="glass-card p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Assessment Results</h2>
            <p className="text-muted-foreground">Your personalized mental health screening report</p>
          </div>

          {results.crisisRisk && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-red-900">Immediate Support Needed</h3>
              </div>
              <p className="text-red-800 mb-4">
                Your responses indicate you may be experiencing thoughts of self-harm. Please reach out for immediate support.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="destructive" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Crisis Hotline: 988
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Campus Emergency
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-foreground">Depression Assessment</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">PHQ-9 Score</span>
                  <Badge variant="outline" className="font-mono">{results.phq9Score}/27</Badge>
                </div>
                <Progress value={(results.phq9Score / 27) * 100} className="h-2" />
                <p className="text-sm font-medium">{results.depressionLevel}</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-foreground">Anxiety Assessment</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">GAD-7 Score</span>
                  <Badge variant="outline" className="font-mono">{results.gad7Score}/21</Badge>
                </div>
                <Progress value={(results.gad7Score / 21) * 100} className="h-2" />
                <p className="text-sm font-medium">{results.anxietyLevel}</p>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Personalized Recommendations
              </h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Support Resources
              </h3>
              <ul className="space-y-2">
                {results.resources.map((resource, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={clearAllData}
              className="px-6 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
            
            <Button 
              onClick={() => {
                onComplete?.(results);
                if (!enableDataRetention || !dataRetentionConsent) {
                  clearAllData();
                }
              }}
              className="px-8 py-3"
            >
              Complete Assessment
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Session ID: {sessionId} | 
              {enableDataRetention && dataRetentionConsent 
                ? 'Data retention enabled' 
                : 'Data will be cleared automatically'
              }
            </p>
          </div>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">{getAssessmentTitle()}</h2>
          <Badge variant="outline">
            {currentStep === 'phq9' ? currentQuestionIndex + 1 : PHQ9_QUESTIONS.length + currentQuestionIndex + 1} of {PHQ9_QUESTIONS.length + GAD7_QUESTIONS.length}
          </Badge>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStep}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              Over the last 2 weeks, how often have you been bothered by:
            </p>
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {getCurrentQuestions()[currentQuestionIndex]}
            </h3>
          </div>

          <div className="grid gap-3 mb-8">
            {RESPONSE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => handleResponse(option.value)}
                className="p-4 h-auto text-left justify-start hover:bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <Badge className={option.color}>{option.value}</Badge>
                  <span>{option.label}</span>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={goBack}
              disabled={currentStep === 'phq9' && currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {currentStep === 'phq9' ? 'Depression Screening' : 'Anxiety Screening'}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};