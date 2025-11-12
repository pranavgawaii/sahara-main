import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Home,
  Heart,
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
  Lightbulb
} from 'lucide-react';

interface FamilyResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'exercise' | 'guide';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  category: 'communication' | 'conflict' | 'boundaries' | 'support';
}

const FAMILY_RESOURCES: FamilyResource[] = [
  {
    id: 'healthy-communication',
    title: 'Healthy Family Communication Patterns',
    description: 'Learn effective communication strategies to improve family relationships and reduce conflicts.',
    type: 'guide',
    duration: '25 min read',
    difficulty: 'beginner',
    rating: 4.8,
    category: 'communication'
  },
  {
    id: 'conflict-resolution',
    title: 'Family Conflict Resolution Techniques',
    description: 'Professional strategies for resolving family disputes and maintaining healthy relationships.',
    type: 'video',
    duration: '35 min',
    difficulty: 'intermediate',
    rating: 4.9,
    category: 'conflict'
  },
  {
    id: 'setting-boundaries',
    title: 'Setting Healthy Boundaries with Family',
    description: 'Learn how to establish and maintain healthy boundaries while preserving family bonds.',
    type: 'article',
    duration: '18 min read',
    difficulty: 'intermediate',
    rating: 4.7,
    category: 'boundaries'
  },
  {
    id: 'family-support-system',
    title: 'Building a Strong Family Support System',
    description: 'Strategies for creating mutual support and understanding within your family unit.',
    type: 'exercise',
    duration: '20 min',
    difficulty: 'beginner',
    rating: 4.6,
    category: 'support'
  }
];

const COMMUNICATION_EXERCISES = [
  {
    id: 'active-listening',
    title: 'Active Listening Practice',
    description: 'Develop better listening skills to understand family members perspectives.',
    duration: '10 min',
    steps: ['Give full attention', 'Avoid interrupting', 'Reflect what you heard', 'Ask clarifying questions']
  },
  {
    id: 'emotion-expression',
    title: 'Healthy Emotion Expression',
    description: 'Learn to express feelings constructively without causing hurt or conflict.',
    duration: '15 min',
    steps: ['Use "I" statements', 'Stay calm and respectful', 'Focus on specific behaviors', 'Express needs clearly']
  },
  {
    id: 'family-meetings',
    title: 'Structured Family Meetings',
    description: 'Organize productive family discussions to address issues and make decisions together.',
    duration: '30 min',
    steps: ['Set regular meeting times', 'Create agenda together', 'Establish ground rules', 'Follow up on decisions']
  }
];

const FamilySupport = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'exercise': return Heart;
      case 'guide': return Lightbulb;
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
      case 'communication': return 'bg-blue-100 text-blue-800';
      case 'conflict': return 'bg-red-100 text-red-800';
      case 'boundaries': return 'bg-purple-100 text-purple-800';
      case 'support': return 'bg-green-100 text-green-800';
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
                <Home className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Family Counseling Center</h1>
                  <p className="text-gray-600">Professional support for family relationships and communication</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Heart className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">200+</div>
                  <div className="text-sm text-gray-600">Families Helped</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <UserCheck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">25+</div>
                  <div className="text-sm text-gray-600">Expert Counselors</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Shield className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">100%</div>
                  <div className="text-sm text-gray-600">Confidential</div>
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
                <TabsTrigger value="exercises">Communication</TabsTrigger>
                <TabsTrigger value="ai-counselor">AI Family Coach</TabsTrigger>
                <TabsTrigger value="professional">Professional Help</TabsTrigger>
                <TabsTrigger value="community">Support Groups</TabsTrigger>
              </TabsList>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FAMILY_RESOURCES.map((resource, index) => {
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

              {/* Communication Exercises Tab */}
              <TabsContent value="exercises" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {COMMUNICATION_EXERCISES.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
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
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
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

              {/* AI Family Coach Tab */}
              <TabsContent value="ai-counselor" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Family Relationship Coach</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get personalized guidance for family relationship challenges. Our AI coach provides 
                      evidence-based strategies for communication, conflict resolution, and building stronger family bonds.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Communication Skills</h4>
                        <p className="text-sm text-gray-600">Improve family dialogue</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Conflict Resolution</h4>
                        <p className="text-sm text-gray-600">Peaceful problem solving</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Relationship Building</h4>
                        <p className="text-sm text-gray-600">Strengthen family bonds</p>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      onClick={() => navigate('/chat?category=family')}
                    >
                      Start Family Coaching Session
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Professional Help Tab */}
              <TabsContent value="professional" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <UserCheck className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Family Counseling</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Connect with licensed family therapists and counselors who specialize in family dynamics, 
                      communication issues, and relationship healing.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Video Sessions</h4>
                        <p className="text-sm text-gray-600">Secure online counseling</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Phone Support</h4>
                        <p className="text-sm text-gray-600">24/7 crisis helpline</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Family Sessions</h4>
                        <p className="text-sm text-gray-600">Group therapy options</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button 
                        variant="outline" 
                        className="h-12"
                        onClick={() => navigate('/booking?type=family')}
                      >
                        Book Consultation
                      </Button>
                      <Button className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Emergency Support
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Family Support Community</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Join supportive communities where families share experiences, challenges, and solutions. 
                      Connect with others who understand your journey.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 bg-blue-50 rounded-lg">
                        <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Parent Support Groups</h4>
                        <p className="text-sm text-gray-600 mb-4">Connect with other parents facing similar challenges</p>
                        <Button variant="outline" className="w-full">
                          Join Parent Groups
                        </Button>
                      </div>
                      <div className="p-6 bg-green-50 rounded-lg">
                        <Heart className="w-10 h-10 text-green-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Student Family Forums</h4>
                        <p className="text-sm text-gray-600 mb-4">Share experiences with fellow students about family life</p>
                        <Button variant="outline" className="w-full">
                          Join Student Forums
                        </Button>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
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

export default FamilySupport;