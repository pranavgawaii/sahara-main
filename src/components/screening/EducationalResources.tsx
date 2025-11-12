import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Heart, 
  Brain, 
  Shield, 
  Users, 
  Phone, 
  ExternalLink,
  Play,
  Download,
  Clock,
  Target,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

interface EducationalResourcesProps {
  depressionLevel: string;
  anxietyLevel: string;
  phq9Score: number;
  gad7Score: number;
}

const DEPRESSION_RESOURCES = {
  "Minimal depression": {
    articles: [
      {
        title: "Understanding Mental Wellness",
        description: "Learn about maintaining good mental health and recognizing early warning signs.",
        readTime: "5 min",
        category: "Prevention"
      },
      {
        title: "Building Resilience in Daily Life",
        description: "Practical strategies for developing emotional resilience and coping skills.",
        readTime: "7 min",
        category: "Wellness"
      }
    ],
    strategies: [
      "Maintain regular sleep schedule (7-9 hours)",
      "Practice gratitude journaling",
      "Stay physically active",
      "Connect with supportive friends and family",
      "Engage in hobbies you enjoy"
    ]
  },
  "Mild depression": {
    articles: [
      {
        title: "Understanding Mild Depression",
        description: "Learn about the symptoms and effective management strategies for mild depression.",
        readTime: "8 min",
        category: "Education"
      },
      {
        title: "Cognitive Behavioral Techniques",
        description: "Introduction to CBT techniques you can practice on your own.",
        readTime: "12 min",
        category: "Self-Help"
      }
    ],
    strategies: [
      "Practice mindfulness meditation daily",
      "Challenge negative thought patterns",
      "Establish daily routines",
      "Limit alcohol and caffeine",
      "Consider talking to a counselor"
    ]
  },
  "Moderate depression": {
    articles: [
      {
        title: "Managing Moderate Depression",
        description: "Comprehensive guide to understanding and managing moderate depression symptoms.",
        readTime: "15 min",
        category: "Treatment"
      },
      {
        title: "When to Seek Professional Help",
        description: "Understanding when self-help isn't enough and professional support is needed.",
        readTime: "10 min",
        category: "Professional Help"
      }
    ],
    strategies: [
      "Schedule regular therapy sessions",
      "Consider medication consultation",
      "Join a support group",
      "Practice structured problem-solving",
      "Maintain social connections"
    ]
  },
  "Moderately severe depression": {
    articles: [
      {
        title: "Comprehensive Depression Treatment",
        description: "Understanding treatment options for moderately severe depression.",
        readTime: "20 min",
        category: "Treatment"
      },
      {
        title: "Building Your Support Network",
        description: "How to create and maintain a strong support system during recovery.",
        readTime: "12 min",
        category: "Support"
      }
    ],
    strategies: [
      "Work with a mental health professional",
      "Consider intensive therapy programs",
      "Medication management with psychiatrist",
      "Family therapy or support",
      "Crisis safety planning"
    ]
  },
  "Severe depression": {
    articles: [
      {
        title: "Severe Depression: Treatment and Recovery",
        description: "Comprehensive information about treating severe depression and the path to recovery.",
        readTime: "25 min",
        category: "Treatment"
      },
      {
        title: "Crisis Management and Safety",
        description: "Essential information about managing crisis situations and staying safe.",
        readTime: "15 min",
        category: "Crisis"
      }
    ],
    strategies: [
      "Immediate professional intervention",
      "Intensive outpatient or inpatient treatment",
      "Medication management",
      "24/7 crisis support access",
      "Family involvement in treatment"
    ]
  }
};

const ANXIETY_RESOURCES = {
  "Minimal anxiety": {
    articles: [
      {
        title: "Understanding Normal Anxiety",
        description: "Learn the difference between normal stress and anxiety disorders.",
        readTime: "6 min",
        category: "Education"
      },
      {
        title: "Stress Management Techniques",
        description: "Practical tools for managing everyday stress and anxiety.",
        readTime: "8 min",
        category: "Prevention"
      }
    ],
    strategies: [
      "Practice deep breathing exercises",
      "Regular physical exercise",
      "Limit caffeine intake",
      "Maintain work-life balance",
      "Practice relaxation techniques"
    ]
  },
  "Mild anxiety": {
    articles: [
      {
        title: "Managing Mild Anxiety",
        description: "Effective strategies for managing mild anxiety symptoms.",
        readTime: "10 min",
        category: "Self-Help"
      },
      {
        title: "Mindfulness for Anxiety",
        description: "How mindfulness practices can help reduce anxiety symptoms.",
        readTime: "12 min",
        category: "Mindfulness"
      }
    ],
    strategies: [
      "Progressive muscle relaxation",
      "Mindfulness meditation",
      "Cognitive restructuring",
      "Regular sleep schedule",
      "Gradual exposure to fears"
    ]
  },
  "Moderate anxiety": {
    articles: [
      {
        title: "Moderate Anxiety Treatment Options",
        description: "Understanding various treatment approaches for moderate anxiety.",
        readTime: "15 min",
        category: "Treatment"
      },
      {
        title: "Anxiety and Academic Performance",
        description: "Managing anxiety in academic settings and improving performance.",
        readTime: "12 min",
        category: "Academic"
      }
    ],
    strategies: [
      "Cognitive behavioral therapy",
      "Anxiety management groups",
      "Medication consultation",
      "Stress reduction techniques",
      "Professional counseling"
    ]
  },
  "Severe anxiety": {
    articles: [
      {
        title: "Severe Anxiety: Comprehensive Treatment",
        description: "Understanding intensive treatment options for severe anxiety disorders.",
        readTime: "20 min",
        category: "Treatment"
      },
      {
        title: "Panic Disorder Management",
        description: "Specific strategies for managing panic attacks and severe anxiety symptoms.",
        readTime: "18 min",
        category: "Crisis"
      }
    ],
    strategies: [
      "Intensive therapy programs",
      "Medication management",
      "Exposure and response prevention",
      "Crisis intervention planning",
      "Family therapy and support"
    ]
  }
};

const CRISIS_RESOURCES = [
  {
    name: "National Suicide Prevention Lifeline",
    number: "988",
    description: "24/7 crisis support and suicide prevention",
    type: "Emergency"
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "24/7 text-based crisis support",
    type: "Text"
  },
  {
    name: "Campus Counseling Center",
    number: "Contact your institution",
    description: "On-campus mental health services",
    type: "Campus"
  },
  {
    name: "Emergency Services",
    number: "911",
    description: "For immediate medical emergencies",
    type: "Emergency"
  }
];

const SELF_CARE_ACTIVITIES = [
  {
    category: "Physical Wellness",
    icon: Heart,
    activities: [
      { name: "10-minute walk", duration: "10 min", difficulty: "Easy" },
      { name: "Yoga stretches", duration: "15 min", difficulty: "Easy" },
      { name: "Deep breathing exercise", duration: "5 min", difficulty: "Easy" },
      { name: "Progressive muscle relaxation", duration: "20 min", difficulty: "Medium" }
    ]
  },
  {
    category: "Mental Wellness",
    icon: Brain,
    activities: [
      { name: "Gratitude journaling", duration: "10 min", difficulty: "Easy" },
      { name: "Mindfulness meditation", duration: "15 min", difficulty: "Medium" },
      { name: "Positive affirmations", duration: "5 min", difficulty: "Easy" },
      { name: "Cognitive restructuring", duration: "20 min", difficulty: "Hard" }
    ]
  },
  {
    category: "Social Connection",
    icon: Users,
    activities: [
      { name: "Call a friend or family member", duration: "15 min", difficulty: "Easy" },
      { name: "Join a support group", duration: "60 min", difficulty: "Medium" },
      { name: "Volunteer for a cause", duration: "120 min", difficulty: "Medium" },
      { name: "Attend social events", duration: "90 min", difficulty: "Hard" }
    ]
  },
  {
    category: "Creative Expression",
    icon: Lightbulb,
    activities: [
      { name: "Draw or sketch", duration: "20 min", difficulty: "Easy" },
      { name: "Write in a journal", duration: "15 min", difficulty: "Easy" },
      { name: "Listen to music", duration: "30 min", difficulty: "Easy" },
      { name: "Creative writing", duration: "45 min", difficulty: "Medium" }
    ]
  }
];

export const EducationalResources = ({ 
  depressionLevel, 
  anxietyLevel, 
  phq9Score, 
  gad7Score 
}: EducationalResourcesProps) => {
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const getDepressionResources = () => {
    return DEPRESSION_RESOURCES[depressionLevel as keyof typeof DEPRESSION_RESOURCES] || DEPRESSION_RESOURCES["Minimal depression"];
  };

  const getAnxietyResources = () => {
    return ANXIETY_RESOURCES[anxietyLevel as keyof typeof ANXIETY_RESOURCES] || ANXIETY_RESOURCES["Minimal anxiety"];
  };

  const toggleActivityCompletion = (activityName: string) => {
    setCompletedActivities(prev => 
      prev.includes(activityName) 
        ? prev.filter(name => name !== activityName)
        : [...prev, activityName]
    );
  };

  const isHighRisk = phq9Score >= 15 || gad7Score >= 15;

  return (
    <div className="space-y-6">
      {isHighRisk && (
        <Card className="bg-red-50 border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="font-bold text-red-900">Crisis Resources</h3>
          </div>
          <p className="text-red-800 mb-4">
            Your assessment indicates you may benefit from immediate professional support. 
            Please don't hesitate to reach out for help.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {CRISIS_RESOURCES.map((resource, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                <Phone className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">{resource.name}</p>
                  <p className="text-sm text-red-700">{resource.number}</p>
                  <p className="text-xs text-red-600">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="education" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Education
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="selfcare" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Self-Care
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                Depression Resources
              </h3>
              <div className="space-y-4">
                {getDepressionResources().articles.map((article, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{article.title}</h4>
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Anxiety Resources
              </h3>
              <div className="space-y-4">
                {getAnxietyResources().articles.map((article, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{article.title}</h4>
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Depression Management</h3>
              <ul className="space-y-3">
                {getDepressionResources().strategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Anxiety Management</h3>
              <ul className="space-y-3">
                {getAnxietyResources().strategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="selfcare" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {SELF_CARE_ACTIVITIES.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <Card key={categoryIndex} className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.activities.map((activity, activityIndex) => {
                      const isCompleted = completedActivities.includes(activity.name);
                      return (
                        <div 
                          key={activityIndex} 
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            isCompleted ? 'bg-green-50 border-green-200' : 'border-border hover:bg-accent/50'
                          }`}
                          onClick={() => toggleActivityCompletion(activity.name)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-medium ${
                              isCompleted ? 'text-green-900 line-through' : 'text-foreground'
                            }`}>
                              {activity.name}
                            </h4>
                            <CheckCircle className={`w-4 h-4 ${
                              isCompleted ? 'text-green-600' : 'text-gray-300'
                            }`} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.duration}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                activity.difficulty === 'Easy' ? 'border-green-300 text-green-700' :
                                activity.difficulty === 'Medium' ? 'border-yellow-300 text-yellow-700' :
                                'border-red-300 text-red-700'
                              }`}
                            >
                              {activity.difficulty}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Professional Help
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Campus Counseling
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Mental Health Services
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Therapy Referrals
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Peer Support
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Support Groups
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Peer Counseling
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Online Communities
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Crisis Support
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="destructive" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Crisis Line: 988
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Text: 741741
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Emergency: 911
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};