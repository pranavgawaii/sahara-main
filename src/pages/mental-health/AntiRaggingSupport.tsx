import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
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
  AlertTriangle,
  Lightbulb,
  FileText,
  Eye,
  Lock,
  PhoneCall,
  UserX
} from 'lucide-react';

interface AntiRaggingResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'legal' | 'report';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  category: 'prevention' | 'reporting' | 'legal' | 'support' | 'awareness';
}

const ANTI_RAGGING_RESOURCES: AntiRaggingResource[] = [
  {
    id: 'what-is-ragging',
    title: 'Understanding Ragging: Definition and Forms',
    description: 'Comprehensive guide to identifying different forms of ragging and harassment.',
    type: 'guide',
    duration: '20 min read',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'awareness'
  },
  {
    id: 'legal-framework',
    title: 'Legal Framework Against Ragging',
    description: 'Know your legal rights and the laws that protect students from ragging.',
    type: 'legal',
    duration: '30 min read',
    difficulty: 'intermediate',
    rating: 4.8,
    category: 'legal'
  },
  {
    id: 'reporting-process',
    title: 'How to Report Ragging Incidents',
    description: 'Step-by-step guide on reporting ragging incidents safely and effectively.',
    type: 'guide',
    duration: '15 min read',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'reporting'
  },
  {
    id: 'prevention-strategies',
    title: 'Ragging Prevention Strategies',
    description: 'Learn how to protect yourself and others from ragging situations.',
    type: 'video',
    duration: '25 min',
    difficulty: 'beginner',
    rating: 4.7,
    category: 'prevention'
  },
  {
    id: 'support-systems',
    title: 'Support Systems for Ragging Victims',
    description: 'Available support systems and resources for those affected by ragging.',
    type: 'article',
    duration: '18 min read',
    difficulty: 'beginner',
    rating: 4.8,
    category: 'support'
  },
  {
    id: 'anonymous-reporting',
    title: 'Anonymous Reporting System',
    description: 'How to report ragging incidents anonymously and safely.',
    type: 'report',
    duration: '10 min',
    difficulty: 'beginner',
    rating: 4.9,
    category: 'reporting'
  }
];

const SAFETY_GUIDELINES = [
  {
    id: 'recognize-signs',
    title: 'Recognize Warning Signs',
    description: 'Learn to identify early signs of ragging and harassment.',
    steps: ['Unwanted attention from seniors', 'Forced participation in activities', 'Verbal or physical intimidation', 'Isolation from peer groups']
  },
  {
    id: 'immediate-response',
    title: 'Immediate Response Actions',
    description: 'What to do if you encounter ragging situations.',
    steps: ['Stay calm and composed', 'Document the incident', 'Seek immediate help', 'Report to authorities']
  },
  {
    id: 'prevention-tips',
    title: 'Prevention Tips',
    description: 'Proactive measures to avoid ragging situations.',
    steps: ['Travel in groups when possible', 'Avoid isolated areas', 'Build support networks', 'Know emergency contacts']
  },
  {
    id: 'support-others',
    title: 'Supporting Others',
    description: 'How to help fellow students who may be experiencing ragging.',
    steps: ['Listen without judgment', 'Encourage reporting', 'Offer emotional support', 'Connect with resources']
  }
];

const EMERGENCY_CONTACTS = [
  {
    id: 'ugc-helpline',
    title: 'UGC Anti-Ragging Helpline',
    number: '1800-180-5522',
    description: '24/7 toll-free helpline for ragging complaints',
    type: 'national'
  },
  {
    id: 'campus-security',
    title: 'Campus Security',
    number: 'Extension: 911',
    description: 'Immediate campus security assistance',
    type: 'campus'
  },
  {
    id: 'student-counselor',
    title: 'Student Counselor',
    number: 'Extension: 2345',
    description: 'Professional counseling support',
    type: 'counseling'
  },
  {
    id: 'police-helpline',
    title: 'Police Emergency',
    number: '100',
    description: 'Emergency police assistance',
    type: 'emergency'
  }
];

const AntiRaggingSupport = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'guide': return Lightbulb;
      case 'legal': return FileText;
      case 'report': return AlertTriangle;
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
      case 'prevention': return 'bg-blue-100 text-blue-800';
      case 'reporting': return 'bg-red-100 text-red-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'support': return 'bg-green-100 text-green-800';
      case 'awareness': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'campus': return 'bg-blue-100 text-blue-800';
      case 'counseling': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
                <Shield className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Anti-Ragging Support Center</h1>
                  <p className="text-gray-600">Safe, confidential support and resources to prevent and address ragging</p>
                </div>
              </div>
            </div>

            {/* Emergency Alert */}
            <Card className="bg-red-50 border-red-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800">Emergency Situation?</h3>
                    <p className="text-red-700 text-sm">If you're in immediate danger, contact campus security or call emergency services immediately.</p>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white ml-4">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Help
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Shield className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">100%</div>
                  <div className="text-sm text-gray-600">Confidential</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">15+</div>
                  <div className="text-sm text-gray-600">Support Staff</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">Safe</div>
                  <div className="text-sm text-gray-600">Environment</div>
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
                <TabsTrigger value="safety">Safety Guidelines</TabsTrigger>
                <TabsTrigger value="report">Report Incident</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                <TabsTrigger value="support">Support Services</TabsTrigger>
              </TabsList>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ANTI_RAGGING_RESOURCES.map((resource, index) => {
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
                              <div className="p-2 bg-red-100 rounded-lg">
                                <IconComponent className="w-5 h-5 text-red-600" />
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

              {/* Safety Guidelines Tab */}
              <TabsContent value="safety" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SAFETY_GUIDELINES.map((guideline, index) => (
                    <motion.div
                      key={guideline.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-center mb-2">
                            <Shield className="w-6 h-6 text-red-600 mr-3" />
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {guideline.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-gray-600">
                            {guideline.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {guideline.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start text-sm text-gray-600">
                                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
                                  {stepIndex + 1}
                                </div>
                                {step}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Report Incident Tab */}
              <TabsContent value="report" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Report Ragging Incident</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Your safety is our priority. Report any ragging incident confidentially and safely. 
                      All reports are taken seriously and investigated promptly.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 bg-red-50 rounded-lg">
                        <UserX className="w-10 h-10 text-red-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Anonymous Reporting</h4>
                        <p className="text-sm text-gray-600 mb-4">Report incidents without revealing your identity</p>
                        <Button variant="outline" className="w-full">
                          <Lock className="w-4 h-4 mr-2" />
                          Anonymous Report
                        </Button>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-lg">
                        <FileText className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-800 mb-2">Formal Complaint</h4>
                        <p className="text-sm text-gray-600 mb-4">File an official complaint with your details</p>
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          File Complaint
                        </Button>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-left">
                          <h4 className="font-semibold text-yellow-800 mb-1">Important Information</h4>
                          <p className="text-sm text-yellow-700">
                            All reports are handled with strict confidentiality. False reporting is also taken seriously. 
                            Provide accurate information to help us address the situation effectively.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    >
                      Start Reporting Process
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emergency Contacts Tab */}
              <TabsContent value="emergency" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {EMERGENCY_CONTACTS.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <PhoneCall className="w-8 h-8 text-red-600" />
                            <Badge className={getContactTypeColor(contact.type)}>
                              {contact.type}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {contact.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {contact.description}
                          </p>
                          <div className="text-2xl font-bold text-red-600 mb-4">
                            {contact.number}
                          </div>
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Support Services Tab */}
              <TabsContent value="support" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <UserCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Comprehensive Support Services</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      We provide comprehensive support services for students affected by ragging, including counseling, 
                      legal assistance, and ongoing support throughout the resolution process.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Counseling Support</h4>
                        <p className="text-sm text-gray-600">Professional psychological support</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Legal Assistance</h4>
                        <p className="text-sm text-gray-600">Legal guidance and support</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-800">Peer Support</h4>
                        <p className="text-sm text-gray-600">Connect with support groups</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button 
                        variant="outline" 
                        className="h-12"
                        onClick={() => navigate('/booking?type=anti-ragging')}
                      >
                        Book Counseling
                      </Button>
                      <Button 
                        className="h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        onClick={() => navigate('/chat?category=anti-ragging')}
                      >
                        Get Support Now
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

export default AntiRaggingSupport;