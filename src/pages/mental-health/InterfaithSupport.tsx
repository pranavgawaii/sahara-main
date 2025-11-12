import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
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
  Heart,
  Lightbulb,
  Handshake,
  Shield,
  TreePine,
  Compass,
  UserPlus
} from 'lucide-react';

interface InterfaithResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'exercise' | 'guide' | 'meditation';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  category: 'understanding' | 'dialogue' | 'tolerance' | 'celebration' | 'conflict';
}

const INTERFAITH_RESOURCES: InterfaithResource[] = [
  {
    id: 'understanding-diversity',
    title: 'Understanding Religious and Cultural Diversity',
    description: 'Learn about different religious traditions and cultural practices in a respectful manner.',
    type: 'guide',
    duration: '30 min read',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'understanding'
  },
  {
    id: 'interfaith-dialogue',
    title: 'Building Bridges: Interfaith Dialogue Skills',
    description: 'Develop skills for meaningful conversations across religious and cultural differences.',
    type: 'video',
    duration: '40 min',
    difficulty: 'intermediate',
    rating: 4.8,
    category: 'dialogue'
  },
  {
    id: 'tolerance-practices',
    title: 'Practicing Religious Tolerance in Daily Life',
    description: 'Practical ways to show respect and tolerance for different beliefs and practices.',
    type: 'article',
    duration: '20 min read',
    difficulty: 'beginner',
    rating: 4.7,
    category: 'tolerance'
  },
  {
    id: 'celebrating-diversity',
    title: 'Celebrating Religious and Cultural Festivals',
    description: 'Learn about various religious festivals and how to participate respectfully.',
    type: 'guide',
    duration: '25 min read',
    difficulty: 'beginner',
    rating: 4.8,
    category: 'celebration'
  },
  {
    id: 'conflict-resolution',
    title: 'Resolving Religious and Cultural Conflicts',
    description: 'Strategies for addressing misunderstandings and conflicts related to faith and culture.',
    type: 'video',
    duration: '35 min',
    difficulty: 'advanced',
    rating: 4.6,
    category: 'conflict'
  },
  {
    id: 'mindful-meditation',
    title: 'Universal Meditation Practices',
    description: 'Meditation techniques that transcend religious boundaries and promote inner peace.',
    type: 'meditation',
    duration: '15 min',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'understanding'
  }
];

const HARMONY_EXERCISES = [
  {
    id: 'cultural-exchange',
    title: 'Cultural Exchange Activity',
    description: 'Engage in meaningful cultural exchange with peers from different backgrounds.',
    duration: '60 min',
    steps: ['Find a partner from different background', 'Share your traditions respectfully', 'Listen with open mind', 'Reflect on commonalities']
  },
  {
    id: 'empathy-building',
    title: 'Empathy Building Exercise',
    description: 'Develop empathy and understanding for different religious perspectives.',
    duration: '30 min',
    steps: ['Choose unfamiliar tradition', 'Research with respect', 'Imagine their perspective', 'Reflect on similarities']
  },
  {
    id: 'dialogue-practice',
    title: 'Respectful Dialogue Practice',
    description: 'Practice having respectful conversations about sensitive topics.',
    duration: '45 min',
    steps: ['Set ground rules', 'Listen actively', 'Ask thoughtful questions', 'Find common ground']
  },
  {
    id: 'unity-meditation',
    title: 'Unity and Peace Meditation',
    description: 'Meditation focused on universal values of peace, love, and understanding.',
    duration: '20 min',
    steps: ['Find quiet space', 'Focus on breath', 'Visualize unity', 'Send loving thoughts']
  }
];

const RELIGIOUS_TRADITIONS = [
  {
    id: 'hinduism',
    name: 'Hinduism',
    description: 'Ancient tradition emphasizing dharma, karma, and spiritual liberation',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'islam',
    name: 'Islam',
    description: 'Monotheistic faith based on the Quran and teachings of Prophet Muhammad',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'christianity',
    name: 'Christianity',
    description: 'Faith centered on the life and teachings of Jesus Christ',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'sikhism',
    name: 'Sikhism',
    description: 'Religion emphasizing devotion to one God and service to humanity',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    description: 'Path to enlightenment through the Four Noble Truths and Eightfold Path',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'jainism',
    name: 'Jainism',
    description: 'Ancient religion emphasizing non-violence and spiritual purification',
    color: 'bg-red-100 text-red-800'
  }
];

const InterfaithSupport = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'exercise': return Handshake;
      case 'guide': return Lightbulb;
      case 'meditation': return TreePine;
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
      case 'understanding': return 'bg-blue-100 text-blue-800';
      case 'dialogue': return 'bg-green-100 text-green-800';
      case 'tolerance': return 'bg-purple-100 text-purple-800';
      case 'celebration': return 'bg-orange-100 text-orange-800';
      case 'conflict': return 'bg-red-100 text-red-800';
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
                <Globe className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Interfaith Harmony Resources</h1>
                  <p className="text-gray-600">Promoting understanding, respect, and unity across all faiths and cultures</p>
                </div>
              </div>
            </div>

            {/* Unity Message */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Unity in Diversity</h3>
                <p className="text-gray-600">
                  "The beauty of humanity lies in our diversity. When we embrace our differences with respect and understanding, 
                  we create a harmonious community where everyone can thrive."
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">50+</div>
                  <div className="text-sm text-gray-600">Cultures Represented</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">95%</div>
                  <div className="text-sm text-gray-600">Harmony Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Handshake className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">300+</div>
                  <div className="text-sm text-gray-600">Dialogue Sessions</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">100%</div>
                  <div className="text-sm text-gray-600">Respectful</div>
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
                <TabsTrigger value="exercises">Harmony Exercises</TabsTrigger>
                <TabsTrigger value="traditions">Learn Traditions</TabsTrigger>
                <TabsTrigger value="dialogue">Interfaith Dialogue</TabsTrigger>
                <TabsTrigger value="community">Unity Community</TabsTrigger>
              </TabsList>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {INTERFAITH_RESOURCES.map((resource, index) => {
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

              {/* Harmony Exercises Tab */}
              <TabsContent value="exercises" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {HARMONY_EXERCISES.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Handshake className="w-6 h-6 text-purple-600" />
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
                                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
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

              {/* Learn Traditions Tab */}
              <TabsContent value="traditions" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RELIGIOUS_TRADITIONS.map((tradition, index) => (
                    <motion.div
                      key={tradition.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-fit mx-auto mb-4">
                            <Compass className="w-8 h-8 text-purple-600" />
                          </div>
                          <Badge className={tradition.color + ' mb-3'}>
                            {tradition.name}
                          </Badge>
                          <p className="text-gray-600 text-sm mb-4">
                            {tradition.description}
                          </p>
                          <Button variant="outline" className="w-full">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Interfaith Dialogue Tab */}
              <TabsContent value="dialogue" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Interfaith Dialogue Platform</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Engage in meaningful conversations with people from different religious and cultural backgrounds. 
                      Our AI facilitator helps create safe, respectful dialogue spaces.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Handshake className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Respectful Exchange</h4>
                        <p className="text-sm text-gray-600">Safe space for sharing</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Diverse Perspectives</h4>
                        <p className="text-sm text-gray-600">Learn from others</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Build Understanding</h4>
                        <p className="text-sm text-gray-600">Foster empathy</p>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => navigate('/chat?category=interfaith')}
                    >
                      Start Interfaith Dialogue
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Unity Community Tab */}
              <TabsContent value="community" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Unity in Diversity Community</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Join our inclusive community where students from all backgrounds come together to celebrate diversity, 
                      share experiences, and build lasting friendships across cultural and religious boundaries.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 bg-purple-50 rounded-lg">
                        <Globe className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Cultural Exchange Groups</h4>
                        <p className="text-sm text-gray-600 mb-4">Share traditions and learn about different cultures</p>
                        <Button variant="outline" className="w-full">
                          Join Cultural Groups
                        </Button>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-lg">
                        <Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Peace Building Forums</h4>
                        <p className="text-sm text-gray-600 mb-4">Collaborate on promoting harmony and understanding</p>
                        <Button variant="outline" className="w-full">
                          Join Peace Forums
                        </Button>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Explore Unity Community
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

export default InterfaithSupport;