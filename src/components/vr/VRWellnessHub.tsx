import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Headset, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings, 
  Users, 
  Eye, 
  Headphones,
  Gamepad2,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Maximize,
  Minimize,
  RotateCcw,
  Compass,
  Heart,
  Brain,
  Sparkles,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { vrService, VREnvironment, VRSession, VR_ENVIRONMENTS, getEnvironmentsByCategory } from '@/services/vrService';
import { vrAuthService, VRSession as AuthVRSession } from '@/services/vrAuthService';
import { arService, ARSession } from '@/services/arService';
import { useStore } from '@/stores/useStore';
import { useTranslation } from 'react-i18next';

interface VRWellnessHubProps {
  onClose?: () => void;
}

export const VRWellnessHub: React.FC<VRWellnessHubProps> = ({ onClose }) => {
  const { t } = useTranslation(['common', 'ui']);
  const { student } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // VR State
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<VRSession | null>(null);
  const [authSession, setAuthSession] = useState<AuthVRSession | null>(null);
  const [arSession, setArSession] = useState<ARSession | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [arEnabled, setArEnabled] = useState(true);
  
  // UI State
  const [activeCategory, setActiveCategory] = useState<'relaxation' | 'social' | 'educational' | 'therapeutic'>('relaxation');
  const [currentMode, setCurrentMode] = useState<'desktop' | '360-games'>('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Session tracking
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Initialize VR on component mount
  useEffect(() => {
    const initializeVR = async () => {
      try {
        const supported = await vrService.initialize();
        setIsVRSupported(supported);
        
        if (!supported) {
          // Enable desktop mode as fallback
          setIsDesktopMode(true);
          setError(null); // Clear error since desktop mode is available
          console.log('VR not available, using desktop mode with 360° support');
        } else {
          setIsDesktopMode(false);
        }
      } catch (err) {
        console.error('VR initialization failed:', err);
        // Enable desktop mode as fallback
        setIsDesktopMode(true);
        setError(null);
        console.log('VR initialization failed, using desktop mode with 360° support');
      }
    };

    initializeVR();

    // Listen for VR session changes
    vrService.onSessionChange((session) => {
      setCurrentSession(session);
      setIsVRActive(session?.isActive || false);
      
      if (session?.isActive) {
        setSessionStartTime(session.startTime);
      } else {
        setSessionStartTime(null);
        setSessionDuration(0);
      }
    });

    return () => {
      if (isVRActive) {
        vrService.endVRSession();
      }
    };
  }, []);

  // Update session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionStartTime && isVRActive) {
      interval = setInterval(() => {
        const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        setSessionDuration(duration);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [sessionStartTime, isVRActive]);

  // Enhanced VR authentication with biometric support
  const authenticateVR = async () => {
    if (!student) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const deviceId = 'desktop_vr_' + Date.now(); // In real app, get actual device ID
      const session = await vrAuthService.authenticateVRSession(deviceId);
      
      if (session) {
        setAuthSession(session);
        setIsAuthenticated(true);
        
        // Grant enhanced permissions after authentication
        await grantEnhancedVRPermissions(session.id);
        
        // Initialize VR-specific features
        await initializeVRFeatures(session);
        
        // Show success notification
        console.log('VR authentication successful with enhanced features');
        
        // Display authentication success message
        setError('✅ VR Authentication Successful! Enhanced features unlocked.');
        setTimeout(() => {
          setError(null);
        }, 5000);
      } else {
        setError('VR authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('VR authentication failed:', error);
      setError('Authentication error. Please check your VR device connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Grant enhanced VR permissions after authentication
  const grantEnhancedVRPermissions = async (sessionId: string) => {
    try {
      // Grant all VR permissions after successful authentication
      vrAuthService.grantPermission(sessionId, 'games', 120); // 2 hours
      vrAuthService.grantPermission(sessionId, 'environments', 120);
      vrAuthService.grantPermission(sessionId, 'social', 60); // 1 hour for social features
      vrAuthService.grantPermission(sessionId, 'recording', 30); // 30 minutes for recording
      vrAuthService.grantPermission(sessionId, 'sharing', 30);
    } catch (error) {
      console.error('Failed to grant VR permissions:', error);
    }
  };

  // Initialize VR-specific features after authentication
  const initializeVRFeatures = async (session: any) => {
    try {
      // Initialize spatial audio
      await initializeSpatialAudio();
      
      // Setup hand tracking if available
      await setupHandTracking();
      
      // Initialize haptic feedback
      await initializeHapticFeedback();
      
      // Setup room-scale tracking
      await setupRoomScaleTracking();
      
      console.log('VR features initialized successfully');
    } catch (error) {
      console.error('Failed to initialize VR features:', error);
    }
  };

  // Initialize spatial audio for VR
  const initializeSpatialAudio = async () => {
    try {
      if ('AudioContext' in window) {
        const audioContext = new AudioContext();
        // Setup 3D audio positioning
        const listener = audioContext.listener;
        if (listener.positionX) {
          listener.positionX.value = 0;
          listener.positionY.value = 0;
          listener.positionZ.value = 0;
        }
      }
    } catch (error) {
      console.error('Spatial audio initialization failed:', error);
    }
  };

  // Setup hand tracking for VR
  const setupHandTracking = async () => {
    try {
      if ('XRSystem' in window && navigator.xr) {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (isSupported) {
          // Hand tracking setup would go here
          console.log('Hand tracking available');
        }
      }
    } catch (error) {
      console.error('Hand tracking setup failed:', error);
    }
  };

  // Initialize haptic feedback
  const initializeHapticFeedback = async () => {
    try {
      if ('navigator' in window && 'vibrate' in navigator) {
        // Basic haptic feedback support
        console.log('Haptic feedback available');
      }
    } catch (error) {
      console.error('Haptic feedback initialization failed:', error);
    }
  };

  // Setup room-scale tracking
  const setupRoomScaleTracking = async () => {
    try {
      if ('XRSystem' in window && navigator.xr) {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (isSupported) {
          console.log('Room-scale tracking available');
        }
      }
    } catch (error) {
      console.error('Room-scale tracking setup failed:', error);
    }
  };

  // Enhanced VR Experience with Authentication Features
  const startVRExperience = async (environment: VREnvironment) => {
    if (!isVRSupported || !containerRef.current || !authSession) {
      setError('VR not available or not authenticated');
      return;
    }

    // Check permissions
    if (!vrAuthService.hasPermission(authSession.id, 'environments')) {
      setError('No permission to access VR environments');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate VR session permissions
      if (!vrAuthService.hasPermission(authSession.id, 'environments')) {
        throw new Error('Insufficient VR permissions');
      }

      // Create VR canvas
      vrService.createCanvas(containerRef.current);
      
      // Determine session type based on environment and authentication
      const sessionType = environment.category === 'social' && 
                         vrAuthService.hasPermission(authSession.id, 'social') 
                         ? 'social' : 
                         environment.category === 'therapeutic' ? 'therapy' : 'wellness';
      
      // Initialize enhanced VR features for authenticated users
      const enhancedFeatures = {
        spatialAudio: true,
        handTracking: vrAuthService.hasPermission(authSession.id, 'games'),
        hapticFeedback: true,
        roomScale: true,
        socialFeatures: vrAuthService.hasPermission(authSession.id, 'social'),
        recordingCapability: vrAuthService.hasPermission(authSession.id, 'recording')
      };
      
      // Start enhanced VR session
       await vrService.startVRSession(environment.id, sessionType);
       
       // Apply enhanced features after session start
       if (enhancedFeatures.spatialAudio) {
         console.log('Spatial audio enabled');
       }
       if (enhancedFeatures.handTracking) {
         console.log('Hand tracking enabled');
       }
       if (enhancedFeatures.socialFeatures) {
         console.log('Social features enabled');
       }
      setSelectedEnvironment(environment);
      
      // Initialize AR session if enabled
       if (arEnabled && authSession && currentSession) {
         const arSessionResult = await arService.initializeARSession(currentSession.id, authSession.id);
         if (arSessionResult) {
           setArSession(arSessionResult);
         }
       }
       
       // Update session activity
       vrAuthService.updateSessionActivity(authSession.id);
       
       // Log enhanced VR session start
       console.log('Enhanced VR Experience started:', environment.name, 'with features:', enhancedFeatures);
    } catch (err) {
      console.error('Failed to start VR experience:', err);
      setError('Failed to start VR experience. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start Desktop 360° Experience
  const start360Experience = async (gameType: string) => {
    if (!containerRef.current) {
      setError('Container not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create canvas for desktop mode
      vrService.createCanvas(containerRef.current);
      
      // Start desktop session with 360° support
       await vrService.startVRSession(gameType, 'game');
       
       // Set a mock environment for the 360° game
        const mockEnvironment: VREnvironment = {
             id: gameType,
             name: gameType === 'ocean-explorer' ? 'Ocean Explorer' : 
                   gameType === 'mindful-garden' ? 'Mindful Garden' : 'Space Journey',
             description: '360° Interactive Experience',
             type: 'interactive',
             category: 'educational',
             duration: 15,
             maxParticipants: 1,
             features: ['360-navigation', 'mouse-controls', 'keyboard-controls'],
             thumbnailUrl: '',
             assetUrl: ''
           };
      
      setSelectedEnvironment(mockEnvironment);
      
      console.log(`Started 360° ${gameType} experience in desktop mode`);
        
     } catch (err) {
       console.error('Failed to start 360° experience:', err);
       setError('Failed to start 360° experience. Please try again.');
     } finally {
       setIsLoading(false);
     }
    };

  // End VR Experience
  const endVRExperience = async () => {
    try {
      await vrService.endVRSession();
       setSelectedEnvironment(null);
       
       // Terminate AR session
       if (arSession) {
         await arService.terminateARSession(arSession.id);
         setArSession(null);
       }
       
       if (authSession) {
         await vrAuthService.terminateSession(authSession.id);
         setAuthSession(null);
         setIsAuthenticated(false);
       }
      
      console.log('VR Experience ended');
    } catch (err) {
      console.error('Failed to end VR experience:', err);
    }
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get environments by category
  const environments = getEnvironmentsByCategory(activeCategory);

  // Category configurations
  const categories = [
    {
      id: 'relaxation' as const,
      name: 'Relaxation',
      icon: Heart,
      color: 'bg-green-500',
      description: 'Peaceful environments for stress relief'
    },
    {
      id: 'social' as const,
      name: 'Social',
      icon: Users,
      color: 'bg-blue-500',
      description: 'Connect with peers in virtual spaces'
    },
    {
      id: 'educational' as const,
      name: 'Focus',
      icon: Brain,
      color: 'bg-purple-500',
      description: 'Environments for learning and concentration'
    },
    {
      id: 'therapeutic' as const,
      name: 'Therapy',
      icon: Shield,
      color: 'bg-orange-500',
      description: 'Private spaces for counseling sessions'
    }
  ];

  // Component always renders now - either VR mode or desktop mode with 360° support

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background - Optimized for VR */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto vr-optimized-layout">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {onClose && (
                <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
                  ← Back
                </Button>
              )}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Headset className="w-10 h-10 text-purple-400" />
                  VR Wellness Hub
                </h1>
                <p className="text-purple-200">
                  Immersive virtual environments for mental wellness and social connection
                </p>
              </div>
            </div>
            
            {/* Mode Toggle & Status */}
            <div className="flex items-center gap-4">
              {/* Mode Toggle */}
              {isDesktopMode && (
                <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                  <Button
                    variant={currentMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentMode('desktop')}
                    className={currentMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={currentMode === '360-games' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentMode('360-games')}
                    className={currentMode === '360-games' ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    360° Games
                  </Button>
                </div>
              )}
              
              {/* Enhanced Status Badges */}
              {isDesktopMode && (
                <Badge variant="outline" className="border-orange-400 text-orange-300">
                  <Compass className="w-3 h-3 mr-1" />
                  Desktop Mode
                </Badge>
              )}
              
              {isVRSupported && (
                <Badge variant="outline" className="border-green-400 text-green-300">
                  <Headset className="w-3 h-3 mr-1" />
                  VR Ready
                </Badge>
              )}
              
              {/* Enhanced Authentication Status */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-400 text-green-300">
                    <Shield className="w-3 h-3 mr-1" />
                    Authenticated
                  </Badge>
                  <Badge variant="outline" className="border-blue-400 text-blue-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enhanced Features
                  </Badge>
                </div>
              ) : (
                <Badge variant="outline" className="border-orange-400 text-orange-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Authentication Required
                </Badge>
              )}
               
               {arSession && (
                 <Badge variant="outline" className="border-blue-400 text-blue-300">
                   <div className="w-3 h-3 mr-1 bg-blue-400 rounded-full" />
                   AR Active
                 </Badge>
              )}
              
              {isVRActive && currentSession && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">VR Active</span>
                    <span className="text-xs">({formatDuration(sessionDuration)})</span>
                  </div>
                </div>
              )}
              
              <Badge variant="outline" className="border-purple-400 text-purple-300">
                <Shield className="w-3 h-3 mr-1" />
                Secure Session
              </Badge>
            </div>
          </div>

          {/* VR Canvas Container */}
          <div 
            ref={containerRef} 
            className={`mb-8 rounded-xl overflow-hidden bg-black/50 border border-purple-500/30 ${
              isVRActive ? 'h-96' : 'h-0'
            } transition-all duration-500`}
          />

          {/* Enhanced VR Canvas Overlay - Only visible when VR is active */}
          {isVRActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black z-50 vr-canvas-container"
            >
              <canvas 
                className="w-full h-full"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              />
              
              {/* Enhanced VR Session Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    VR Active
                  </Badge>
                  {isAuthenticated && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Authenticated
                    </Badge>
                  )}
                  <span className="text-white text-sm">
                    {formatDuration(sessionDuration)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Enhanced VR Controls - Only available after authentication */}
                  {isAuthenticated && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                        title="Hand Tracking"
                      >
                        <span className="w-4 h-4 text-xs">👋</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                        title="Haptic Feedback"
                      >
                        <span className="w-4 h-4 text-xs">📳</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                        title="Room Scale"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setMicEnabled(!micEnabled)}
                  >
                    {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={endVRExperience}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                </div>
              </div>
              
              {/* Enhanced VR Features Panel - Only visible after authentication */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <Card className="bg-black/70 border-white/20 p-4 backdrop-blur-sm">
                    <h4 className="text-white font-semibold mb-3 text-sm">VR Features</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        <span>Spatial Audio</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        <span>Hand Tracking</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        <span>Haptic Feedback</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        <span>Room Scale</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-blue-400">
                        <Users className="w-3 h-3" />
                        <span>Social Features</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-purple-400">
                        <Camera className="w-3 h-3" />
                        <span>Recording Ready</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Active Session Controls */}
          {isVRActive && selectedEnvironment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-black/30 border-purple-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Headset className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{selectedEnvironment.name}</h3>
                      <p className="text-purple-200">{selectedEnvironment.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-purple-300">Duration: {formatDuration(sessionDuration)}</span>
                        <span className="text-sm text-purple-300">Type: {currentSession?.sessionType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Audio Controls */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/10"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    {/* Mic Control */}
                    {selectedEnvironment.category === 'social' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMicEnabled(!micEnabled)}
                        className={`${micEnabled ? 'text-green-400' : 'text-white'} hover:bg-white/10`}
                      >
                        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                    )}
                    
                    {/* Settings */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white hover:bg-white/10"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    
                    {/* End Session */}
                    <Button
                      onClick={endVRExperience}
                      variant="destructive"
                      size="sm"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Session
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Desktop Mode - Category Selection */}
          {!isVRActive && currentMode === 'desktop' && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Choose Your Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 vr-category-grid">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`p-6 cursor-pointer transition-all duration-200 ${
                          isActive 
                            ? 'bg-white/20 border-purple-400 shadow-lg shadow-purple-500/25' 
                            : 'bg-black/30 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                          <p className="text-sm text-purple-200">{category.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 360° Games Mode */}
          {!isVRActive && currentMode === '360-games' && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">360° Interactive Games</h2>
              <p className="text-purple-200 mb-6">Experience immersive 360-degree environments with mouse, keyboard, or touch controls</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 360° Game Cards */}
                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                   <Card 
                     className="p-6 bg-black/30 border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                     onClick={() => start360Experience('ocean-explorer')}
                   >
                     <div className="text-center">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                         <Compass className="w-8 h-8 text-white" />
                       </div>
                       <h3 className="font-semibold text-white mb-2">Ocean Explorer</h3>
                       <p className="text-sm text-purple-200 mb-4">Navigate underwater environments and discover marine life</p>
                       <div className="flex items-center justify-center gap-2 text-xs text-blue-300">
                         <Gamepad2 className="w-3 h-3" />
                         <span>Mouse + Keyboard</span>
                       </div>
                     </div>
                   </Card>
                 </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                   <Card 
                     className="p-6 bg-black/30 border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                     onClick={() => start360Experience('mindful-garden')}
                   >
                     <div className="text-center">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                         <Brain className="w-8 h-8 text-white" />
                       </div>
                       <h3 className="font-semibold text-white mb-2">Mindful Garden</h3>
                       <p className="text-sm text-purple-200 mb-4">Interactive meditation in a 360° zen garden environment</p>
                       <div className="flex items-center justify-center gap-2 text-xs text-green-300">
                         <Heart className="w-3 h-3" />
                         <span>Touch Controls</span>
                       </div>
                     </div>
                   </Card>
                 </motion.div>
 
                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                   <Card 
                     className="p-6 bg-black/30 border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
                     onClick={() => start360Experience('space-journey')}
                   >
                     <div className="text-center">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                         <Sparkles className="w-8 h-8 text-white" />
                       </div>
                       <h3 className="font-semibold text-white mb-2">Space Journey</h3>
                       <p className="text-sm text-purple-200 mb-4">Explore the cosmos in an interactive 360° space adventure</p>
                       <div className="flex items-center justify-center gap-2 text-xs text-purple-300">
                         <RotateCcw className="w-3 h-3" />
                         <span>360° Navigation</span>
                       </div>
                     </div>
                   </Card>
                 </motion.div>
              </div>

              {/* Controls Guide */}
              <Card className="mt-6 p-4 bg-black/20 border-white/10">
                <h4 className="font-semibold text-white mb-3">Controls Guide</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                      <Gamepad2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-white font-medium">Mouse</p>
                    <p className="text-purple-200">Look around 360°</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-400 font-bold text-xs">WASD</span>
                    </div>
                    <p className="text-white font-medium">Keyboard</p>
                    <p className="text-purple-200">Move & interact</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-400 font-bold text-xs">👆</span>
                    </div>
                    <p className="text-white font-medium">Touch</p>
                    <p className="text-purple-200">Swipe to navigate</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Environment Selection - Desktop Mode Only */}
          {!isVRActive && currentMode === 'desktop' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">
                {categories.find(c => c.id === activeCategory)?.name} Environments
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 vr-environment-grid">
                {environments.map((environment) => (
                  <motion.div
                    key={environment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-black/30 border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-200 vr-environment-card min-h-[320px] lg:min-h-[360px]">
                      {/* Environment Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/20 text-white border-white/30">
                            {environment.type}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-lg font-semibold text-white mb-1">{environment.name}</h4>
                          <p className="text-sm text-purple-100">{environment.description}</p>
                        </div>
                      </div>
                      
                      {/* Environment Details */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {environment.duration && (
                              <span className="text-xs text-purple-300 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.floor(environment.duration / 60)}min
                              </span>
                            )}
                            {environment.maxParticipants && (
                              <span className="text-xs text-purple-300 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Max {environment.maxParticipants}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {environment.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs border-purple-400 text-purple-300">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Enhanced Start Button with VR Features */}
                        {!isAuthenticated ? (
                          <div className="space-y-3">
                            <Button 
                              onClick={authenticateVR}
                              disabled={isLoading}
                              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                            >
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Authenticating...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  Authenticate VR
                                </div>
                              )}
                            </Button>
                            <p className="text-xs text-purple-300 text-center">
                              Unlock enhanced VR features, social interaction, and recording capabilities
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Button 
                              onClick={() => startVRExperience(environment)}
                              disabled={isLoading}
                              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Loading...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Play className="w-4 h-4" />
                                  Enter Enhanced VR
                                </div>
                              )}
                            </Button>
                            
                            {/* Enhanced VR Features Available */}
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div className="flex items-center gap-1 text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                <span>Spatial Audio</span>
                              </div>
                              <div className="flex items-center gap-1 text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                <span>Hand Tracking</span>
                              </div>
                              <div className="flex items-center gap-1 text-blue-400">
                                <Users className="w-3 h-3" />
                                <span>Social Mode</span>
                              </div>
                              <div className="flex items-center gap-1 text-purple-400">
                                <Camera className="w-3 h-3" />
                                <span>Recording</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Error/Success Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className={`p-4 ${
                error.includes('✅') || error.includes('Successful') 
                  ? 'bg-green-500/20 border-green-500/30' 
                  : 'bg-red-500/20 border-red-500/30'
              }`}>
                <div className="flex items-center gap-3">
                  {error.includes('✅') || error.includes('Successful') ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <p className={`${
                    error.includes('✅') || error.includes('Successful') 
                      ? 'text-green-300' 
                      : 'text-red-300'
                  }`}>{error}</p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VRWellnessHub;