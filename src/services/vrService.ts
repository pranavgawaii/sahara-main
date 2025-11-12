import { useStore } from '@/stores/useStore';

// Google VR API types and interfaces
interface VRDisplay {
  displayId: number;
  displayName: string;
  capabilities: {
    hasPosition: boolean;
    hasOrientation: boolean;
    hasExternalDisplay: boolean;
    canPresent: boolean;
    maxLayers: number;
  };
  stageParameters?: {
    sittingToStandingTransform: Float32Array;
    sizeX: number;
    sizeZ: number;
  };
  requestPresent(layers: VRLayer[]): Promise<void>;
  exitPresent(): Promise<void>;
  getFrameData(frameData: VRFrameData): boolean;
  getPose(): VRPose;
  resetPose(): void;
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(handle: number): void;
}

interface VRLayer {
  source?: HTMLCanvasElement | HTMLVideoElement;
  leftBounds?: number[];
  rightBounds?: number[];
}

interface VRFrameData {
  timestamp: number;
  leftProjectionMatrix: Float32Array;
  leftViewMatrix: Float32Array;
  rightProjectionMatrix: Float32Array;
  rightViewMatrix: Float32Array;
  pose: VRPose;
}

interface VRPose {
  position?: Float32Array;
  linearVelocity?: Float32Array;
  linearAcceleration?: Float32Array;
  orientation?: Float32Array;
  angularVelocity?: Float32Array;
  angularAcceleration?: Float32Array;
}

// VR Session Management
export interface VRSession {
  id: string;
  userId: string;
  sessionType: 'wellness' | 'social' | 'game' | 'therapy';
  startTime: Date;
  duration: number;
  isActive: boolean;
  environment: string;
  participants?: string[];
}

// VR Environment Types
export interface VREnvironment {
  id: string;
  name: string;
  description: string;
  type: '360-video' | '3d-scene' | 'interactive' | 'social';
  assetUrl: string;
  thumbnailUrl: string;
  category: 'relaxation' | 'meditation' | 'social' | 'educational' | 'therapeutic';
  duration?: number;
  maxParticipants?: number;
  features: string[];
}

// VR Interaction Types
export interface VRInteraction {
  type: 'gaze' | 'controller' | 'gesture' | 'voice';
  target: string;
  action: string;
  timestamp: Date;
  data?: any;
}

class VRService {
  private vrDisplay: VRDisplay | null = null;
  private vrSession: VRSession | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private frameData: VRFrameData | null = null;
  private animationId: number | null = null;
  private isPresenting = false;
  private onSessionUpdate?: (session: VRSession | null) => void;
  private isDesktopMode = false;
  private desktopCamera = { yaw: 0, pitch: 0, zoom: 1 };
  private mouseControls = { isDown: false, lastX: 0, lastY: 0 };

  // Initialize VR Service
  async initialize(): Promise<boolean> {
    try {
      // Check for WebVR support
      if ('getVRDisplays' in navigator) {
        // Get available VR displays
        const displays = await (navigator as any).getVRDisplays();
        if (displays.length > 0) {
          this.vrDisplay = displays[0];
          this.frameData = new (window as any).VRFrameData();
          this.isDesktopMode = false;
          console.log('VR Service initialized with hardware:', this.vrDisplay.displayName);
          return true;
        }
      }

      // Fallback to desktop mode
      console.log('VR hardware not available, initializing desktop 360° mode');
      this.isDesktopMode = true;
      this.initializeDesktopMode();
      return true;
    } catch (error) {
      console.warn('VR hardware initialization failed, falling back to desktop mode:', error);
      this.isDesktopMode = true;
      this.initializeDesktopMode();
      return true;
    }
  }

  // Initialize Desktop 360° Mode
  private initializeDesktopMode(): void {
    this.desktopCamera = { yaw: 0, pitch: 0, zoom: 1 };
    this.mouseControls = { isDown: false, lastX: 0, lastY: 0 };
    console.log('Desktop 360° mode initialized');
  }

  // Start Desktop Session
  private async startDesktopSession(environmentId: string, sessionType: VRSession['sessionType']): Promise<VRSession> {
    const session: VRSession = {
      id: `desktop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: useStore.getState().student?.ephemeralHandle || 'anonymous',
      sessionType,
      startTime: new Date(),
      duration: 0,
      isActive: true,
      environment: environmentId,
      participants: sessionType === 'social' ? [] : undefined
    };

    this.vrSession = session;
    this.setupDesktopControls();
    this.startDesktopRenderLoop();
    
    if (this.onSessionUpdate) {
      this.onSessionUpdate(session);
    }

    console.log('Desktop 360° Session started:', session.id);
    return session;
  }

  // Setup Desktop Mouse/Keyboard Controls
  private setupDesktopControls(): void {
    if (!this.canvas) return;

    // Mouse controls for 360° navigation
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseControls.isDown = true;
      this.mouseControls.lastX = e.clientX;
      this.mouseControls.lastY = e.clientY;
      this.canvas!.style.cursor = 'grabbing';
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.mouseControls.isDown) return;
      
      const deltaX = e.clientX - this.mouseControls.lastX;
      const deltaY = e.clientY - this.mouseControls.lastY;
      
      this.desktopCamera.yaw += deltaX * 0.01;
      this.desktopCamera.pitch += deltaY * 0.01;
      
      // Clamp pitch to prevent over-rotation
      this.desktopCamera.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.desktopCamera.pitch));
      
      this.mouseControls.lastX = e.clientX;
      this.mouseControls.lastY = e.clientY;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouseControls.isDown = false;
      this.canvas!.style.cursor = 'grab';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseControls.isDown = false;
      this.canvas!.style.cursor = 'grab';
    });

    // Wheel for zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.desktopCamera.zoom += e.deltaY * -0.001;
      this.desktopCamera.zoom = Math.max(0.5, Math.min(3, this.desktopCamera.zoom));
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!this.vrSession?.isActive) return;
      
      const speed = 0.05;
      switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.desktopCamera.yaw -= speed;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.desktopCamera.yaw += speed;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.desktopCamera.pitch -= speed;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.desktopCamera.pitch += speed;
          break;
        case '=':
        case '+':
          this.desktopCamera.zoom = Math.min(3, this.desktopCamera.zoom + 0.1);
          break;
        case '-':
        case '_':
          this.desktopCamera.zoom = Math.max(0.5, this.desktopCamera.zoom - 0.1);
          break;
      }
      
      // Clamp pitch
      this.desktopCamera.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.desktopCamera.pitch));
    });

    this.canvas.style.cursor = 'grab';
  }

  // Desktop Render Loop
  private startDesktopRenderLoop(): void {
    const render = () => {
      if (!this.vrSession?.isActive) return;
      
      this.renderDesktop360();
      this.animationId = requestAnimationFrame(render);
    };
    
    render();
  }

  // Render Desktop 360° View
  private renderDesktop360(): void {
    if (!this.gl || !this.canvas) return;
    
    // Clear canvas
    this.gl.clearColor(0.1, 0.1, 0.2, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Apply camera transformations based on mouse/keyboard input
    // This is a simplified render - in a real implementation, you'd render the 360° environment
    // using the current camera angles (yaw, pitch, zoom)
    
    // Update session duration
    if (this.vrSession) {
      this.vrSession.duration = Date.now() - this.vrSession.startTime.getTime();
    }
  }

  // End Desktop Session
  private endDesktopSession(): void {
    // Stop render loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Update session
    if (this.vrSession) {
      this.vrSession.duration = Date.now() - this.vrSession.startTime.getTime();
      this.vrSession.isActive = false;
      
      if (this.onSessionUpdate) {
        this.onSessionUpdate(null);
      }
      
      console.log('Desktop 360° Session ended:', this.vrSession.id);
      this.vrSession = null;
    }

    // Reset camera
    this.desktopCamera = { yaw: 0, pitch: 0, zoom: 1 };
    
    // Reset canvas cursor
    if (this.canvas) {
      this.canvas.style.cursor = 'default';
    }
  }

  // Create VR Canvas
  createCanvas(container: HTMLElement): HTMLCanvasElement {
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    
    container.appendChild(this.canvas);
    
    // Initialize WebGL context
    this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext || this.canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    return this.canvas;
  }

  // Start VR Session
  async startVRSession(environmentId: string, sessionType: VRSession['sessionType']): Promise<VRSession> {
    if (!this.canvas) {
      throw new Error('Canvas not initialized');
    }

    try {
      // Handle desktop mode or VR mode
      if (this.isDesktopMode) {
        return this.startDesktopSession(environmentId, sessionType);
      }

      if (!this.vrDisplay) {
        throw new Error('VR display not available');
      }

      // Request VR presentation
      await this.vrDisplay.requestPresent([{ source: this.canvas }]);
      this.isPresenting = true;

      // Create session
      const session: VRSession = {
        id: `vr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: useStore.getState().student?.ephemeralHandle || 'anonymous',
        sessionType,
        startTime: new Date(),
        duration: 0,
        isActive: true,
        environment: environmentId,
        participants: sessionType === 'social' ? [] : undefined
      };

      this.vrSession = session;
      this.startRenderLoop();
      
      if (this.onSessionUpdate) {
        this.onSessionUpdate(session);
      }

      console.log('VR Session started:', session.id);
      return session;
    } catch (error) {
      console.error('Failed to start VR session:', error);
      throw error;
    }
  }

  // End VR Session
  async endVRSession(): Promise<void> {
    if (!this.vrSession) {
      return;
    }

    try {
      // Handle desktop mode or VR mode
      if (this.isDesktopMode) {
        this.endDesktopSession();
        return;
      }

      if (!this.vrDisplay) {
        return;
      }

      // Exit VR presentation
      await this.vrDisplay.exitPresent();
      this.isPresenting = false;

      // Stop render loop
      if (this.animationId) {
        this.vrDisplay.cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      // Update session
      if (this.vrSession) {
        this.vrSession.isActive = false;
        this.vrSession.duration = Date.now() - this.vrSession.startTime.getTime();
      }

      if (this.onSessionUpdate) {
        this.onSessionUpdate(null);
      }

      console.log('VR Session ended');
      this.vrSession = null;
    } catch (error) {
      console.error('Failed to end VR session:', error);
    }
  }

  // VR Render Loop
  private startRenderLoop(): void {
    if (!this.vrDisplay || !this.gl || !this.frameData) {
      return;
    }

    const render = () => {
      if (!this.isPresenting || !this.vrDisplay || !this.gl || !this.frameData) {
        return;
      }

      // Get frame data
      this.vrDisplay.getFrameData(this.frameData);

      // Clear canvas
      this.gl.clearColor(0.1, 0.1, 0.2, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      // Render left eye
      this.renderEye('left', this.frameData.leftViewMatrix, this.frameData.leftProjectionMatrix);
      
      // Render right eye
      this.renderEye('right', this.frameData.rightViewMatrix, this.frameData.rightProjectionMatrix);

      // Submit frame (Note: submitFrame may not be available in all VR implementations)
      if ('submitFrame' in this.vrDisplay) {
        (this.vrDisplay as any).submitFrame();
      }

      // Request next frame
      this.animationId = this.vrDisplay.requestAnimationFrame(render);
    };

    this.animationId = this.vrDisplay.requestAnimationFrame(render);
  }

  // Render single eye
  private renderEye(eye: 'left' | 'right', viewMatrix: Float32Array, projectionMatrix: Float32Array): void {
    if (!this.gl) return;

    // Set viewport for eye
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const eyeWidth = canvas.width / 2;
    const eyeHeight = canvas.height;
    const eyeX = eye === 'left' ? 0 : eyeWidth;
    
    this.gl.viewport(eyeX, 0, eyeWidth, eyeHeight);

    // Apply view and projection matrices
    // This would be where you render your 3D scene
    // For now, we'll just clear with a color
    const color = eye === 'left' ? [0.2, 0.4, 0.8, 1.0] : [0.8, 0.4, 0.2, 1.0];
    this.gl.clearColor(color[0], color[1], color[2], color[3]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  // Get current VR pose
  getCurrentPose(): VRPose | null {
    if (!this.vrDisplay) {
      return null;
    }
    return this.vrDisplay.getPose();
  }

  // Handle VR interactions
  handleInteraction(interaction: VRInteraction): void {
    console.log('VR Interaction:', interaction);
    
    // Process interaction based on type
    switch (interaction.type) {
      case 'gaze':
        this.handleGazeInteraction(interaction);
        break;
      case 'controller':
        this.handleControllerInteraction(interaction);
        break;
      case 'gesture':
        this.handleGestureInteraction(interaction);
        break;
      case 'voice':
        this.handleVoiceInteraction(interaction);
        break;
    }
  }

  private handleGazeInteraction(interaction: VRInteraction): void {
    // Implement gaze-based interactions
    console.log('Gaze interaction:', interaction.target);
  }

  private handleControllerInteraction(interaction: VRInteraction): void {
    // Implement controller-based interactions
    console.log('Controller interaction:', interaction.action);
  }

  private handleGestureInteraction(interaction: VRInteraction): void {
    // Implement gesture-based interactions
    console.log('Gesture interaction:', interaction.action);
  }

  private handleVoiceInteraction(interaction: VRInteraction): void {
    // Implement voice-based interactions
    console.log('Voice interaction:', interaction.action);
  }

  // Session management
  getCurrentSession(): VRSession | null {
    return this.vrSession;
  }

  isVRActive(): boolean {
    return this.isPresenting && this.vrSession?.isActive === true;
  }

  onSessionChange(callback: (session: VRSession | null) => void): void {
    this.onSessionUpdate = callback;
  }

  // Cleanup
  dispose(): void {
    if (this.isPresenting) {
      this.endVRSession();
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    this.vrDisplay = null;
    this.canvas = null;
    this.gl = null;
    this.frameData = null;
  }
}

// Singleton instance
export const vrService = new VRService();

// VR Environment presets
export const VR_ENVIRONMENTS: VREnvironment[] = [
  {
    id: 'peaceful-garden',
    name: 'Peaceful Garden',
    description: 'A serene virtual garden for meditation and relaxation',
    type: '3d-scene',
    assetUrl: '/vr-assets/peaceful-garden.json',
    thumbnailUrl: '/vr-assets/thumbnails/peaceful-garden.jpg',
    category: 'relaxation',
    duration: 1800, // 30 minutes
    features: ['meditation', 'nature-sounds', 'guided-breathing']
  },
  {
    id: 'social-lounge',
    name: 'Virtual Social Lounge',
    description: 'Connect with peers in a comfortable virtual space',
    type: 'social',
    assetUrl: '/vr-assets/social-lounge.json',
    thumbnailUrl: '/vr-assets/thumbnails/social-lounge.jpg',
    category: 'social',
    maxParticipants: 8,
    features: ['voice-chat', 'avatars', 'interactive-objects']
  },
  {
    id: 'mindfulness-beach',
    name: 'Mindfulness Beach',
    description: '360-degree beach environment for stress relief',
    type: '360-video',
    assetUrl: '/vr-assets/mindfulness-beach.mp4',
    thumbnailUrl: '/vr-assets/thumbnails/mindfulness-beach.jpg',
    category: 'meditation',
    duration: 1200, // 20 minutes
    features: ['ocean-sounds', 'guided-meditation', 'breathing-exercises']
  },
  {
    id: 'study-sanctuary',
    name: 'Study Sanctuary',
    description: 'Focused virtual environment for academic wellness',
    type: 'interactive',
    assetUrl: '/vr-assets/study-sanctuary.json',
    thumbnailUrl: '/vr-assets/thumbnails/study-sanctuary.jpg',
    category: 'educational',
    features: ['focus-music', 'productivity-tools', 'break-reminders']
  },
  {
    id: 'therapy-room',
    name: 'Virtual Therapy Room',
    description: 'Private space for counseling sessions',
    type: 'interactive',
    assetUrl: '/vr-assets/therapy-room.json',
    thumbnailUrl: '/vr-assets/thumbnails/therapy-room.jpg',
    category: 'therapeutic',
    maxParticipants: 2,
    features: ['private-chat', 'screen-sharing', 'mood-tracking']
  }
];

// Utility functions
export const getEnvironmentsByCategory = (category: VREnvironment['category']): VREnvironment[] => {
  return VR_ENVIRONMENTS.filter(env => env.category === category);
};

export const getEnvironmentById = (id: string): VREnvironment | undefined => {
  return VR_ENVIRONMENTS.find(env => env.id === id);
};

export default vrService;