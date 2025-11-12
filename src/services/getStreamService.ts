import { StreamChat, Channel, User as StreamUser, MessageResponse } from 'stream-chat';
import { useAuth } from '../hooks/useAuth';

// GetStream Configuration
const API_KEY = import.meta.env.VITE_GETSTREAM_API_KEY || 'demo-api-key';
const API_SECRET = import.meta.env.VITE_GETSTREAM_API_SECRET || 'demo-secret';

// Custom interfaces for our application
export interface KhushMehtabUser extends StreamUser {
  id: string;
  name: string;
  university: string;
  role: 'student' | 'counselor' | 'moderator';
  isAnonymous?: boolean;
  avatar?: string;
  institutionCode: string;
  year?: string;
  department?: string;
}

export interface KhushMehtabChannel {
  id: string;
  name: string;
  university: string;
  type: 'university' | 'anonymous' | 'support';
  memberCount: number;
  isPrivate: boolean;
  description?: string;
  guidelines?: string[];
  moderators: string[];
  createdAt: Date;
  lastActivity: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  user: KhushMehtabUser;
  created_at: Date;
  updated_at?: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }[];
  reactions?: {
    type: string;
    count: number;
    users: string[];
  }[];
  thread_participants?: string[];
  reply_count?: number;
  isAnonymous?: boolean;
}

export interface ChannelFilters {
  university?: string;
  type?: string;
  members?: { $in: string[] };
}

class GetStreamService {
  private client: StreamChat | null = null;
  private currentUser: KhushMehtabUser | null = null;
  private activeChannels: Map<string, Channel> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeClient();
  }

  /**
   * Initialize the Stream Chat client
   */
  private async initializeClient(): Promise<void> {
    try {
      // Use the API key from environment or fallback to a working demo key
      const apiKey = API_KEY !== 'demo-api-key' ? API_KEY : '8br4watad788';
      
      if (!apiKey) {
        throw new Error('GetStream API key is required');
      }

      this.client = StreamChat.getInstance(apiKey);
      this.isInitialized = true;
      console.log('GetStream client initialized successfully with key:', apiKey.substring(0, 8) + '...');
    } catch (error) {
      console.error('Failed to initialize GetStream client:', error);
      throw new Error('GetStream initialization failed');
    }
  }

  /**
   * Connect user to GetStream
   */
  async connectUser(user: any, token?: string): Promise<void> {
    if (!this.client || !this.isInitialized) {
      await this.initializeClient();
    }

    if (!this.client) {
      throw new Error('GetStream client not initialized');
    }

    try {
      // Transform our user to GetStream user format
      const streamUser: KhushMehtabUser = {
        id: user.id,
        name: user.name || 'Anonymous Student',
        university: user.institutionCode || 'Unknown University',
        role: user.role || 'student',
        avatar: user.avatar,
        institutionCode: user.institutionCode,
        isAnonymous: false
      };

      // Generate token if not provided (for demo purposes)
      const userToken = token || this.generateDemoToken(user.id);

      await this.client.connectUser(streamUser, userToken);
      this.currentUser = streamUser;
      
      console.log('User connected to GetStream:', streamUser.name);
    } catch (error) {
      console.error('Failed to connect user to GetStream:', error);
      throw new Error('User connection failed');
    }
  }

  /**
   * Disconnect user from GetStream
   */
  async disconnectUser(): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.disconnectUser();
      this.currentUser = null;
      this.activeChannels.clear();
      console.log('User disconnected from GetStream');
    } catch (error) {
      console.error('Failed to disconnect user:', error);
    }
  }

  /**
   * Create or get a university-based channel
   */
  async getUniversityChannel(universityCode: string, channelName?: string): Promise<Channel | null> {
    if (!this.client || !this.currentUser) {
      throw new Error('Client not initialized or user not connected');
    }

    try {
      const channelId = `university-${universityCode.toLowerCase().replace(/\s+/g, '-')}`;
      const channelType = 'messaging';

      // Check if channel already exists in our cache
      if (this.activeChannels.has(channelId)) {
        return this.activeChannels.get(channelId)!;
      }

      const channel = this.client.channel(channelType, channelId, {
        members: [this.currentUser.id],
        created_by_id: this.currentUser.id
      });

      await channel.create();
      this.activeChannels.set(channelId, channel);
      
      console.log(`University channel created/retrieved: ${channelId}`);
      return channel;
    } catch (error) {
      console.error('Failed to get university channel:', error);
      return null;
    }
  }

  /**
   * Create an anonymous channel for sensitive discussions
   */
  async createAnonymousChannel(topic: string): Promise<Channel | null> {
    if (!this.client || !this.currentUser) {
      throw new Error('Client not initialized or user not connected');
    }

    try {
      const channelId = `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const channelType = 'messaging';

      const channel = this.client.channel(channelType, channelId, {
        members: [this.currentUser.id],
        created_by_id: this.currentUser.id
      });

      await channel.create();
      this.activeChannels.set(channelId, channel);
      
      console.log(`Anonymous channel created: ${channelId}`);
      return channel;
    } catch (error) {
      console.error('Failed to create anonymous channel:', error);
      return null;
    }
  }

  /**
   * Join an existing channel
   */
  async joinChannel(channelId: string): Promise<Channel | null> {
    if (!this.client || !this.currentUser) {
      throw new Error('Client not initialized or user not connected');
    }

    try {
      const channel = this.client.channel('messaging', channelId);
      await channel.addMembers([this.currentUser.id]);
      
      this.activeChannels.set(channelId, channel);
      console.log(`Joined channel: ${channelId}`);
      return channel;
    } catch (error) {
      console.error('Failed to join channel:', error);
      return null;
    }
  }

  /**
   * Leave a channel
   */
  async leaveChannel(channelId: string): Promise<void> {
    if (!this.client || !this.currentUser) return;

    try {
      const channel = this.activeChannels.get(channelId);
      if (channel) {
        await channel.removeMembers([this.currentUser.id]);
        this.activeChannels.delete(channelId);
        console.log(`Left channel: ${channelId}`);
      }
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  }

  /**
   * Send a message to a channel
   */
  async sendMessage(
    channelId: string, 
    text: string, 
    attachments?: any[], 
    isAnonymous: boolean = false
  ): Promise<any | null> {
    if (!this.client || !this.currentUser) {
      throw new Error('Client not initialized or user not connected');
    }

    try {
      const channel = this.activeChannels.get(channelId);
      if (!channel) {
        throw new Error('Channel not found');
      }

      const messageData: any = {
        text,
        user_id: this.currentUser.id,
        isAnonymous
      };

      if (attachments && attachments.length > 0) {
        messageData.attachments = attachments;
      }

      // If anonymous, modify user display
      if (isAnonymous) {
        messageData.user = {
          ...this.currentUser,
          name: 'Anonymous Student',
          avatar: undefined
        };
      }

      const response = await channel.sendMessage(messageData);
      console.log('Message sent successfully');
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }

  /**
   * Upload file/image for messaging
   */
  async uploadFile(file: File): Promise<{ url: string; name: string; type: string }> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    try {
      const response = await this.client.uploadFile(file);
      
      return {
        url: response.file,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file'
      };
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files: File[]): Promise<{ url: string; name: string; type: string }[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Failed to upload multiple files:', error);
      throw error;
    }
  }

  /**
   * Get channels for current user
   */
  async getUserChannels(filters?: ChannelFilters): Promise<Channel[]> {
    if (!this.client || !this.currentUser) {
      return [];
    }

    try {
      const defaultFilters = {
        members: { $in: [this.currentUser.id] },
        ...filters
      };

      const channels = await this.client.queryChannels(defaultFilters, {
        last_message_at: -1
      });

      return channels;
    } catch (error) {
      console.error('Failed to get user channels:', error);
      return [];
    }
  }

  /**
   * Search for channels by university
   */
  async searchChannelsByUniversity(universityCode: string): Promise<Channel[]> {
    if (!this.client) {
      return [];
    }

    try {
      const channels = await this.client.queryChannels({
        members: { $in: [this.currentUser.id] }
      });

      return channels;
    } catch (error) {
      console.error('Failed to search channels:', error);
      return [];
    }
  }

  /**
   * Add reaction to a message
   */
  async addReaction(channelId: string, messageId: string, type: string): Promise<void> {
    if (!this.client || !this.currentUser) return;

    try {
      const channel = this.activeChannels.get(channelId);
      if (channel) {
        await channel.sendReaction(messageId, { type });
      }
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  }

  /**
   * Remove reaction from a message
   */
  async removeReaction(channelId: string, messageId: string, type: string): Promise<void> {
    if (!this.client || !this.currentUser) return;

    try {
      const channel = this.activeChannels.get(channelId);
      if (channel) {
        await channel.deleteReaction(messageId, type);
      }
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  }

  /**
   * Report a message for moderation
   */
  async reportMessage(channelId: string, messageId: string, reason: string): Promise<void> {
    if (!this.client || !this.currentUser) return;

    try {
      // In a real implementation, this would send to moderation system
      console.log(`Message reported: ${messageId} for reason: ${reason}`);
      
      // For now, we'll flag the message
      const channel = this.activeChannels.get(channelId);
      if (channel) {
        await channel.sendMessage({
          text: `⚠️ Message reported by ${this.currentUser.name} - Reason: ${reason}`
        });
      }
    } catch (error) {
      console.error('Failed to report message:', error);
    }
  }

  /**
   * Get channel statistics
   */
  async getChannelStats(channelId: string): Promise<any> {
    if (!this.client) return null;

    try {
      const channel = this.activeChannels.get(channelId);
      if (!channel) return null;

      const state = channel.state;
      return {
        memberCount: Object.keys(state.members).length,
        messageCount: state.messages.length,
        lastActivity: state.last_message_at,
        isActive: Date.now() - new Date(state.last_message_at || 0).getTime() < 24 * 60 * 60 * 1000
      };
    } catch (error) {
      console.error('Failed to get channel stats:', error);
      return null;
    }
  }

  /**
   * Generate demo token for development (replace with backend token generation)
   */
  private generateDemoToken(userId: string): string {
    // For development/demo purposes, use GetStream's development token
    // In production, tokens should be generated by your backend with proper JWT signing
    return `development-token-${userId}`;
  }

  /**
   * Get current user
   */
  getCurrentUser(): KhushMehtabUser | null {
    return this.currentUser;
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized && this.client !== null;
  }

  /**
   * Get active channels
   */
  getActiveChannels(): Map<string, Channel> {
    return this.activeChannels;
  }
}

// Export singleton instance
export const getStreamService = new GetStreamService();
export default getStreamService;