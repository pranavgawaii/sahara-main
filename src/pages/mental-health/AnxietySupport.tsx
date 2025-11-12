import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PeerSupportCommunity from '@/components/mental-health/PeerSupportCommunity';
import {
  Brain,
  Heart,
  Users,
  Play,
  BookOpen,
  MessageCircle,
  Headphones,
  Clock,
  Star,
  ArrowLeft,
  Shield,
  Zap,
  Video,
  Download,
  Share
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'exercise';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  url?: string;
}

const ANXIETY_RESOURCES: Resource[] = [
  {
    id: 'breathing-101',
    title: 'Deep Breathing Techniques for Anxiety',
    description: 'Learn evidence-based breathing exercises to manage anxiety symptoms in real-time.',
    type: 'exercise',
    duration: '5-10 min',
    difficulty: 'beginner',
    rating: 4.8
  },
  {
    id: 'cbt-anxiety',
    title: 'Cognitive Behavioral Therapy for Anxiety',
    description: 'Professional video series on CBT techniques specifically designed for anxiety management.',
    type: 'video',
    duration: '25 min',
    difficulty: 'intermediate',
    rating: 4.9
  },
  {
    id: 'mindfulness-anxiety',
    title: 'Mindfulness Meditation for Anxious Minds',
    description: 'Guided meditation sessions to help calm racing thoughts and reduce anxiety.',
    type: 'audio',
    duration: '15 min',
    difficulty: 'beginner',
    rating: 4.7
  },
  {
    id: 'anxiety-triggers',
    title: 'Understanding Your Anxiety Triggers',
    description: 'Comprehensive guide to identifying and managing personal anxiety triggers.',
    type: 'article',
    duration: '12 min read',
    difficulty: 'intermediate',
    rating: 4.6
  }
];

const MEDITATION_PRACTICES = [
  {
    id: 'box-breathing',
    title: '4-7-8 Breathing Technique',
    description: 'A simple yet powerful breathing pattern to reduce anxiety instantly.',
    duration: '3 min',
    steps: ['Inhale for 4 counts', 'Hold for 7 counts', 'Exhale for 8 counts', 'Repeat 4 times']
  },
  {
    id: 'body-scan',
    title: 'Progressive Muscle Relaxation',
    description: 'Release physical tension that often accompanies anxiety.',
    duration: '10 min',
    steps: ['Start with your toes', 'Tense for 5 seconds', 'Release and relax', 'Move up your body']
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding Technique',
    description: 'Use your senses to anchor yourself in the present moment.',
    duration: '5 min',
    steps: ['5 things you can see', '4 things you can touch', '3 things you can hear', '2 things you can smell', '1 thing you can taste']
  }
];

const AnxietySupport = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'exercise': return Heart;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
                <Brain className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Anxiety Support Center</h1>
                  <p className="text-gray-600">Professional resources and tools for managing anxiety</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">12+</div>
                  <div className="text-sm text-gray-600">Educational Articles</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Video className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">8+</div>
                  <div className="text-sm text-gray-600">Video Resources</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Headphones className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">15+</div>
                  <div className="text-sm text-gray-600">Audio Meditations</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">24/7</div>
                  <div className="text-sm text-gray-600">Peer Support</div>
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
                <TabsTrigger value="meditation">Meditation</TabsTrigger>
                <TabsTrigger value="ai-chat">AI Counselor</TabsTrigger>
                <TabsTrigger value="games">Therapy Games</TabsTrigger>
                <TabsTrigger value="community">Peer Support</TabsTrigger>
              </TabsList>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ANXIETY_RESOURCES.map((resource, index) => {
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
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <IconComponent className="w-5 h-5 text-blue-600" />
                              </div>
                              <Badge className={getDifficultyColor(resource.difficulty)}>
                                {resource.difficulty}
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
                            <div className="flex space-x-2">
                              <Button className="flex-1" size="sm">
                                <Play className="w-4 h-4 mr-2" />
                                Start
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Share className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Meditation Tab */}
              <TabsContent value="meditation" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MEDITATION_PRACTICES.map((practice, index) => (
                    <motion.div
                      key={practice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Heart className="w-6 h-6 text-pink-600" />
                            <Badge variant="outline">{practice.duration}</Badge>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {practice.title}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {practice.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            {practice.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-center text-sm text-gray-600">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                  {stepIndex + 1}
                                </div>
                                {step}
                              </div>
                            ))}
                          </div>
                          <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Start Practice
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* AI Chat Tab */}
              <TabsContent value="ai-chat" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Anxiety Counselor</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Connect with our specialized AI counselor trained in anxiety management techniques. 
                      Get personalized support, coping strategies, and immediate assistance whenever you need it.
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => navigate('/chat?category=anxiety')}
                    >
                      Start AI Counseling Session
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Games Tab */}
              <TabsContent value="games" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <Heart className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Therapeutic Games</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Engage with scientifically-designed games that help reduce anxiety through mindfulness, 
                      breathing exercises, and cognitive behavioral techniques.
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      Explore Therapy Games
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Community Tab */}
              <TabsContent value="community" className="space-y-6">
                <PeerSupportCommunity category="anxiety" showCreatePost={true} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnxietySupport;