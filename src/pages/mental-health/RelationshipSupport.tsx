import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
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
  Lightbulb,
  HeartHandshake,
  UserPlus
} from 'lucide-react';

interface RelationshipResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'exercise' | 'guide';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  category: 'communication' | 'trust' | 'intimacy' | 'conflict' | 'boundaries';
}

const RELATIONSHIP_RESOURCES: RelationshipResource[] = [
  {
    id: 'healthy-communication',
    title: 'Building Healthy Communication in Relationships',
    description: 'Learn effective communication techniques to strengthen your romantic relationships.',
    type: 'guide',
    duration: '30 min read',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'communication'
  },
  {
    id: 'trust-building',
    title: 'Rebuilding Trust After Betrayal',
    description: 'Professional guidance on healing and rebuilding trust in damaged relationships.',
    type: 'video',
    duration: '45 min',
    difficulty: 'advanced',
    rating: 4.8,
    category: 'trust'
  },
  {
    id: 'emotional-intimacy',
    title: 'Developing Emotional Intimacy',
    description: 'Strategies for creating deeper emotional connections with your partner.',
    type: 'article',
    duration: '20 min read',
    difficulty: 'intermediate',
    rating: 4.7,
    category: 'intimacy'
  },
  {
    id: 'conflict-resolution',
    title: 'Healthy Conflict Resolution',
    description: 'Learn to navigate disagreements constructively without damaging your relationship.',
    type: 'exercise',
    duration: '25 min',
    difficulty: 'intermediate',
    rating: 4.8,
    category: 'conflict'
  },
  {
    id: 'relationship-boundaries',
    title: 'Setting Healthy Relationship Boundaries',
    description: 'Understanding and establishing boundaries that protect and strengthen relationships.',
    type: 'guide',
    duration: '22 min read',
    difficulty: 'beginner',
    rating: 4.6,
    category: 'boundaries'
  },
  {
    id: 'long-distance',
    title: 'Maintaining Long-Distance Relationships',
    description: 'Practical strategies for keeping love alive across the miles.',
    type: 'video',
    duration: '35 min',
    difficulty: 'intermediate',
    rating: 4.5,
    category: 'communication'
  }
];

const RELATIONSHIP_EXERCISES = [
  {
    id: 'daily-check-in',
    title: 'Daily Emotional Check-In',
    description: 'A simple practice to maintain emotional connection with your partner.',
    duration: '10 min',
    steps: ['Set aside uninterrupted time', 'Share your emotional state', 'Listen without judgment', 'Express appreciation']
  },
  {
    id: 'gratitude-practice',
    title: 'Relationship Gratitude Practice',
    description: 'Build positivity and appreciation in your relationship through gratitude.',
    duration: '15 min',
    steps: ['Write three things you appreciate', 'Share with your partner', 'Listen to their gratitude', 'Reflect together']
  },
  {
    id: 'conflict-pause',
    title: 'The Conflict Pause Technique',
    description: 'Learn to pause and reset during heated arguments to prevent damage.',
    duration: '5 min',
    steps: ['Recognize escalation signs', 'Call for a pause', 'Take deep breaths', 'Return when calm']
  },
  {
    id: 'love-languages',
    title: 'Love Languages Discovery',
    description: 'Discover and practice each others love languages for better connection.',
    duration: '30 min',
    steps: ['Take love languages quiz', 'Share results with partner', 'Plan specific actions', 'Practice regularly']
  }
];

const RelationshipSupport = () => {
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
      case 'trust': return 'bg-purple-100 text-purple-800';
      case 'intimacy': return 'bg-pink-100 text-pink-800';
      case 'conflict': return 'bg-red-100 text-red-800';
      case 'boundaries': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
                <HeartHandshake className="w-8 h-8 text-pink-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Relationship Guidance Center</h1>
                  <p className="text-gray-600">Professional support for healthy, fulfilling relationships</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">92%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">500+</div>
                  <div className="text-sm text-gray-600">Couples Helped</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <UserCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">30+</div>
                  <div className="text-sm text-gray-600">Relationship Experts</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
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
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="ai-counselor">AI Relationship Coach</TabsTrigger>
                <TabsTrigger value="professional">Professional Help</TabsTrigger>
                <TabsTrigger value="community">Support Groups</TabsTrigger>
              </TabsList>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {RELATIONSHIP_RESOURCES.map((resource, index) => {
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
                              <div className="p-2 bg-pink-100 rounded-lg">
                                <IconComponent className="w-5 h-5 text-pink-600" />
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

              {/* Relationship Exercises Tab */}
              <TabsContent value="exercises" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {RELATIONSHIP_EXERCISES.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Heart className="w-6 h-6 text-pink-600" />
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
                                <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
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

              {/* AI Relationship Coach Tab */}
              <TabsContent value="ai-counselor" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <HeartHandshake className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Relationship Coach</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Get personalized guidance for your relationship challenges. Our AI coach provides 
                      evidence-based strategies for communication, intimacy, and building stronger romantic connections.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-pink-50 rounded-lg">
                        <MessageCircle className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Communication</h4>
                        <p className="text-sm text-gray-600">Improve dialogue skills</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Intimacy Building</h4>
                        <p className="text-sm text-gray-600">Deepen emotional bonds</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Conflict Resolution</h4>
                        <p className="text-sm text-gray-600">Healthy disagreements</p>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      onClick={() => navigate('/chat?category=relationship')}
                    >
                      Start Relationship Coaching
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Professional Help Tab */}
              <TabsContent value="professional" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <UserCheck className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Relationship Counseling</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Connect with licensed relationship therapists and counselors who specialize in couples therapy, 
                      communication skills, and relationship healing.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Couples Therapy</h4>
                        <p className="text-sm text-gray-600">Joint counseling sessions</p>
                      </div>
                      <div className="p-4 bg-pink-50 rounded-lg">
                        <UserPlus className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Individual Sessions</h4>
                        <p className="text-sm text-gray-600">Personal relationship coaching</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Crisis Support</h4>
                        <p className="text-sm text-gray-600">24/7 relationship helpline</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button 
                        variant="outline" 
                        className="h-12"
                        onClick={() => navigate('/booking?type=relationship')}
                      >
                        Book Consultation
                      </Button>
                      <Button className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Relationship Support Community</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Join supportive communities where individuals and couples share experiences, challenges, and growth. 
                      Connect with others on similar relationship journeys.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 bg-pink-50 rounded-lg">
                        <Heart className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Couples Support Groups</h4>
                        <p className="text-sm text-gray-600 mb-4">Connect with other couples working on their relationships</p>
                        <Button variant="outline" className="w-full">
                          Join Couples Groups
                        </Button>
                      </div>
                      <div className="p-6 bg-purple-50 rounded-lg">
                        <UserPlus className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Singles Support Forums</h4>
                        <p className="text-sm text-gray-600 mb-4">Support for those navigating dating and relationships</p>
                        <Button variant="outline" className="w-full">
                          Join Singles Forums
                        </Button>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
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

export default RelationshipSupport;