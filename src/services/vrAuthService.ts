import { useStore } from '@/stores/useStore';

export interface VRSession {
  id: string;
  userId: string;
  deviceId: string;
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
  permissions: VRPermission[];
  securityLevel: 'basic' | 'enhanced' | 'premium';
}

export interface VRPermission {
  type: 'games' | 'social' | 'environments' | 'recording' | 'sharing';
  granted: boolean;
  expiresAt?: Date;
}

export interface VRDevice {
  id: string;
  name: string;
  type: 'headset' | 'controller' | 'tracker';
  isConnected: boolean;
  batteryLevel?: number;
  lastSeen: Date;
}

export interface VRAuthConfig {
  sessionTimeout: number; // in minutes
  maxConcurrentSessions: number;
  requireBiometric: boolean;
  allowGuestMode: boolean;
}

class VRAuthService {
  private sessions: Map<string, VRSession> = new Map();
  private devices: Map<string, VRDevice> = new Map();
  private config: VRAuthConfig = {
    sessionTimeout: 60, // 1 hour
    maxConcurrentSessions: 2,
    requireBiometric: false,
    allowGuestMode: true
  };

  /**
   * Authenticate user for VR session
   */
  async authenticateVRSession(deviceId: string): Promise<VRSession | null> {
    try {
      const { student } = useStore.getState();
      
      if (!student) {
        throw new Error('User not authenticated');
      }

      // Check if device is registered and trusted
      const device = this.devices.get(deviceId);
      if (!device) {
        await this.registerDevice(deviceId);
      }

      // Check concurrent session limit
      const activeSessions = Array.from(this.sessions.values())
        .filter(session => session.userId === student.ephemeralHandle && session.isActive);
      
      if (activeSessions.length >= this.config.maxConcurrentSessions) {
        // Terminate oldest session
        const oldestSession = activeSessions.sort((a, b) => 
          a.lastActivity.getTime() - b.lastActivity.getTime()
        )[0];
        await this.terminateSession(oldestSession.id);
      }

      // Create new VR session
      const session: VRSession = {
        id: this.generateSessionId(),
        userId: student.ephemeralHandle,
        deviceId,
        startTime: new Date(),
        lastActivity: new Date(),
        isActive: true,
        permissions: this.getDefaultPermissions(),
        securityLevel: this.determineSecurityLevel(student)
      };

      this.sessions.set(session.id, session);
      
      // Start session monitoring
      this.startSessionMonitoring(session.id);
      
      return session;
    } catch (error) {
      console.error('VR authentication failed:', error);
      return null;
    }
  }

  /**
   * Validate existing VR session
   */
  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session || !session.isActive) {
      return false;
    }

    // Check session timeout
    const now = new Date();
    const timeDiff = now.getTime() - session.lastActivity.getTime();
    const timeoutMs = this.config.sessionTimeout * 60 * 1000;
    
    if (timeDiff > timeoutMs) {
      this.terminateSession(sessionId);
      return false;
    }

    // Update last activity
    session.lastActivity = now;
    return true;
  }

  /**
   * Update session activity
   */
  updateSessionActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session && session.isActive) {
      session.lastActivity = new Date();
    }
  }

  /**
   * Check VR permission
   */
  hasPermission(sessionId: string, permissionType: VRPermission['type']): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return false;
    }

    const permission = session.permissions.find(p => p.type === permissionType);
    if (!permission || !permission.granted) {
      return false;
    }

    // Check expiration
    if (permission.expiresAt && new Date() > permission.expiresAt) {
      permission.granted = false;
      return false;
    }

    return true;
  }

  /**
   * Grant VR permission
   */
  grantPermission(sessionId: string, permissionType: VRPermission['type'], expiresIn?: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return false;
    }

    const existingPermission = session.permissions.find(p => p.type === permissionType);
    if (existingPermission) {
      existingPermission.granted = true;
      if (expiresIn) {
        existingPermission.expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);
      }
    } else {
      const newPermission: VRPermission = {
        type: permissionType,
        granted: true,
        expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 60 * 1000) : undefined
      };
      session.permissions.push(newPermission);
    }

    return true;
  }

  /**
   * Terminate VR session
   */
  async terminateSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      
      // Clean up resources
      await this.cleanupSessionResources(sessionId);
      
      // Remove from active sessions after delay for cleanup
      setTimeout(() => {
        this.sessions.delete(sessionId);
      }, 5000);
    }
  }

  /**
   * Get active VR sessions for user
   */
  getUserSessions(userId: string): VRSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId && session.isActive);
  }

  /**
   * Register VR device
   */
  private async registerDevice(deviceId: string): Promise<void> {
    const device: VRDevice = {
      id: deviceId,
      name: `VR Device ${deviceId.slice(-4)}`,
      type: 'headset',
      isConnected: true,
      lastSeen: new Date()
    };

    this.devices.set(deviceId, device);
  }

  /**
   * Get default permissions for new session
   */
  private getDefaultPermissions(): VRPermission[] {
    return [
      { type: 'games', granted: true },
      { type: 'environments', granted: true },
      { type: 'social', granted: false }, // Requires explicit consent
      { type: 'recording', granted: false }, // Requires explicit consent
      { type: 'sharing', granted: false } // Requires explicit consent
    ];
  }

  /**
   * Determine security level based on user profile
   */
  private determineSecurityLevel(student: any): VRSession['securityLevel'] {
    // Basic implementation - can be enhanced based on user verification, subscription, etc.
    return 'basic';
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `vr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start monitoring session for timeout and security
   */
  private startSessionMonitoring(sessionId: string): void {
    const checkInterval = setInterval(() => {
      if (!this.validateSession(sessionId)) {
        clearInterval(checkInterval);
      }
    }, 60000); // Check every minute
  }

  /**
   * Clean up session resources
   */
  private async cleanupSessionResources(sessionId: string): Promise<void> {
    // Clean up any VR-specific resources, connections, etc.
    console.log(`Cleaning up VR session resources for ${sessionId}`);
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string): {
    duration: number;
    activitiesCount: number;
    securityLevel: string;
  } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const duration = new Date().getTime() - session.startTime.getTime();
    
    return {
      duration: Math.floor(duration / 1000 / 60), // in minutes
      activitiesCount: 0, // Would track actual activities
      securityLevel: session.securityLevel
    };
  }
}

export const vrAuthService = new VRAuthService();
export default vrAuthService;