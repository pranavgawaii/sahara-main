import { useState, useEffect, useCallback, useRef } from 'react';
import { Channel, Event } from 'stream-chat';
import { getStreamService, KhushMehtabUser } from '../services/getStreamService';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ChatMessage {
  id: string;
  text: string;
  user: KhushMehtabUser;
  created_at: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  reactions?: {
    type: string;
    count: number;
    users: string[];
  }[];
  isAnonymous?: boolean;
}

export interface GroupChat {
  id: string;
  name: string;
  university: string;
  memberCount: number;
  lastMessage?: string;
  lastActivity: Date;
  isActive: boolean;
  channel?: Channel;
}

export interface UseKhushMehtabChatReturn {
  // State
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  groupChats: GroupChat[];
  selectedChat: GroupChat | null;
  messages: ChatMessage[];
  typingUsers: string[];
  onlineUsers: string[];
  unreadCounts: Record<string, number>;
  
  // Actions
  connectToChat: () => Promise<void>;
  disconnectFromChat: () => Promise<void>;
  joinUniversityGroup: (universityCode: string) => Promise<void>;
  createAnonymousChat: (topic: string) => Promise<void>;
  selectChat: (chatId: string) => void;
  sendMessage: (text: string, isAnonymous?: boolean, attachments?: File[]) => Promise<void>;
  uploadFile: (file: File) => Promise<string | null>;
  addReaction: (messageId: string, type: string) => Promise<void>;
  removeReaction: (messageId: string, type: string) => Promise<void>;
  reportMessage: (messageId: string, reason: string) => Promise<void>;
  refreshChats: () => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
  markAsRead: (chatId: string) => void;
}

export const useKhushMehtabChat = (): UseKhushMehtabChatReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventListenersRef = useRef<Map<string, () => void>>(new Map());
  const [activeChannels, setActiveChannels] = useState<Map<string, Channel>>(new Map());

  // Connect to GetStream chat
  const connectToChat = useCallback(async () => {
    if (!user || isConnected) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await getStreamService.connectUser(user);
      setIsConnected(true);
      
      // Auto-join university group if user has institution
      if (user) {
        await joinUniversityGroup('default-university');
      }
      
      toast({
        title: "Connected to Khush Mehtab Adda",
        description: "You can now chat with fellow students from your university."
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to chat';
      setError(errorMessage);
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, isConnected, toast]);

  // Disconnect from chat
  const disconnectFromChat = useCallback(async () => {
    try {
      await getStreamService.disconnectUser();
      setIsConnected(false);
      setGroupChats([]);
      setSelectedChat(null);
      setMessages([]);
      setActiveChannels(new Map());
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  }, []);

  // Join university-based group
  const joinUniversityGroup = useCallback(async (universityCode: string) => {
    if (!isConnected) {
      await connectToChat();
    }
    
    setIsLoading(true);
    try {
      const channel = await getStreamService.getUniversityChannel(universityCode);
      if (channel) {
        const channelId = channel.id || `university-${universityCode.toLowerCase()}`;
        
        // Subscribe to channel events
        channel.on('message.new', handleNewMessage);
        channel.on('message.updated', handleMessageUpdate);
        channel.on('reaction.new', handleReactionUpdate);
        channel.on('reaction.deleted', handleReactionUpdate);
        channel.on('member.added', handleMemberUpdate);
        channel.on('member.removed', handleMemberUpdate);
        
        // Watch the channel
        await channel.watch();
        
        // Update active channels
        setActiveChannels(prev => new Map(prev.set(channelId, channel)));
        
        // Create group chat object
        const groupChat: GroupChat = {
          id: channelId,
          name: `${universityCode} Students`,
          university: universityCode,
          memberCount: Object.keys(channel.state.members).length,
          lastMessage: channel.state.messages[channel.state.messages.length - 1]?.text,
          lastActivity: new Date(channel.state.last_message_at || Date.now()),
          isActive: true,
          channel
        };
        
        setGroupChats(prev => {
          const existing = prev.find(chat => chat.id === channelId);
          if (existing) {
            return prev.map(chat => chat.id === channelId ? groupChat : chat);
          }
          return [...prev, groupChat];
        });
        
        toast({
          title: "Joined University Group",
          description: `Welcome to ${universityCode} students community!`
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join university group';
      setError(errorMessage);
      toast({
        title: "Failed to Join Group",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, connectToChat, toast]);

  // Create anonymous chat
  const createAnonymousChat = useCallback(async (topic: string) => {
    if (!isConnected) {
      await connectToChat();
    }
    
    setIsLoading(true);
    try {
      const channel = await getStreamService.createAnonymousChannel(topic);
      if (channel) {
        const channelId = channel.id || `anonymous-${Date.now()}`;
        
        // Subscribe to channel events
        channel.on('message.new', handleNewMessage);
        channel.on('message.updated', handleMessageUpdate);
        
        // Watch the channel
        await channel.watch();
        
        // Update active channels
        setActiveChannels(prev => new Map(prev.set(channelId, channel)));
        
        // Create group chat object
        const groupChat: GroupChat = {
          id: channelId,
          name: `Anonymous: ${topic}`,
          university: 'Anonymous',
          memberCount: 1,
          lastMessage: undefined,
          lastActivity: new Date(),
          isActive: true,
          channel
        };
        
        setGroupChats(prev => [...prev, groupChat]);
        setSelectedChat(groupChat);
        
        toast({
          title: "Anonymous Chat Created",
          description: "Your anonymous discussion space is ready."
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create anonymous chat';
      setError(errorMessage);
      toast({
        title: "Failed to Create Chat",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, connectToChat, toast]);

  // Select a chat
  const selectChat = useCallback((chatId: string) => {
    const chat = groupChats.find(c => c.id === chatId);
    if (chat) {
      setSelectedChat(chat);
      
      // Load messages from the channel
      if (chat.channel) {
        const channelMessages = chat.channel.state.messages.map(msg => ({
          id: msg.id,
          text: msg.text || '',
          user: msg.user as KhushMehtabUser,
          created_at: new Date(msg.created_at),
          attachments: msg.attachments?.map(att => ({
            type: att.type as 'image' | 'file',
            url: att.image_url || att.asset_url || '',
            name: att.title || 'attachment'
          })),
          reactions: Object.entries(msg.reaction_counts || {}).map(([type, count]) => ({
            type,
            count: count as number,
            users: msg.latest_reactions?.filter(r => r.type === type).map(r => r.user_id) || []
          })),
          isAnonymous: msg.user?.name === 'Anonymous Student'
        }));
        
        setMessages(channelMessages.reverse()); // Reverse to show newest first
      }
    }
  }, [groupChats]);

  // Send message
  const sendMessage = useCallback(async (
    text: string, 
    isAnonymous: boolean = false, 
    attachments: File[] = []
  ) => {
    if (!selectedChat?.channel || !text.trim()) return;
    
    setIsLoading(true);
    try {
      // Upload attachments first
      const uploadedAttachments = [];
      if (attachments && attachments.length > 0) {
        // Upload files using improved functionality
        const uploadedFiles = await getStreamService.uploadMultipleFiles(attachments);
        uploadedAttachments.push(...uploadedFiles.map(file => ({
          type: file.type,
          url: file.url,
          name: file.name
        })));
      }
      
      await getStreamService.sendMessage(
        selectedChat.id,
        text,
        uploadedAttachments,
        isAnonymous
      );
      
      toast({
        title: "Message Sent",
        description: isAnonymous ? "Your anonymous message has been posted." : "Your message has been sent."
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast({
        title: "Failed to Send Message",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedChat, toast]);

  // Upload file
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      const result = await getStreamService.uploadFile(file);
      return result.url;
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  // Add reaction
  const addReaction = useCallback(async (messageId: string, type: string) => {
    if (!selectedChat) return;
    
    try {
      await getStreamService.addReaction(selectedChat.id, messageId, type);
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  }, [selectedChat]);

  // Remove reaction
  const removeReaction = useCallback(async (messageId: string, type: string) => {
    if (!selectedChat) return;
    
    try {
      await getStreamService.removeReaction(selectedChat.id, messageId, type);
    } catch (err) {
      console.error('Failed to remove reaction:', err);
    }
  }, [selectedChat]);

  // Report message
  const reportMessage = useCallback(async (messageId: string, reason: string) => {
    if (!selectedChat) return;
    
    try {
      await getStreamService.reportMessage(selectedChat.id, messageId, reason);
      toast({
        title: "Message Reported",
        description: "Thank you for helping keep our community safe."
      });
    } catch (err) {
      toast({
        title: "Report Failed",
        description: "Failed to report message. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedChat, toast]);

  // Refresh chats
  const refreshChats = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const channels = await getStreamService.getUserChannels();
      const updatedChats: GroupChat[] = channels.map(channel => {
        const channelId = channel.id || 'unknown';
        const channelData = channel.data as any; // Type assertion for custom properties
        return {
          id: channelId,
          name: channelData?.name || `Chat ${channelId}`,
          university: channelData?.university || 'Unknown',
          memberCount: Object.keys(channel.state.members).length,
          lastMessage: channel.state.messages[channel.state.messages.length - 1]?.text,
          lastActivity: new Date(channel.state.last_message_at || Date.now()),
          isActive: Date.now() - new Date(channel.state.last_message_at || 0).getTime() < 24 * 60 * 60 * 1000,
          channel
        };
      });
      
      setGroupChats(updatedChats);
    } catch (err) {
      console.error('Failed to refresh chats:', err);
    }
  }, [isConnected]);

  // Start typing indicator
  const startTyping = useCallback(() => {
    if (!selectedChat?.channel) return;
    
    selectedChat.channel.keystroke();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      selectedChat.channel?.stopTyping();
    }, 3000);
  }, [selectedChat]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (!selectedChat?.channel) return;
    
    selectedChat.channel.stopTyping();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [selectedChat]);

  // Mark chat as read
  const markAsRead = useCallback((chatId: string) => {
    const channel = activeChannels.get(chatId);
    if (channel) {
      channel.markRead();
      setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
    }
  }, [activeChannels]);

  // Event handlers
  const handleNewMessage = useCallback((event: any) => {
    if (event.message && selectedChat?.id === event.cid) {
      const newMessage: ChatMessage = {
        id: event.message.id,
        text: event.message.text || '',
        user: event.message.user as KhushMehtabUser,
        created_at: new Date(event.message.created_at),
        attachments: event.message.attachments?.map((att: any) => ({
          type: att.type as 'image' | 'file',
          url: att.image_url || att.asset_url || '',
          name: att.title || 'attachment'
        })),
        isAnonymous: event.message.user?.name === 'Anonymous Student'
      };
      
      setMessages(prev => [newMessage, ...prev]);
    }
  }, [selectedChat]);

  const handleMessageUpdate = useCallback((event: any) => {
    if (event.message && selectedChat?.id === event.cid) {
      setMessages(prev => prev.map(msg => 
        msg.id === event.message.id 
          ? { ...msg, text: event.message.text || msg.text }
          : msg
      ));
    }
  }, [selectedChat]);

  const handleReactionUpdate = useCallback((event: any) => {
    if (event.message && selectedChat?.id === event.cid) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === event.message.id) {
          const reactions = Object.entries(event.message.reaction_counts || {}).map(([type, count]) => ({
            type,
            count: count as number,
            users: event.message.latest_reactions?.filter((r: any) => r.type === type).map((r: any) => r.user_id) || []
          }));
          return { ...msg, reactions };
        }
        return msg;
      }));
    }
  }, [selectedChat]);

  const handleMemberUpdate = useCallback((event: any) => {
    if (selectedChat?.id === event.cid) {
      setGroupChats(prev => prev.map(chat => 
        chat.id === event.cid 
          ? { ...chat, memberCount: Object.keys(event.channel?.state?.members || {}).length }
          : chat
      ));
    }
  }, [selectedChat]);

  const handleMessageDelete = useCallback((event: any) => {
    if (event.message && selectedChat?.id === event.cid) {
      setMessages(prev => prev.filter(msg => msg.id !== event.message.id));
    }
  }, [selectedChat]);

  // Setup event listeners for selected chat
  useEffect(() => {
    if (!selectedChat?.channel) {
      setMessages([]);
      setTypingUsers([]);
      return;
    }

    const channel = selectedChat.channel;
    
    // Listen for new messages
    const unsubscribeMessage = channel.on('message.new', handleNewMessage);
    const unsubscribeUpdate = channel.on('message.updated', handleMessageUpdate);
    const unsubscribeDelete = channel.on('message.deleted', handleMessageDelete);
    const unsubscribeMember = channel.on('member.added', handleMemberUpdate);
    const unsubscribeMemberRemoved = channel.on('member.removed', handleMemberUpdate);
    
    // Listen for typing indicators
    const unsubscribeTypingStart = channel.on('typing.start', (event: any) => {
      if (event.user?.id !== user?.id) {
        setTypingUsers(prev => {
          if (!prev.includes(event.user.name || event.user.id)) {
            return [...prev, event.user.name || event.user.id];
          }
          return prev;
        });
      }
    });
    
    const unsubscribeTypingStop = channel.on('typing.stop', (event: any) => {
      setTypingUsers(prev => prev.filter(userId => userId !== (event.user?.name || event.user?.id)));
    });
    
    // Listen for user presence
    const unsubscribeUserPresence = channel.on('user.presence.changed', (event: any) => {
      if (event.user?.online) {
        setOnlineUsers(prev => {
          if (!prev.includes(event.user.name || event.user.id)) {
            return [...prev, event.user.name || event.user.id];
          }
          return prev;
        });
      } else {
        setOnlineUsers(prev => prev.filter(userId => userId !== (event.user?.name || event.user?.id)));
      }
    });

    // Load existing messages
    if (channel.state?.messages) {
      setMessages(channel.state.messages.map(msg => ({
        id: msg.id || '',
        text: msg.text || '',
        user: msg.user as KhushMehtabUser,
        created_at: new Date(msg.created_at || Date.now()),
        attachments: msg.attachments?.map(att => ({
           type: att.type === 'image' ? 'image' : 'file',
           url: att.image_url || att.asset_url || '',
           name: att.title || 'file'
         })),
        isAnonymous: msg.user?.id?.includes('anonymous')
      } as ChatMessage)));
    }
    
    // Update unread count
    const unreadCount = channel.countUnread();
    setUnreadCounts(prev => ({ ...prev, [selectedChat.id]: unreadCount }));
    
    // Cleanup function
    return () => {
      unsubscribeMessage.unsubscribe();
      unsubscribeUpdate.unsubscribe();
      unsubscribeDelete.unsubscribe();
      unsubscribeMember.unsubscribe();
      unsubscribeMemberRemoved.unsubscribe();
      unsubscribeTypingStart.unsubscribe();
      unsubscribeTypingStop.unsubscribe();
      unsubscribeUserPresence.unsubscribe();
    };
  }, [selectedChat, user, handleNewMessage, handleMessageUpdate, handleMessageDelete, handleMemberUpdate]);

  // Auto-connect when user is available
  useEffect(() => {
    if (user && !isConnected && !isLoading) {
      connectToChat();
    }
  }, [user, isConnected, isLoading, connectToChat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectFromChat();
      }
    };
  }, [isConnected, disconnectFromChat]);

  return {
    // State
    isConnected,
    isLoading,
    error,
    groupChats,
    selectedChat,
    messages,
    typingUsers,
    onlineUsers,
    unreadCounts,
    
    // Actions
    connectToChat,
    disconnectFromChat,
    joinUniversityGroup,
    createAnonymousChat,
    selectChat,
    sendMessage,
    uploadFile,
    addReaction,
    removeReaction,
    reportMessage,
    refreshChats,
    startTyping,
    stopTyping,
    markAsRead
  };
};

export default useKhushMehtabChat;