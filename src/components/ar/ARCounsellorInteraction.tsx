import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Headset,
  Eye,
  Hand,
  Mic,
  MicOff,
  Settings,
  X,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';
import { arService, ARSession, ARObject } from '@/services/arService';
import { vrService } from '@/services/vrService';
import { vrAuthService } from '@/services/vrAuthService';

interface Counsellor {
  id: string;
  name: string;
  designation: string;
  department: string;
  specializations: string[];
  rating: number;
  availableSlots: string[];
  contactMethods: string[];
  location: string;
  arAvatar?: {
    modelUrl: string;
    textureUrl: string;
    animationUrls: string[];
  };
}

interface ARCounsellorInteractionProps {
  counsellor: Counsellor;
  isOpen: boolean;
  onClose: () => void;
  onSessionStart?: (sessionId: string) => void;
}

interface ARSessionState {
  isActive: boolean;
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  trackingStatus: 'initializing' | 'tracking' | 'lost' | 'error';
  arObjects: ARObject[];
}

interface ARControls {
  isAudioEnabled: boolean;
  isMicEnabled: boolean;
  isHandTrackingEnabled: boolean;
  isEyeTrackingEnabled: boolean;
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  isFullscreen: boolean;
}

export const ARCounsellorInteraction: React.FC<ARCounsellorInteractionProps> = ({
  counsellor,
  isOpen,
  onClose,
  onSessionStart
}) => {
  const [arSession, setArSession] = useState<ARSessionState>({
    isActive: false,
    sessionId: null,
    isLoading: false,
    error: null,
    trackingStatus: 'initializing',
    arObjects: []
  });

  const [controls, setControls] = useState<ARControls>({
    isAudioEnabled: true,
    isMicEnabled: false,
    isHandTrackingEnabled: true,
    isEyeTrackingEnabled: true,
    renderQuality: 'medium',
    isFullscreen: false
  });

  const [deviceSupport, setDeviceSupport] = useState({
    hasCamera: false,
    hasWebXR: false,
    hasWebGL: false,
    isARSupported: false
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arContainerRef = useRef<HTMLDivElement>(null);

  // Check device AR capabilities
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        // Check WebXR support
        const hasWebXR = 'xr' in navigator && 'isSessionSupported' in navigator.xr;
        
        // Check camera access
        const hasCamera = await navigator.mediaDevices.getUserMedia({ video: true })
          .then(() => true)
          .catch(() => false);

        // Check WebGL support
        const canvas = document.createElement('canvas');
        const hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

        const isARSupported = hasWebXR || (hasCamera && hasWebGL);

        setDeviceSupport({
          hasCamera,
          hasWebXR,
          hasWebGL,
          isARSupported
        });
      } catch (error) {
        console.error('Error checking AR support:', error);
        setDeviceSupport({
          hasCamera: false,
          hasWebXR: false,
          hasWebGL: false,
          isARSupported: false
        });
      }
    };

    if (isOpen) {
      checkARSupport();
    }
  }, [isOpen]);

  // Initialize AR session
  const startARSession = async () => {
    if (!deviceSupport.isARSupported) {
      setArSession(prev => ({ ...prev, error: 'AR not supported on this device' }));
      return;
    }

    setArSession(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Initialize VR session first
      const vrSession = await vrService.startVRSession('therapy-room', 'therapy');

      if (!vrSession) {
        throw new Error('Failed to initialize VR session');
      }

      // Get auth session
      const authSession = await vrAuthService.authenticateVRSession(`device_${Date.now()}`);

      if (!authSession) {
        throw new Error('Failed to create auth session');
      }

      // Initialize AR session
      const arSessionData = await arService.initializeARSession(vrSession.id, authSession.id);

      if (!arSessionData) {
        throw new Error('Failed to initialize AR session');
      }

      // Create counsellor avatar AR object
      const avatarObjectId = arService.addARObject(arSessionData.id, arSessionData.activeLayerId!, {
        type: 'model',
        position: { x: 0, y: 0, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        content: counsellor.arAvatar?.modelUrl || '/models/default-counsellor.glb',
        metadata: {
          name: `${counsellor.name} Avatar`,
          description: `AR representation of ${counsellor.name}`,
          category: 'therapeutic',
          interactionType: 'gaze'
        },
        isVisible: true,
        isInteractable: true
      });

      // Add interaction UI elements
      const uiElements = [
        {
          type: 'text' as const,
          position: { x: -1, y: 1, z: -1.5 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.5, y: 0.5, z: 0.5 },
          content: `Welcome! I'm ${counsellor.name}`,
          metadata: {
            name: 'Welcome Message',
            category: 'therapeutic' as const,
            interactionType: 'gaze' as const
          },
          isVisible: true,
          isInteractable: false
        },
        {
          type: 'interactive' as const,
          position: { x: 1, y: 0.5, z: -1.5 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.3, y: 0.3, z: 0.3 },
          content: 'Start Conversation',
          metadata: {
            name: 'Start Button',
            category: 'therapeutic' as const,
            interactionType: 'click' as const
          },
          isVisible: true,
          isInteractable: true
        }
      ];

      uiElements.forEach(element => {
        arService.addARObject(arSessionData.id, arSessionData.activeLayerId!, element);
      });

      setArSession({
        isActive: true,
        sessionId: arSessionData.id,
        isLoading: false,
        error: null,
        trackingStatus: 'tracking',
        arObjects: arSessionData.layers.flatMap(layer => layer.objects)
      });

      onSessionStart?.(arSessionData.id);

      // Start camera feed
      await startCameraFeed();

    } catch (error) {
      console.error('Failed to start AR session:', error);
      setArSession(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start AR session'
      }));
    }
  };

  // Start camera feed
  const startCameraFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: controls.isMicEnabled
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      setArSession(prev => ({ ...prev, error: 'Camera access denied' }));
    }
  };

  // Stop AR session
  const stopARSession = async () => {
    if (arSession.sessionId) {
      await arService.terminateARSession(arSession.sessionId);
    }

    // Stop camera feed
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setArSession({
      isActive: false,
      sessionId: null,
      isLoading: false,
      error: null,
      trackingStatus: 'initializing',
      arObjects: []
    });
  };

  // Toggle controls
  const toggleControl = (control: keyof ARControls) => {
    setControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  // Handle AR interaction
  const handleARInteraction = (objectId: string, interactionType: string) => {
    if (!arSession.sessionId) return;

    arService.handleInteraction(arSession.sessionId, {
      objectId,
      type: interactionType as any,
      data: { timestamp: Date.now(), counsellorId: counsellor.id }
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (arSession.isActive) {
        stopARSession();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-background rounded-xl shadow-2xl overflow-hidden ${
            controls.isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Headset className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AR Session with {counsellor.name}</h3>
                <p className="text-sm text-muted-foreground">{counsellor.designation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={arSession.isActive ? 'default' : 'secondary'}>
                {arSession.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => toggleControl('isFullscreen')}>
                {controls.isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* AR Viewport */}
            <div className="flex-1 relative bg-black" ref={arContainerRef}>
              {!deviceSupport.isARSupported ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="p-6 m-4 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">AR Not Supported</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your device doesn't support AR features. You can still have a video call with the counsellor.
                    </p>
                    <Button onClick={onClose}>Continue with Video Call</Button>
                  </Card>
                </div>
              ) : arSession.isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Initializing AR Session...</p>
                  </div>
                </div>
              ) : arSession.error ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="p-6 m-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">AR Session Error</h3>
                    <p className="text-sm text-muted-foreground mb-4">{arSession.error}</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={startARSession}>Retry</Button>
                      <Button onClick={onClose}>Close</Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <>
                  {/* Camera Feed */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted={!controls.isAudioEnabled}
                  />
                  
                  {/* AR Canvas Overlay */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />

                  {/* AR Status Indicator */}
                  <div className="absolute top-4 left-4">
                    <Badge variant={arSession.trackingStatus === 'tracking' ? 'default' : 'destructive'}>
                      {arSession.trackingStatus === 'tracking' ? 'Tracking' : 'Lost Tracking'}
                    </Badge>
                  </div>

                  {/* AR Objects Count */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-black/50 text-white">
                      {arSession.arObjects.length} AR Objects
                    </Badge>
                  </div>
                </>
              )}
            </div>

            {/* Controls Panel */}
            <div className="w-80 bg-muted/30 p-4 space-y-4 overflow-y-auto">
              {/* Session Controls */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Session Controls</h4>
                <div className="space-y-2">
                  {!arSession.isActive ? (
                    <Button 
                      onClick={startARSession} 
                      disabled={arSession.isLoading || !deviceSupport.isARSupported}
                      className="w-full"
                    >
                      {arSession.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Starting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Start AR Session
                        </div>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={stopARSession} variant="destructive" className="w-full">
                      <Pause className="w-4 h-4 mr-2" />
                      End AR Session
                    </Button>
                  )}
                </div>
              </Card>

              {/* Audio Controls */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Audio & Video</h4>
                <div className="space-y-2">
                  <Button
                    variant={controls.isAudioEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleControl('isAudioEnabled')}
                    className="w-full justify-start"
                  >
                    {controls.isAudioEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                    {controls.isAudioEnabled ? 'Audio On' : 'Audio Off'}
                  </Button>
                  <Button
                    variant={controls.isMicEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleControl('isMicEnabled')}
                    className="w-full justify-start"
                  >
                    {controls.isMicEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                    {controls.isMicEnabled ? 'Mic On' : 'Mic Off'}
                  </Button>
                </div>
              </Card>

              {/* Tracking Controls */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Tracking Features</h4>
                <div className="space-y-2">
                  <Button
                    variant={controls.isHandTrackingEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleControl('isHandTrackingEnabled')}
                    className="w-full justify-start"
                  >
                    <Hand className="w-4 h-4 mr-2" />
                    Hand Tracking
                  </Button>
                  <Button
                    variant={controls.isEyeTrackingEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleControl('isEyeTrackingEnabled')}
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Eye Tracking
                  </Button>
                </div>
              </Card>

              {/* Quality Settings */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Render Quality</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
                    <Button
                      key={quality}
                      variant={controls.renderQuality === quality ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setControls(prev => ({ ...prev, renderQuality: quality }))}
                      className="capitalize"
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Counsellor Info */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Counsellor Info</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {counsellor.name}</p>
                  <p><strong>Department:</strong> {counsellor.department}</p>
                  <div>
                    <strong>Specializations:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {counsellor.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p><strong>Rating:</strong> ⭐ {counsellor.rating}/5</p>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ARCounsellorInteraction;