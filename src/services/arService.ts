import { vrService, VREnvironment } from './vrService';
import { vrAuthService } from './vrAuthService';

export interface ARObject {
  id: string;
  type: 'text' | 'image' | 'model' | 'video' | 'interactive';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  content: string | ArrayBuffer;
  metadata: {
    name: string;
    description?: string;
    category: 'wellness' | 'educational' | 'social' | 'therapeutic';
    interactionType?: 'click' | 'gaze' | 'gesture' | 'voice';
    duration?: number; // for timed content
  };
  isVisible: boolean;
  isInteractable: boolean;
}

export interface ARLayer {
  id: string;
  name: string;
  objects: ARObject[];
  isActive: boolean;
  blendMode: 'normal' | 'overlay' | 'multiply' | 'screen';
  opacity: number;
}

export interface ARSession {
  id: string;
  vrSessionId: string;
  layers: ARLayer[];
  activeLayerId: string | null;
  trackingData: {
    headPosition: { x: number; y: number; z: number };
    headRotation: { x: number; y: number; z: number };
    eyeGaze: { x: number; y: number };
    handPositions: {
      left?: { x: number; y: number; z: number };
      right?: { x: number; y: number; z: number };
    };
  };
  settings: {
    enableHandTracking: boolean;
    enableEyeTracking: boolean;
    enableSpatialAudio: boolean;
    renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  };
}

export interface ARInteraction {
  id: string;
  objectId: string;
  type: 'select' | 'hover' | 'gesture' | 'voice';
  timestamp: Date;
  data: any;
}

class ARService {
  private sessions: Map<string, ARSession> = new Map();
  private predefinedObjects: Map<string, ARObject[]> = new Map();
  private interactionHistory: ARInteraction[] = [];

  constructor() {
    this.initializePredefinedObjects();
  }

  /**
   * Initialize AR session for VR environment
   */
  async initializeARSession(vrSessionId: string, authSessionId: string): Promise<ARSession | null> {
    try {
      // Check permissions
      if (!vrAuthService.hasPermission(authSessionId, 'environments')) {
        throw new Error('No permission for AR features');
      }

      const arSession: ARSession = {
        id: this.generateARSessionId(),
        vrSessionId,
        layers: [],
        activeLayerId: null,
        trackingData: {
          headPosition: { x: 0, y: 0, z: 0 },
          headRotation: { x: 0, y: 0, z: 0 },
          eyeGaze: { x: 0, y: 0 },
          handPositions: {}
        },
        settings: {
          enableHandTracking: true,
          enableEyeTracking: false,
          enableSpatialAudio: true,
          renderQuality: 'medium'
        }
      };

      // Create default wellness layer
      const wellnessLayer = this.createWellnessLayer();
      arSession.layers.push(wellnessLayer);
      arSession.activeLayerId = wellnessLayer.id;

      this.sessions.set(arSession.id, arSession);
      return arSession;
    } catch (error) {
      console.error('Failed to initialize AR session:', error);
      return null;
    }
  }

  /**
   * Add AR object to session
   */
  addARObject(sessionId: string, layerId: string, object: Omit<ARObject, 'id'>): string | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const layer = session.layers.find(l => l.id === layerId);
    if (!layer) return null;

    const arObject: ARObject = {
      ...object,
      id: this.generateObjectId()
    };

    layer.objects.push(arObject);
    return arObject.id;
  }

  /**
   * Remove AR object from session
   */
  removeARObject(sessionId: string, objectId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    for (const layer of session.layers) {
      const index = layer.objects.findIndex(obj => obj.id === objectId);
      if (index !== -1) {
        layer.objects.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Update AR object properties
   */
  updateARObject(sessionId: string, objectId: string, updates: Partial<ARObject>): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    for (const layer of session.layers) {
      const object = layer.objects.find(obj => obj.id === objectId);
      if (object) {
        Object.assign(object, updates);
        return true;
      }
    }
    return false;
  }

  /**
   * Handle AR interaction
   */
  handleInteraction(sessionId: string, interaction: Omit<ARInteraction, 'id' | 'timestamp'>): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const fullInteraction: ARInteraction = {
      ...interaction,
      id: this.generateInteractionId(),
      timestamp: new Date()
    };

    this.interactionHistory.push(fullInteraction);

    // Process interaction based on type
    this.processInteraction(session, fullInteraction);
    return true;
  }

  /**
   * Update tracking data
   */
  updateTrackingData(sessionId: string, trackingData: Partial<ARSession['trackingData']>): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    Object.assign(session.trackingData, trackingData);
    return true;
  }

  /**
   * Get AR objects in view
   */
  getObjectsInView(sessionId: string): ARObject[] {
    const session = this.sessions.get(sessionId);
    if (!session || !session.activeLayerId) return [];

    const activeLayer = session.layers.find(l => l.id === session.activeLayerId);
    if (!activeLayer || !activeLayer.isActive) return [];

    return activeLayer.objects.filter(obj => obj.isVisible);
  }

  /**
   * Create wellness-focused AR layer
   */
  private createWellnessLayer(): ARLayer {
    const wellnessObjects = this.predefinedObjects.get('wellness') || [];
    
    return {
      id: this.generateLayerId(),
      name: 'Wellness Guidance',
      objects: [...wellnessObjects],
      isActive: true,
      blendMode: 'overlay',
      opacity: 0.8
    };
  }

  /**
   * Initialize predefined AR objects for different categories
   */
  private initializePredefinedObjects(): void {
    // Wellness objects
    const wellnessObjects: ARObject[] = [
      {
        id: 'breathing_guide',
        type: 'interactive',
        position: { x: 0, y: 1.5, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        content: 'breathing_animation',
        metadata: {
          name: 'Breathing Guide',
          description: 'Interactive breathing exercise visualization',
          category: 'wellness',
          interactionType: 'gaze',
          duration: 300 // 5 minutes
        },
        isVisible: true,
        isInteractable: true
      },
      {
        id: 'mindfulness_timer',
        type: 'text',
        position: { x: -1.5, y: 2, z: -1.5 },
        rotation: { x: 0, y: 45, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        content: '5:00',
        metadata: {
          name: 'Mindfulness Timer',
          description: 'Session timer for mindfulness exercises',
          category: 'wellness',
          interactionType: 'click'
        },
        isVisible: true,
        isInteractable: true
      },
      {
        id: 'progress_indicator',
        type: 'model',
        position: { x: 1.5, y: 1, z: -1 },
        rotation: { x: 0, y: -30, z: 0 },
        scale: { x: 0.3, y: 0.3, z: 0.3 },
        content: 'progress_ring_model',
        metadata: {
          name: 'Progress Ring',
          description: 'Visual progress indicator for wellness activities',
          category: 'wellness',
          interactionType: 'gaze'
        },
        isVisible: true,
        isInteractable: false
      }
    ];

    // Educational objects
    const educationalObjects: ARObject[] = [
      {
        id: 'info_panel',
        type: 'text',
        position: { x: 0, y: 2.5, z: -3 },
        rotation: { x: -15, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        content: 'Mental Health Tips',
        metadata: {
          name: 'Information Panel',
          description: 'Educational content about mental wellness',
          category: 'educational',
          interactionType: 'click'
        },
        isVisible: true,
        isInteractable: true
      }
    ];

    // Social objects
    const socialObjects: ARObject[] = [
      {
        id: 'user_avatar',
        type: 'model',
        position: { x: 2, y: 0, z: -2 },
        rotation: { x: 0, y: -45, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        content: 'avatar_model',
        metadata: {
          name: 'User Avatar',
          description: 'Representation of other users in social VR',
          category: 'social',
          interactionType: 'gesture'
        },
        isVisible: false, // Only visible in social mode
        isInteractable: true
      }
    ];

    this.predefinedObjects.set('wellness', wellnessObjects);
    this.predefinedObjects.set('educational', educationalObjects);
    this.predefinedObjects.set('social', socialObjects);
  }

  /**
   * Process AR interaction
   */
  private processInteraction(session: ARSession, interaction: ARInteraction): void {
    const object = this.findObjectById(session, interaction.objectId);
    if (!object || !object.isInteractable) return;

    switch (interaction.type) {
      case 'select':
        this.handleSelectInteraction(session, object, interaction);
        break;
      case 'hover':
        this.handleHoverInteraction(session, object, interaction);
        break;
      case 'gesture':
        this.handleGestureInteraction(session, object, interaction);
        break;
      case 'voice':
        this.handleVoiceInteraction(session, object, interaction);
        break;
    }
  }

  /**
   * Handle select interaction
   */
  private handleSelectInteraction(session: ARSession, object: ARObject, interaction: ARInteraction): void {
    switch (object.id) {
      case 'breathing_guide':
        // Start breathing exercise
        console.log('Starting breathing exercise');
        break;
      case 'mindfulness_timer':
        // Toggle timer
        console.log('Toggling mindfulness timer');
        break;
      case 'info_panel':
        // Show detailed information
        console.log('Showing detailed wellness information');
        break;
    }
  }

  /**
   * Handle hover interaction
   */
  private handleHoverInteraction(session: ARSession, object: ARObject, interaction: ARInteraction): void {
    // Highlight object or show tooltip
    console.log(`Hovering over ${object.metadata.name}`);
  }

  /**
   * Handle gesture interaction
   */
  private handleGestureInteraction(session: ARSession, object: ARObject, interaction: ARInteraction): void {
    // Process gesture-based interactions
    console.log(`Gesture interaction with ${object.metadata.name}`);
  }

  /**
   * Handle voice interaction
   */
  private handleVoiceInteraction(session: ARSession, object: ARObject, interaction: ARInteraction): void {
    // Process voice commands
    console.log(`Voice interaction with ${object.metadata.name}`);
  }

  /**
   * Find AR object by ID
   */
  private findObjectById(session: ARSession, objectId: string): ARObject | null {
    for (const layer of session.layers) {
      const object = layer.objects.find(obj => obj.id === objectId);
      if (object) return object;
    }
    return null;
  }

  /**
   * Generate unique AR session ID
   */
  private generateARSessionId(): string {
    return `ar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique layer ID
   */
  private generateLayerId(): string {
    return `layer_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Generate unique object ID
   */
  private generateObjectId(): string {
    return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Generate unique interaction ID
   */
  private generateInteractionId(): string {
    return `int_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Terminate AR session
   */
  async terminateARSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Clean up AR resources
      await this.cleanupARResources(session);
      this.sessions.delete(sessionId);
    }
  }

  /**
   * Clean up AR resources
   */
  private async cleanupARResources(session: ARSession): Promise<void> {
    // Clean up any AR-specific resources, models, textures, etc.
    console.log(`Cleaning up AR session resources for ${session.id}`);
  }

  /**
   * Get AR session statistics
   */
  getARSessionStats(sessionId: string): {
    objectsCount: number;
    interactionsCount: number;
    activeLayersCount: number;
  } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const objectsCount = session.layers.reduce((total, layer) => total + layer.objects.length, 0);
    const interactionsCount = this.interactionHistory.filter(i => 
      session.layers.some(layer => 
        layer.objects.some(obj => obj.id === i.objectId)
      )
    ).length;
    const activeLayersCount = session.layers.filter(layer => layer.isActive).length;

    return {
      objectsCount,
      interactionsCount,
      activeLayersCount
    };
  }
}

export const arService = new ARService();
export default arService;