import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase,
  BookOpen,
  Video,
  Users,
  MessageCircle,
  Target,
  TrendingUp,
  FileText,
  ArrowLeft,
  Clock,
  Star,
  Play,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CareerResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'workshop' | 'assessment';
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  completionRate: number;
}

const CAREER_RESOURCES: CareerResource[] = [
  {
    id: 'resume-building',
    title: 'Professional Resume Building Guide',
    description: 'Step-by-step guide to creating a compelling resume that stands out to employers.',
    type: 'guide',
    duration: '20 min read',
    level: 'beginner',
    rating: 4.8,
    completionRate: 92
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation Masterclass',
    description: 'Comprehensive video series covering common interview questions and techniques.',
    type: 'video',
    duration: '45 min',
    level: 'intermediate',
    rating: 4.9,
    completionRate: 87
  },
  {
    id: 'career-assessment',
    title: 'Career Personality Assessment',
    description: 'Discover your career strengths and ideal job matches based on your personality.',
    type: 'assessment',
    duration: '15 min',
    level: 'beginner',
    rating: 4.7,
    completionRate: 95
  },
  {
    id: 'networking-workshop',
    title: 'Professional Networking Workshop',
    description: 'Learn effective networking strategies to build meaningful professional relationships.',
    type: 'workshop',
    duration: '60 min',
    level: 'intermediate',
    rating: 4.6,
    completionRate: 78
  }
];

const STRESS_MANAGEMENT_TIPS = [
  {
    id: 'job-search-anxiety',
    title: 'Managing Job Search Anxiety',
    description: 'Practical strategies to cope with the stress and uncertainty of job hunting.',
    techniques: ['Set realistic daily goals', 'Practice self-compassion', 'Maintain routine', 'Celebrate small wins']
  },
  {
    id: 'interview-nerves',
    title: 'Overcoming Interview Anxiety',
    description: 'Techniques to calm nerves and perform your best during interviews.',
    techniques: ['Practice mock interviews', 'Use breathing exercises', 'Prepare thoroughly', 'Visualize success']
  },
  {
    id: 'career-uncertainty',
    title: 'Dealing with Career Uncertainty',
    description: 'How to navigate unclear career paths and make confident decisions.',
    techniques: ['Explore multiple options', 'Seek mentorship', 'Focus on transferable skills', 'Take small steps']
  }
];

const CareerSupport = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'video': return Video;
      case 'workshop': return Users;
      case 'assessment': return Target;
      default: return FileText;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
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
                <Briefcase className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Career Placement Assistance</h1>
                  <p className="text-gray-600">Professional guidance for career development and job placement</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">85%</div>
                  <div className="text-sm text-gray-600">Placement Success</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">500+</div>
                  <div className="text-sm text-gray-600">Career Resources</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">50+</div>
                  <div className="text-sm text-gray-600">Industry Mentors</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">24/7</div>
                  <div className="text-sm text-gray-600">Career Support</div>
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
                <TabsTrigger value="stress-management">Stress Management</TabsTrigger>
                <TabsTrigger value="ai-counselor">AI Career Coach</TabsTrigger>
                <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                <TabsTrigger value="community">Career Community</TabsTrigger>
              </TabsList>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CAREER_RESOURCES.map((resource, index) => {
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
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <IconComponent className="w-5 h-5 text-purple-600" />
                              </div>
                              <Badge className={getLevelColor(resource.level)}>
                                {resource.level}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                              {resource.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-gray-600 mb-4">
                              {resource.description}
                            </CardDescription>
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {resource.duration}
                                </div>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                  {resource.rating}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Completion Rate</span>
                                <div className="flex items-center">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                                    <div 
                                      className="h-2 bg-green-500 rounded-full" 
                                      style={{ width: `${resource.completionRate}%` }}
                                    />
                                  </div>
                                  <span className="text-green-600 font-medium">{resource.completionRate}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button className="flex-1" size="sm">
                                <Play className="w-4 h-4 mr-2" />
                                Start
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Stress Management Tab */}
              <TabsContent value="stress-management" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {STRESS_MANAGEMENT_TIPS.map((tip, index) => (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-center mb-2">
                            <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                            <Badge variant="outline">Stress Relief</Badge>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {tip.title}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {tip.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-4">
                            <h4 className="font-medium text-gray-800">Key Techniques:</h4>
                            {tip.techniques.map((technique, techIndex) => (
                              <div key={techIndex} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {technique}
                              </div>
                            ))}
                          </div>
                          <Button className="w-full" variant="outline">
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* AI Career Coach Tab */}
              <TabsContent value="ai-counselor" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Career Coach</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get personalized career guidance from our AI coach. Receive tailored advice on job search strategies, 
                      interview preparation, career transitions, and professional development.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Career Planning</h4>
                        <p className="text-sm text-gray-600">Strategic career roadmaps</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Resume Review</h4>
                        <p className="text-sm text-gray-600">AI-powered resume optimization</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Skill Development</h4>
                        <p className="text-sm text-gray-600">Personalized learning paths</p>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => navigate('/chat?category=career')}
                    >
                      Start Career Coaching Session
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mentorship Tab */}
              <TabsContent value="mentorship" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Mentorship Program</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Connect with industry professionals and alumni who can guide your career journey. 
                      Get one-on-one mentorship, industry insights, and networking opportunities.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button variant="outline" className="h-12">
                        Find a Mentor
                      </Button>
                      <Button className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Join Program
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Community Tab */}
              <TabsContent value="community" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Career Support Community</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Join a supportive community of students and professionals. Share experiences, 
                      get advice, and build your professional network.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Discussion Forums</h4>
                        <p className="text-sm text-gray-600">Industry-specific discussions</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Study Groups</h4>
                        <p className="text-sm text-gray-600">Collaborative learning</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Success Stories</h4>
                        <p className="text-sm text-gray-600">Inspiring career journeys</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button variant="outline" className="h-12">
                        Browse Forums
                      </Button>
                      <Button className="h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        Join Community
                      </Button>
                    </div>
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

export default CareerSupport;