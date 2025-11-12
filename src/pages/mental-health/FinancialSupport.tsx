import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  MessageCircle,
  Users,
  BookOpen,
  Video,
  Phone,
  ArrowLeft,
  Clock,
  Star,
  Play,
  UserCheck,
  Shield,
  Lightbulb,
  PiggyBank,
  Calculator,
  TrendingUp,
  CreditCard,
  Wallet
} from 'lucide-react';

interface FinancialResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'exercise' | 'guide' | 'calculator';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  category: 'budgeting' | 'debt' | 'savings' | 'emergency' | 'planning';
}

const FINANCIAL_RESOURCES: FinancialResource[] = [
  {
    id: 'student-budgeting',
    title: 'Student Budgeting Essentials',
    description: 'Learn how to create and maintain a budget as a student with limited income.',
    type: 'guide',
    duration: '25 min read',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'budgeting'
  },
  {
    id: 'debt-management',
    title: 'Managing Student Loan Debt',
    description: 'Strategies for handling student loans and avoiding overwhelming debt.',
    type: 'video',
    duration: '40 min',
    difficulty: 'intermediate',
    rating: 4.8,
    category: 'debt'
  },
  {
    id: 'emergency-fund',
    title: 'Building an Emergency Fund on a Student Budget',
    description: 'How to save for emergencies even with limited financial resources.',
    type: 'article',
    duration: '15 min read',
    difficulty: 'beginner',
    rating: 4.7,
    category: 'emergency'
  },
  {
    id: 'financial-planning',
    title: 'Long-term Financial Planning for Students',
    description: 'Start planning your financial future while still in college.',
    type: 'guide',
    duration: '35 min read',
    difficulty: 'advanced',
    rating: 4.6,
    category: 'planning'
  },
  {
    id: 'saving-strategies',
    title: 'Smart Saving Strategies for Students',
    description: 'Practical ways to save money on textbooks, food, and daily expenses.',
    type: 'video',
    duration: '30 min',
    difficulty: 'beginner',
    rating: 4.8,
    category: 'savings'
  },
  {
    id: 'budget-calculator',
    title: 'Interactive Budget Calculator',
    description: 'Use our calculator to create a personalized budget plan.',
    type: 'calculator',
    duration: '10 min',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'budgeting'
  }
];

const FINANCIAL_EXERCISES = [
  {
    id: 'expense-tracking',
    title: '30-Day Expense Tracking Challenge',
    description: 'Track every expense for 30 days to understand your spending patterns.',
    duration: '30 days',
    steps: ['Download expense tracking app', 'Record every purchase', 'Categorize expenses', 'Analyze patterns weekly']
  },
  {
    id: 'budget-creation',
    title: 'Create Your First Budget',
    description: 'Step-by-step guide to creating a realistic student budget.',
    duration: '45 min',
    steps: ['Calculate total income', 'List all expenses', 'Categorize needs vs wants', 'Set savings goals']
  },
  {
    id: 'debt-snowball',
    title: 'Debt Snowball Method',
    description: 'Learn to pay off debts systematically using the snowball approach.',
    duration: '20 min',
    steps: ['List all debts smallest to largest', 'Pay minimums on all debts', 'Focus extra money on smallest debt', 'Repeat with next smallest']
  },
  {
    id: 'savings-automation',
    title: 'Automate Your Savings',
    description: 'Set up automatic transfers to build savings without thinking about it.',
    duration: '15 min',
    steps: ['Open savings account', 'Set up automatic transfer', 'Start with small amount', 'Increase gradually']
  }
];

const FINANCIAL_TOOLS = [
  {
    id: 'budget-planner',
    title: 'Monthly Budget Planner',
    description: 'Interactive tool to plan and track your monthly budget',
    icon: Calculator
  },
  {
    id: 'debt-calculator',
    title: 'Debt Payoff Calculator',
    description: 'Calculate how long it will take to pay off your debts',
    icon: CreditCard
  },
  {
    id: 'savings-goal',
    title: 'Savings Goal Tracker',
    description: 'Set and track progress toward your savings goals',
    icon: PiggyBank
  },
  {
    id: 'expense-analyzer',
    title: 'Expense Analyzer',
    description: 'Analyze your spending patterns and find areas to cut costs',
    icon: TrendingUp
  }
];

const FinancialSupport = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'exercise': return PiggyBank;
      case 'guide': return Lightbulb;
      case 'calculator': return Calculator;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'budgeting': return 'bg-blue-100 text-blue-800';
      case 'debt': return 'bg-red-100 text-red-800';
      case 'savings': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/mental-health')}
                className="mr-4 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Financial Stress Resources</h1>
                  <p className="text-gray-600">Professional guidance for managing financial challenges and building stability</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <PiggyBank className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">89%</div>
                  <div className="text-sm text-gray-600">Improved Finances</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">1000+</div>
                  <div className="text-sm text-gray-600">Students Helped</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <UserCheck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">20+</div>
                  <div className="text-sm text-gray-600">Financial Advisors</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Calculator className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">15+</div>
                  <div className="text-sm text-gray-600">Financial Tools</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="tools">Financial Tools</TabsTrigger>
                <TabsTrigger value="professional">Professional Help</TabsTrigger>
                <TabsTrigger value="community">Support Groups</TabsTrigger>
              </TabsList>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FINANCIAL_RESOURCES.map((resource, index) => {
                    const IconComponent = getResourceIcon(resource.type);
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                      >
                        <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <IconComponent className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex space-x-2">
                                <Badge className={getDifficultyColor(resource.difficulty)}>
                                  {resource.difficulty}
                                </Badge>
                                <Badge className={getCategoryColor(resource.category)}>
                                  {resource.category}
                                </Badge>
                              </div>
                            </div>
                            <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                              {resource.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-gray-600 mb-4">
                              {resource.description}
                            </CardDescription>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {resource.duration}
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {resource.rating}
                              </div>
                            </div>
                            <Button className="w-full" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Access Resource
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Financial Exercises Tab */}
              <TabsContent value="exercises" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FINANCIAL_EXERCISES.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <PiggyBank className="w-6 h-6 text-green-600" />
                            <Badge variant="outline">{exercise.duration}</Badge>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {exercise.title}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {exercise.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            <h4 className="font-medium text-gray-800">Steps:</h4>
                            {exercise.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start text-sm text-gray-600">
                                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
                                  {stepIndex + 1}
                                </div>
                                {step}
                              </div>
                            ))}
                          </div>
                          <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Start Exercise
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Financial Tools Tab */}
              <TabsContent value="tools" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FINANCIAL_TOOLS.map((tool, index) => {
                    const IconComponent = tool.icon;
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                      >
                        <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
                          <CardContent className="p-6 text-center">
                            <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                              <IconComponent className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {tool.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {tool.description}
                            </p>
                            <Button className="w-full">
                              <Calculator className="w-4 h-4 mr-2" />
                              Use Tool
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Professional Help Tab */}
              <TabsContent value="professional" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <UserCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Financial Counseling</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Connect with certified financial counselors and advisors who specialize in student financial challenges, 
                      debt management, and long-term financial planning.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">One-on-One Sessions</h4>
                        <p className="text-sm text-gray-600">Personalized financial guidance</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Budget Planning</h4>
                        <p className="text-sm text-gray-600">Custom budget creation</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Investment Guidance</h4>
                        <p className="text-sm text-gray-600">Future planning strategies</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button 
                        variant="outline" 
                        className="h-12"
                        onClick={() => navigate('/booking?type=financial')}
                      >
                        Book Consultation
                      </Button>
                      <Button className="h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        Emergency Financial Help
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Support Groups Tab */}
              <TabsContent value="community" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Financial Support Community</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Join supportive communities where students share financial experiences, money-saving tips, and strategies. 
                      Learn from peers who understand the financial challenges of student life.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 bg-green-50 rounded-lg">
                        <PiggyBank className="w-10 h-10 text-green-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Student Budgeting Groups</h4>
                        <p className="text-sm text-gray-600 mb-4">Share budgeting tips and money-saving strategies</p>
                        <Button variant="outline" className="w-full">
                          Join Budgeting Groups
                        </Button>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-lg">
                        <Wallet className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Debt Support Forums</h4>
                        <p className="text-sm text-gray-600 mb-4">Support for managing student loans and debt</p>
                        <Button variant="outline" className="w-full">
                          Join Debt Forums
                        </Button>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Explore All Communities
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSupport;