import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Brain,
  Users,
  Briefcase,
  Home,
  DollarSign,
  Shield,
  Globe,
  ArrowRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface MentalHealthCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  estimatedTime: string;
}

const MENTAL_HEALTH_CATEGORIES: MentalHealthCategory[] = [
  {
    id: 'anxiety',
    title: 'Anxiety Support',
    description: 'Comprehensive resources for managing anxiety, stress, and overwhelming feelings',
    icon: Brain,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    route: '/mental-health/anxiety',
    urgencyLevel: 'high',
    estimatedTime: '15-30 min'
  },
  {
    id: 'career',
    title: 'Career Placement Assistance',
    description: 'Guidance for career anxiety, job search stress, and professional development',
    icon: Briefcase,
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    route: '/mental-health/career',
    urgencyLevel: 'medium',
    estimatedTime: '20-45 min'
  },
  {
    id: 'family',
    title: 'Family Counseling',
    description: 'Support for family conflicts, communication issues, and relationship dynamics',
    icon: Home,
    color: 'bg-green-500/10 text-green-600 border-green-200',
    route: '/mental-health/family',
    urgencyLevel: 'medium',
    estimatedTime: '25-40 min'
  },
  {
    id: 'relationships',
    title: 'Relationship Guidance',
    description: 'Resources for romantic relationships, friendships, and social connections',
    icon: Heart,
    color: 'bg-pink-500/10 text-pink-600 border-pink-200',
    route: '/mental-health/relationships',
    urgencyLevel: 'medium',
    estimatedTime: '20-35 min'
  },
  {
    id: 'financial',
    title: 'Financial Stress Resources',
    description: 'Support for financial anxiety, budgeting stress, and economic concerns',
    icon: DollarSign,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    route: '/mental-health/financial',
    urgencyLevel: 'high',
    estimatedTime: '15-30 min'
  },
  {
    id: 'anti-ragging',
    title: 'Anti-Ragging Support',
    description: 'Immediate help and resources for bullying, harassment, and ragging incidents',
    icon: Shield,
    color: 'bg-red-500/10 text-red-600 border-red-200',
    route: '/mental-health/anti-ragging',
    urgencyLevel: 'high',
    estimatedTime: 'Immediate'
  },
  {
    id: 'interfaith',
    title: 'Interfaith Harmony Resources',
    description: 'Support for cultural diversity, religious tolerance, and community harmony',
    icon: Globe,
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    route: '/mental-health/interfaith',
    urgencyLevel: 'low',
    estimatedTime: '20-40 min'
  }
];

const MentalHealthGateway = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleQuickAccess = (value: string) => {
    if (value && value !== 'select') {
      navigate(`/mental-health/${value}`);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = MENTAL_HEALTH_CATEGORIES.find(cat => cat.id === categoryId);
    if (category) {
      navigate(category.route);
    }
  };

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mental Health Support Center
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive mental health support system. Choose from our specialized categories to access 
              professional resources, AI counseling, peer support, and therapeutic tools tailored to your needs.
            </p>
          </motion.div>

          {/* Quick Access Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">Quick Access</CardTitle>
                <CardDescription>Select your area of concern for immediate support</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  handleQuickAccess(value);
                }}>
                  <SelectTrigger className="w-full h-12 text-left">
                    <SelectValue placeholder="Choose your mental health concern..." />
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent>
                    {MENTAL_HEALTH_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <SelectItem key={category.id} value={category.id} className="py-3">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5" />
                            <div>
                              <div className="font-medium">{category.title}</div>
                              <div className="text-xs text-gray-500 truncate max-w-48">
                                {category.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <Button
                    onClick={() => handleCategorySelect(selectedCategory)}
                    className="w-full mt-4 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  >
                    Access Support Resources
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {MENTAL_HEALTH_CATEGORIES.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  onHoverStart={() => setHoveredCard(category.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-2 ${
                      hoveredCard === category.id ? 'scale-105' : ''
                    } bg-white/80 backdrop-blur-sm`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg ${category.color} mb-3`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        {getUrgencyBadge(category.urgencyLevel)}
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                        {category.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Est. Time: {category.estimatedTime}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Emergency Support Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-bold mb-1">Emergency Support Available 24/7</h3>
                      <p className="text-red-100">
                        If you're experiencing a mental health crisis or need immediate assistance, 
                        our emergency support team is here to help.
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="bg-white text-red-600 hover:bg-red-50 font-semibold px-6"
                    onClick={() => navigate('/emergency-support')}
                  >
                    Get Help Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthGateway;