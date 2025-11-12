import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Users, 
  Calendar, 
  Phone, 
  MessageCircle, 
  BookOpen, 
  Activity, 
  Sun, 
  Moon, 
  Utensils, 
  Dumbbell,
  Music,
  Palette,
  TreePine,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Star,
  ArrowRight
} from 'lucide-react';

interface RecoverySuggestionsProps {
  phq9Score: number;
  gad7Score: number;
  depressionLevel: string;
  anxietyLevel: string;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'immediate' | 'daily' | 'weekly' | 'professional';
  priority: 'high' | 'medium' | 'low';
  timeCommitment: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  evidenceBased: boolean;
}

const CRISIS_RESOURCES = [
  {
    name: "National Suicide Prevention Lifeline",
    number: "988",
    description: "24/7 crisis support",
    icon: Phone
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "24/7 text-based crisis support",
    icon: MessageCircle
  },
  {
    name: "Emergency Services",
    number: "911",
    description: "For immediate medical emergencies",
    icon: AlertTriangle
  }
];

export const RecoverySuggestions = ({ 
  phq9Score, 
  gad7Score, 
  depressionLevel, 
  anxietyLevel 
}: RecoverySuggestionsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('immediate');
  const [completedSuggestions, setCompletedSuggestions] = useState<Set<string>>(new Set());

  const isCrisisLevel = phq9Score >= 20 || gad7Score >= 15;
  const isHighRisk = phq9Score >= 15 || gad7Score >= 10;
  const isModerateRisk = phq9Score >= 10 || gad7Score >= 5;

  const toggleCompletion = (suggestionId: string) => {
    const newCompleted = new Set(completedSuggestions);
    if (newCompleted.has(suggestionId)) {
      newCompleted.delete(suggestionId);
    } else {
      newCompleted.add(suggestionId);
    }
    setCompletedSuggestions(newCompleted);
  };

  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    // Crisis-level suggestions
    if (isCrisisLevel) {
      suggestions.push(
        {
          id: 'crisis-professional',
          title: 'Seek Immediate Professional Help',
          description: 'Contact a mental health professional or crisis hotline immediately. Your scores indicate severe symptoms that require professional attention.',
          icon: Stethoscope,
          category: 'immediate',
          priority: 'high',
          timeCommitment: 'Immediate',
          difficulty: 'easy',
          evidenceBased: true
        },
        {
          id: 'crisis-safety',
          title: 'Create a Safety Plan',
          description: 'Identify warning signs, coping strategies, and people to contact during difficult moments.',
          icon: AlertTriangle,
          category: 'immediate',
          priority: 'high',
          timeCommitment: '30 minutes',
          difficulty: 'moderate',
          evidenceBased: true
        }
      );
    }

    // High-risk suggestions
    if (isHighRisk) {
      suggestions.push(
        {
          id: 'therapy-referral',
          title: 'Schedule Therapy Appointment',
          description: 'Consider cognitive behavioral therapy (CBT) or other evidence-based treatments for depression and anxiety.',
          icon: Brain,
          category: 'professional',
          priority: 'high',
          timeCommitment: '1 hour/week',
          difficulty: 'moderate',
          evidenceBased: true
        },
        {
          id: 'medication-consultation',
          title: 'Consult About Medication',
          description: 'Speak with a psychiatrist or primary care doctor about medication options that might help.',
          icon: Stethoscope,
          category: 'professional',
          priority: 'high',
          timeCommitment: '1 hour',
          difficulty: 'easy',
          evidenceBased: true
        }
      );
    }

    // Depression-specific suggestions
    if (phq9Score >= 5) {
      suggestions.push(
        {
          id: 'behavioral-activation',
          title: 'Behavioral Activation',
          description: 'Schedule pleasant activities and gradually increase engagement in meaningful activities.',
          icon: Calendar,
          category: 'daily',
          priority: 'high',
          timeCommitment: '30-60 minutes',
          difficulty: 'moderate',
          evidenceBased: true
        },
        {
          id: 'exercise-routine',
          title: 'Regular Exercise',
          description: 'Aim for 30 minutes of moderate exercise 3-5 times per week. Even a 10-minute walk can help.',
          icon: Dumbbell,
          category: 'daily',
          priority: 'medium',
          timeCommitment: '30 minutes',
          difficulty: 'moderate',
          evidenceBased: true
        },
        {
          id: 'sleep-hygiene',
          title: 'Improve Sleep Hygiene',
          description: 'Maintain consistent sleep schedule, limit screen time before bed, create a relaxing bedtime routine.',
          icon: Moon,
          category: 'daily',
          priority: 'medium',
          timeCommitment: '15 minutes',
          difficulty: 'easy',
          evidenceBased: true
        }
      );
    }

    // Anxiety-specific suggestions
    if (gad7Score >= 5) {
      suggestions.push(
        {
          id: 'breathing-exercises',
          title: 'Deep Breathing Exercises',
          description: 'Practice 4-7-8 breathing or box breathing techniques to manage anxiety symptoms.',
          icon: Activity,
          category: 'immediate',
          priority: 'high',
          timeCommitment: '5-10 minutes',
          difficulty: 'easy',
          evidenceBased: true
        },
        {
          id: 'progressive-relaxation',
          title: 'Progressive Muscle Relaxation',
          description: 'Systematically tense and relax muscle groups to reduce physical tension and anxiety.',
          icon: Heart,
          category: 'daily',
          priority: 'medium',
          timeCommitment: '15-20 minutes',
          difficulty: 'easy',
          evidenceBased: true
        },
        {
          id: 'mindfulness-meditation',
          title: 'Mindfulness Meditation',
          description: 'Practice present-moment awareness to reduce worry and rumination.',
          icon: Brain,
          category: 'daily',
          priority: 'medium',
          timeCommitment: '10-20 minutes',
          difficulty: 'moderate',
          evidenceBased: true
        }
      );
    }

    // General wellness suggestions
    suggestions.push(
      {
        id: 'social-connection',
        title: 'Connect with Others',
        description: 'Reach out to friends, family, or join support groups. Social connection is crucial for mental health.',
        icon: Users,
        category: 'weekly',
        priority: 'medium',
        timeCommitment: '1-2 hours',
        difficulty: 'moderate',
        evidenceBased: true
      },
      {
        id: 'nutrition-focus',
        title: 'Nutritious Eating',
        description: 'Focus on regular, balanced meals with omega-3 fatty acids, whole grains, and plenty of vegetables.',
        icon: Utensils,
        category: 'daily',
        priority: 'medium',
        timeCommitment: '30 minutes',
        difficulty: 'easy',
        evidenceBased: true
      },
      {
        id: 'nature-exposure',
        title: 'Spend Time in Nature',
        description: 'Regular exposure to natural environments can reduce stress and improve mood.',
        icon: TreePine,
        category: 'weekly',
        priority: 'low',
        timeCommitment: '1-2 hours',
        difficulty: 'easy',
        evidenceBased: true
      },
      {
        id: 'creative-activities',
        title: 'Engage in Creative Activities',
        description: 'Art, music, writing, or other creative pursuits can provide emotional outlet and stress relief.',
        icon: Palette,
        category: 'weekly',
        priority: 'low',
        timeCommitment: '30-60 minutes',
        difficulty: 'easy',
        evidenceBased: false
      },
      {
        id: 'journaling',
        title: 'Daily Journaling',
        description: 'Write about thoughts, feelings, and experiences to process emotions and track patterns.',
        icon: BookOpen,
        category: 'daily',
        priority: 'medium',
        timeCommitment: '10-15 minutes',
        difficulty: 'easy',
        evidenceBased: true
      }
    );

    return suggestions;
  };

  const suggestions = generateSuggestions();
  const categorizedSuggestions = {
    immediate: suggestions.filter(s => s.category === 'immediate'),
    daily: suggestions.filter(s => s.category === 'daily'),
    weekly: suggestions.filter(s => s.category === 'weekly'),
    professional: suggestions.filter(s => s.category === 'professional')
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'challenging': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Crisis Alert */}
      {isCrisisLevel && (
        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-800 mb-2">Immediate Support Needed</h3>
              <p className="text-red-700 mb-4">
                Your assessment scores indicate severe symptoms. Please consider reaching out for immediate professional support.
              </p>
              
              <div className="grid gap-3">
                {CRISIS_RESOURCES.map((resource, index) => {
                  const IconComponent = resource.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                      <IconComponent className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">{resource.name}</p>
                        <p className="text-sm text-red-600">{resource.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-800">{resource.number}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recovery Plan Overview */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Personalized Recovery Plan</h2>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Based on your assessment results, here are evidence-based strategies tailored to your current needs.
          Start with immediate actions and gradually incorporate daily and weekly practices.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-red-50">
            <p className="text-2xl font-bold text-red-600">{categorizedSuggestions.immediate.length}</p>
            <p className="text-sm text-red-700">Immediate Actions</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{categorizedSuggestions.daily.length}</p>
            <p className="text-sm text-blue-700">Daily Practices</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50">
            <p className="text-2xl font-bold text-green-600">{categorizedSuggestions.weekly.length}</p>
            <p className="text-sm text-green-700">Weekly Activities</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50">
            <p className="text-2xl font-bold text-purple-600">{categorizedSuggestions.professional.length}</p>
            <p className="text-sm text-purple-700">Professional Support</p>
          </div>
        </div>
      </Card>

      {/* Suggestions by Category */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="immediate" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Immediate
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Professional
          </TabsTrigger>
        </TabsList>

        {Object.entries(categorizedSuggestions).map(([category, suggestions]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {suggestions.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No {category} actions needed
                </h3>
                <p className="text-muted-foreground">
                  Your current assessment doesn't indicate a need for {category} interventions in this category.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {suggestions
                  .sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority as keyof typeof priorityOrder] - 
                           priorityOrder[a.priority as keyof typeof priorityOrder];
                  })
                  .map((suggestion) => {
                    const IconComponent = suggestion.icon;
                    const isCompleted = completedSuggestions.has(suggestion.id);
                    
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className={`p-6 transition-all duration-200 hover:shadow-md ${
                          isCompleted ? 'bg-green-50 border-green-200' : 'hover:border-primary/50'
                        }`}>
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${
                              isCompleted ? 'bg-green-100' : 'bg-primary/10'
                            }`}>
                              <IconComponent className={`w-6 h-6 ${
                                isCompleted ? 'text-green-600' : 'text-primary'
                              }`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className={`text-lg font-semibold ${
                                  isCompleted ? 'text-green-800 line-through' : 'text-foreground'
                                }`}>
                                  {suggestion.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge className={getPriorityColor(suggestion.priority)}>
                                    {suggestion.priority}
                                  </Badge>
                                  {suggestion.evidenceBased && (
                                    <Badge variant="outline" className="text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                      Evidence-based
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <p className={`text-muted-foreground mb-4 ${
                                isCompleted ? 'line-through' : ''
                              }`}>
                                {suggestion.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {suggestion.timeCommitment}
                                  </div>
                                  <div className={`flex items-center gap-1 ${getDifficultyColor(suggestion.difficulty)}`}>
                                    <Activity className="w-4 h-4" />
                                    {suggestion.difficulty}
                                  </div>
                                </div>
                                
                                <Button
                                  variant={isCompleted ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => toggleCompletion(suggestion.id)}
                                  className={isCompleted ? 'border-green-200 text-green-700' : ''}
                                >
                                  {isCompleted ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Completed
                                    </>
                                  ) : (
                                    <>
                                      Mark Complete
                                      <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })
                }
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Progress Tracking */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Recovery Progress
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed Suggestions</span>
            <span className="font-semibold">
              {completedSuggestions.size} / {suggestions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedSuggestions.size / suggestions.length) * 100}%` }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Keep track of your progress by marking completed suggestions. 
            Remember, recovery is a journey - celebrate small wins along the way!
          </p>
        </div>
      </Card>
    </div>
  );
};