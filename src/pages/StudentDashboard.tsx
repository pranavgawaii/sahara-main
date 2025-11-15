import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  AlertCircle,
  Users,
  Phone,
  Video,
  Clock,
  MapPin,
  Star,
  Shield,
  Heart,
  ArrowLeft,
  Home,
  Brain,
  Activity,
  Target,
  BarChart3,
  Headset,
  Eye,
  Hand
} from 'lucide-react';
import { MindfulnessGames } from '@/components/games/MindfulnessGames';
import { RelaxationHub } from '@/components/music/RelaxationHub';
import { PeerEngagement } from '@/components/social/PeerEngagement';
import KhushMehtabAdda from '@/components/social/KhushMehtabAdda';
import { MentalHealthScreening } from '@/components/screening/MentalHealthScreening';
import { StatsDashboard } from '@/components/screening/StatsDashboard';
import { RecoverySuggestions } from '@/components/screening/RecoverySuggestions';
import { EducationalResources } from '@/components/screening/EducationalResources';
import { useStore } from '@/stores/useStore';
import { ChatWindow } from '@/components/communication/ChatWindow';
import { VideoCall } from '@/components/communication/VideoCall';
import { VoiceCall } from '@/components/communication/VoiceCall';
import { VRWellnessHub } from '@/components/vr/VRWellnessHub';
import ARCounsellorInteraction from '@/components/ar/ARCounsellorInteraction';
import ARButton from '@/components/ui/ar-button';

// Mock counsellor data
const COUNSELLORS = [
  {
    id: 'c1',
    name: 'Aiswarya Menon',
    designation: 'Assistant Professor',
    department: 'Psychology Department of MIT ADT',
    specializations: ['Anxiety', 'Depression', 'Academic Stress'],
    rating: 4.8,
    availableSlots: ['Today 2:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 3:00 PM'],
    contactMethods: ['chat', 'video', 'in-person'],
    location: 'SBSR-MIT ADT, Cabin 204',
    arAvatar: {
      modelUrl: '/models/counsellor-aiswarya.glb',
      textureUrl: '/textures/counsellor-aiswarya.jpg',
      animationUrls: ['/animations/greeting.glb', '/animations/listening.glb', '/animations/speaking.glb']
    }
  },
  {
    id: 'c2', 
    name: 'Akeela P',
    designation: 'HOD of Psychology Department',
    department: 'Christ University, Bangalore',
    specializations: ['Career Anxiety', 'Relationship Issues', 'Life Transitions'],
    rating: 4.9,
    availableSlots: ['Today 4:00 PM', 'Tomorrow 1:00 PM'],
    contactMethods: ['chat', 'phone', 'video'],
    location: 'Cabin no- 808- 3rd Floor',
    arAvatar: {
      modelUrl: '/models/counsellor-akeela.glb',
      textureUrl: '/textures/counsellor-akeela.jpg',
      animationUrls: ['/animations/greeting.glb', '/animations/listening.glb', '/animations/speaking.glb']
    }
  },
  {
    id: 'c3',
    name: 'Dr. Priya Sharma',
    designation: 'Mental Health Counsellor',
    department: 'Student Support Services', 
    specializations: ['Family Issues', 'Cultural Adjustment', 'Sleep Issues'],
    rating: 4.7,
    availableSlots: ['Tomorrow 9:00 AM', 'Tomorrow 2:00 PM', 'Day after 11:00 AM'],
    contactMethods: ['chat', 'video', 'in-person'],
    location: 'Mental Wellness Centre, Viman Nagar',
    arAvatar: {
      modelUrl: '/models/counsellor-priya.glb',
      textureUrl: '/textures/counsellor-priya.jpg',
      animationUrls: ['/animations/greeting.glb', '/animations/listening.glb', '/animations/speaking.glb']
    }
  }
];

const StudentDashboard = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const { student } = useStore();
  
  console.log('StudentDashboard: student data', student);
  
  const [selectedCounsellor, setSelectedCounsellor] = useState<string | null>(null);
  const [showScreening, setShowScreening] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [activeCommunication, setActiveCommunication] = useState<{
    type: 'chat' | 'video' | 'voice' | 'ar' | null;
    counselorId: string;
    counselorName: string;
  }>({ type: null, counselorId: '', counselorName: '' });

  // Check if student data is available
  if (!student) {
    console.log('StudentDashboard: No student data found, this might be a problem');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="text-red-600">Student data not found. Please try logging in again.</div>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Mental Health Support',
      description: 'Comprehensive mental health resources and guidance',
      icon: Brain,
      color: 'primary',
      action: () => navigate('/mental-health'),
      cursorType: 'default'
    },
    {
      title: 'VR Wellness Hub',
      description: 'Immersive virtual reality experiences for wellness',
      icon: Headset,
      color: 'accent',
      section: 'vr',
      cursorType: 'vr'
    },
    {
      title: 'Mindful Games',
      description: 'Interactive wellness games and challenges',
      icon: Target,
      color: 'accent',
      section: 'games',
      cursorType: 'game'
    },
    {
      title: 'Relaxation Hub', 
      description: 'Simple audio controls',
      icon: Heart,
      color: 'success',
      section: 'music',
      cursorType: 'audio'
    },
    {
      title: 'Social Hub',
      description: 'Connect with peers and join wellness challenges',
      icon: Users,
      color: 'secondary',
      section: 'social',
      cursorType: 'relaxation'
    },
    {
      title: 'Quick Chat',
      description: 'Anonymous support when you need it',
      icon: MessageCircle,
      color: 'warning',
      action: () => navigate('/chat'),
      cursorType: 'default'
    }
  ];

  const [activeSection, setActiveSection] = useState<'overview' | 'vr' | 'games' | 'music' | 'social'>('overview');
  
  console.log('StudentDashboard: activeSection =', activeSection);

  const getContactIcon = (method: string) => {
    switch (method) {
      case 'chat': return MessageCircle;
      case 'phone': return Phone;
      case 'video': return Video;
      default: return MapPin;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary border-primary/20';
      case 'secondary': return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'accent': return 'bg-accent/10 text-accent border-accent/20';
      case 'success': return 'bg-success/10 text-success border-success/20';
      case 'destructive': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleSectionClick = (action: { section?: string; action?: () => void; cursorType: string }) => {
    console.log('handleSectionClick called with:', action);
    if (action.section) {
      console.log('Setting active section to:', action.section);
      setActiveSection(action.section as any);
    } else if (action.action) {
      console.log('Calling action function');
      action.action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Live Wallpaper Background */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" aria-hidden="true" />
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-10 left-10 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-success/3 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-warning/3 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Header */}
      <header className="relative z-10 p-6" role="banner">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              {activeSection !== 'overview' && (
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {activeSection === 'overview' && `Welcome back, ${student?.ephemeralHandle}`}
                  {activeSection === 'games' && 'Mindful Games'}
                  {activeSection === 'music' && 'Audio Controls'}
                  {activeSection === 'social' && 'Peer Connect'}
                </h1>
                <p className="text-muted-foreground">
                  {activeSection === 'overview' && `Connected to ${student?.institutionCode} • Anonymous & Secure`}
                  {activeSection === 'games' && 'Interactive wellness activities for your mental health'}
                  {activeSection === 'music' && 'Simple audio management'}
                  {activeSection === 'social' && 'Connect with peers and join wellness challenges'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Anonymous Mode
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12" role="main">
        <div className="max-w-6xl mx-auto">
          
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions - Magic Bento Layout */}
              <section aria-labelledby="wellness-dashboard-heading">
                <h2 id="wellness-dashboard-heading" className="text-2xl font-semibold mb-6 text-center">Wellness Dashboard</h2>
                <div className="max-w-6xl mx-auto px-4 space-y-8">
                  {/* First row - 3 cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    {quickActions.slice(0, 3).map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <motion.div
                          key={action.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="w-full max-w-sm"
                        >
                          <Card 
                            className={`glass-card p-6 hover:scale-105 transition-all duration-200 cursor-pointer border ${getColorClass(action.color)} w-full h-48 flex flex-col justify-center`}
                            onClick={() => handleSectionClick(action)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSectionClick(action);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`${action.title}: ${action.description}`}
                            data-cursor={action.cursorType}
                          >
                            <div className="flex flex-col items-center text-center space-y-4">
                              <div className={`p-4 rounded-full ${getColorClass(action.color)}`}>
                                <IconComponent className="w-8 h-8" />
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2 text-base">{action.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Second row - 3 cards centered */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-4xl">
                      {quickActions.slice(3, 6).map((action, index) => {
                        const IconComponent = action.icon;
                        return (
                          <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index + 3) * 0.1 }}
                            className="w-full max-w-sm"
                          >
                            <Card 
                              className={`glass-card p-6 hover:scale-105 transition-all duration-200 cursor-pointer border ${getColorClass(action.color)} w-full h-48 flex flex-col justify-center`}
                              onClick={() => handleSectionClick(action)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSectionClick(action);
                                }
                              }}
                              tabIndex={0}
                              role="button"
                              aria-label={`${action.title}: ${action.description}`}
                              data-cursor={action.cursorType}
                            >
                              <div className="flex flex-col items-center text-center space-y-4">
                                <div className={`p-4 rounded-full ${getColorClass(action.color)}`}>
                                  <IconComponent className="w-8 h-8" />
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2 text-base">{action.title}</h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Mental Health Screening */}
              <section>
                {!showScreening && !showResults ? (
                  <Card className="glass-card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-blue-50">
                        <Brain className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Mental Health Assessment</h3>
                        <p className="text-muted-foreground">
                          Take a comprehensive assessment to understand your current emotional well-being
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 rounded-lg bg-blue-50">
                        <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium text-blue-900">PHQ-9 & GAD-7</p>
                        <p className="text-xs text-blue-700">Validated assessments</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50">
                        <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="font-medium text-green-900">Personalized Results</p>
                        <p className="text-xs text-green-700">Tailored recommendations</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-50">
                        <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="font-medium text-purple-900">Private & Secure</p>
                        <p className="text-xs text-purple-700">Your data is protected</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => setShowScreening(true)}
                        className="px-8 py-3"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Start Assessment
                      </Button>
                      
                      {assessmentResult && (
                        <Button
                          variant="outline"
                          onClick={() => setShowResults(true)}
                          className="px-6 py-3"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Last Results
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : showScreening ? (
                  <MentalHealthScreening
                    onComplete={(result) => {
                      setAssessmentResult(result);
                      setShowScreening(false);
                      setShowResults(true);
                    }}
                    enableDataRetention={false}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Results Header */}
                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-blue-50">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">Assessment Results</h3>
                            <p className="text-sm text-muted-foreground">
                              Completed on {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowScreening(true)}
                            size="sm"
                          >
                            Retake Assessment
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowResults(false);
                              setShowScreening(false);
                            }}
                            size="sm"
                          >
                            Back to Dashboard
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Statistics Dashboard */}
                    <StatsDashboard
                      currentAssessment={{
                        phq9Score: assessmentResult?.phq9Score || 0,
                        gad7Score: assessmentResult?.gad7Score || 0,
                        depressionLevel: assessmentResult?.depressionLevel || '',
                        anxietyLevel: assessmentResult?.anxietyLevel || ''
                      }}
                    />
                    
                    {/* Recovery Suggestions */}
                    <RecoverySuggestions
                      phq9Score={assessmentResult?.phq9Score || 0}
                      gad7Score={assessmentResult?.gad7Score || 0}
                      depressionLevel={assessmentResult?.depressionLevel || ''}
                      anxietyLevel={assessmentResult?.anxietyLevel || ''}
                    />
                    
                    {/* Educational Resources */}
                     <EducationalResources
                       phq9Score={assessmentResult?.phq9Score || 0}
                       gad7Score={assessmentResult?.gad7Score || 0}
                       depressionLevel={assessmentResult?.depressionLevel || ''}
                       anxietyLevel={assessmentResult?.anxietyLevel || ''}
                     />
                  </div>
                )}
              </section>

              {/* College Counsellor Connection */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">Connect with Your College Counsellors</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {COUNSELLORS.map((counsellor) => (
                    <Card key={counsellor.id} className="glass-card p-6 hover:shadow-lg transition-shadow">
                      {/* Counsellor Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{counsellor.name}</h4>
                          <p className="text-sm text-muted-foreground">{counsellor.designation}</p>
                          <p className="text-xs text-primary font-medium">{counsellor.department}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{counsellor.rating}</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {counsellor.specializations.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{counsellor.location}</span>
                      </div>

                      {/* Available Slots */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Next Available:</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            {counsellor.availableSlots[0]}
                          </span>
                        </div>
                      </div>

                      {/* Contact Methods */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Connect via:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {counsellor.contactMethods.includes('chat') && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => {
                                setActiveCommunication({
                                  type: 'chat',
                                  counselorId: counsellor.id,
                                  counselorName: counsellor.name
                                });
                              }}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat with {counsellor.name.split(' ')[1] || counsellor.name}
                            </Button>
                          )}
                          {counsellor.contactMethods.includes('video') && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => {
                                setActiveCommunication({
                                  type: 'video',
                                  counselorId: counsellor.id,
                                  counselorName: counsellor.name
                                });
                              }}
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Video Call
                            </Button>
                          )}
                          {counsellor.contactMethods.includes('phone') && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => {
                                setActiveCommunication({
                                  type: 'voice',
                                  counselorId: counsellor.id,
                                  counselorName: counsellor.name
                                });
                              }}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Voice Call
                            </Button>
                          )}
                          {counsellor.contactMethods.includes('in-person') && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => {
                                // Book in-person appointment
                                navigate(`/booking?counsellor=${counsellor.id}&name=${encodeURIComponent(counsellor.name)}&type=in-person`);
                              }}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Book In-Person
                            </Button>
                          )}
                          <ARButton
                             onClick={() => {
                               setActiveCommunication({
                                 type: 'ar',
                                 counselorId: counsellor.id,
                                 counselorName: counsellor.name
                               });
                             }}
                             className="w-full justify-start"
                           >
                             AR Interaction
                           </ARButton>
                        </div>
                      </div>

                      {/* Institution Verification */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            Verified College Counsellor
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Emergency Support */}
                <Card className="glass-card p-6 mt-6 border-red-200 bg-red-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-red-100">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900">Need Immediate Support?</h4>
                      <p className="text-sm text-red-700">24/7 crisis support available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => window.open('tel:988', '_self')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Crisis Hotline: 988
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => navigate('/emergency-resources')}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Emergency Resources
                    </Button>
                  </div>
                </Card>
              </section>
            </div>
          )}

          {/* VR Section */}
          {activeSection === 'vr' && (
            <div data-cursor="vr">
              <VRWellnessHub />
            </div>
          )}

          {/* Games Section */}
          {activeSection === 'games' && (
            <div data-cursor="game">
              <MindfulnessGames />
            </div>
          )}

          {/* Audio Section */}
        {activeSection === 'music' && (
          <div data-cursor="audio">
              <RelaxationHub />
            </div>
          )}

          {/* Social Section */}
          {activeSection === 'social' && (
            <div data-cursor="relaxation" className="space-y-8">
              <PeerEngagement />
              <KhushMehtabAdda />
            </div>
          )}
        </div>
      </main>

      {/* Communication Components */}
      {activeCommunication.type === 'chat' && (
        <ChatWindow
          counselorId={activeCommunication.counselorId}
          counselorName={activeCommunication.counselorName}
          onClose={() => setActiveCommunication({ type: null, counselorId: '', counselorName: '' })}
        />
      )}

      {activeCommunication.type === 'video' && (
        <VideoCall
          counselorId={activeCommunication.counselorId}
          counselorName={activeCommunication.counselorName}
          onClose={() => setActiveCommunication({ type: null, counselorId: '', counselorName: '' })}
        />
      )}

      {activeCommunication.type === 'voice' && (
        <VoiceCall
          counselorId={activeCommunication.counselorId}
          counselorName={activeCommunication.counselorName}
          onClose={() => setActiveCommunication({ type: null, counselorId: '', counselorName: '' })}
        />
      )}

      {activeCommunication.type === 'ar' && (
        <ARCounsellorInteraction
          counsellor={COUNSELLORS.find(c => c.id === activeCommunication.counselorId)!}
          isOpen={true}
          onClose={() => setActiveCommunication({ type: null, counselorId: '', counselorName: '' })}
          onSessionStart={(sessionId) => {
            console.log('AR session started:', sessionId);
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;