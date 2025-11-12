import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system' | 'crisis_alert';
  timestamp: Date;
  isRead: boolean;
  reactions?: Array<{
    emoji: string;
    userId: string;
    timestamp: Date;
  }>;
  replyTo?: string; // Message ID being replied to
  isEdited?: boolean;
  editedAt?: Date;
}

export interface ChatSession {
  id: string;
  type: 'peer_support' | 'counselor' | 'group' | 'crisis';
  title: string;
  description?: string;
  problemCategory: string;
  participants: Array<{
    id: string;
    name: string;
    role: 'student' | 'counselor' | 'moderator';
    isOnline: boolean;
    lastSeen?: Date;
  }>;
  isActive: boolean;
  isAnonymous: boolean;
  maxParticipants?: number;
  createdAt: Date;
  lastActivity: Date;
  metadata?: {
    institutionCode?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high' | 'crisis';
  };
}

export interface ChatNotification {
  id: string;
  sessionId: string;
  type: 'new_message' | 'user_joined' | 'user_left' | 'session_ended' | 'crisis_alert';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
}

export interface TypingIndicator {
  sessionId: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

interface ChatState {
  // Data
  sessions: ChatSession[];
  messages: Record<string, Message[]>; // sessionId -> messages
  notifications: ChatNotification[];
  typingIndicators: TypingIndicator[];
  
  // Current state
  activeSessionId: string | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
  
  // User preferences
  preferences: {
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    showTypingIndicators: boolean;
    autoJoinSessions: boolean;
    anonymousMode: boolean;
  };
  
  // Actions - Session management
  createSession: (session: Omit<ChatSession, 'id' | 'createdAt' | 'lastActivity'>) => string;
  joinSession: (sessionId: string, userInfo: { id: string; name: string; role: 'student' | 'counselor' }) => void;
  leaveSession: (sessionId: string, userId: string) => void;
  setActiveSession: (sessionId: string | null) => void;
  updateSessionActivity: (sessionId: string) => void;
  
  // Actions - Messaging
  sendMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'sessionId'>) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  markAllMessagesAsRead: (sessionId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  
  // Actions - Notifications
  addNotification: (notification: Omit<ChatNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Actions - Typing indicators
  setTyping: (sessionId: string, userId: string, userName: string) => void;
  clearTyping: (sessionId: string, userId: string) => void;
  
  // Actions - Connection
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected' | 'error') => void;
  
  // Actions - Preferences
  updatePreferences: (preferences: Partial<ChatState['preferences']>) => void;
  
  // Actions - Crisis handling
  triggerCrisisAlert: (sessionId: string, message: string) => void;
  
  // Utility actions
  getSessionMessages: (sessionId: string) => Message[];
  getUnreadCount: (sessionId?: string) => number;
  searchMessages: (query: string, sessionId?: string) => Message[];
  exportChatHistory: (sessionId: string) => string;
  clearChatHistory: (sessionId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultPreferences = {
  soundEnabled: true,
  notificationsEnabled: true,
  showTypingIndicators: true,
  autoJoinSessions: false,
  anonymousMode: true,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      messages: {},
      notifications: [],
      typingIndicators: [],
      activeSessionId: null,
      connectionStatus: 'disconnected',
      preferences: defaultPreferences,

      // Session management
      createSession: (sessionData) => {
        const id = generateId();
        const newSession: ChatSession = {
          ...sessionData,
          id,
          createdAt: new Date(),
          lastActivity: new Date(),
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          messages: { ...state.messages, [id]: [] },
        }));
        
        return id;
      },

      joinSession: (sessionId, userInfo) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  participants: [
                    ...session.participants.filter(p => p.id !== userInfo.id),
                    { ...userInfo, isOnline: true, lastSeen: new Date() },
                  ],
                  lastActivity: new Date(),
                }
              : session
          ),
        }));
        
        // Add system message
        get().sendMessage(sessionId, {
          senderId: 'system',
          senderName: 'System',
          content: `${userInfo.name} joined the conversation`,
          type: 'system',
        });
      },

      leaveSession: (sessionId, userId) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  participants: session.participants.map(p =>
                    p.id === userId
                      ? { ...p, isOnline: false, lastSeen: new Date() }
                      : p
                  ),
                  lastActivity: new Date(),
                }
              : session
          ),
          activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
        }));
      },

      setActiveSession: (sessionId) => {
        set({ activeSessionId: sessionId });
        if (sessionId) {
          get().markAllMessagesAsRead(sessionId);
        }
      },

      updateSessionActivity: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, lastActivity: new Date() }
              : session
          ),
        }));
      },

      // Messaging
      sendMessage: (sessionId, messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          sessionId,
          timestamp: new Date(),
          isRead: false,
        };
        
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: [...(state.messages[sessionId] || []), message],
          },
        }));
        
        get().updateSessionActivity(sessionId);
        
        // Auto-mark as read if it's the active session and from current user
        if (get().activeSessionId === sessionId) {
          setTimeout(() => get().markMessageAsRead(message.id), 100);
        }
      },

      editMessage: (messageId, newContent) => {
        set((state) => {
          const newMessages = { ...state.messages };
          Object.keys(newMessages).forEach((sessionId) => {
            newMessages[sessionId] = newMessages[sessionId].map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    content: newContent,
                    isEdited: true,
                    editedAt: new Date(),
                  }
                : msg
            );
          });
          return { messages: newMessages };
        });
      },

      deleteMessage: (messageId) => {
        set((state) => {
          const newMessages = { ...state.messages };
          Object.keys(newMessages).forEach((sessionId) => {
            newMessages[sessionId] = newMessages[sessionId].filter(
              (msg) => msg.id !== messageId
            );
          });
          return { messages: newMessages };
        });
      },

      markMessageAsRead: (messageId) => {
        set((state) => {
          const newMessages = { ...state.messages };
          Object.keys(newMessages).forEach((sessionId) => {
            newMessages[sessionId] = newMessages[sessionId].map((msg) =>
              msg.id === messageId ? { ...msg, isRead: true } : msg
            );
          });
          return { messages: newMessages };
        });
      },

      markAllMessagesAsRead: (sessionId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: (state.messages[sessionId] || []).map((msg) => ({
              ...msg,
              isRead: true,
            })),
          },
        }));
      },

      addReaction: (messageId, emoji, userId) => {
        set((state) => {
          const newMessages = { ...state.messages };
          Object.keys(newMessages).forEach((sessionId) => {
            newMessages[sessionId] = newMessages[sessionId].map((msg) => {
              if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                const existingReaction = reactions.find(
                  (r) => r.emoji === emoji && r.userId === userId
                );
                
                if (!existingReaction) {
                  return {
                    ...msg,
                    reactions: [
                      ...reactions,
                      { emoji, userId, timestamp: new Date() },
                    ],
                  };
                }
              }
              return msg;
            });
          });
          return { messages: newMessages };
        });
      },

      removeReaction: (messageId, emoji, userId) => {
        set((state) => {
          const newMessages = { ...state.messages };
          Object.keys(newMessages).forEach((sessionId) => {
            newMessages[sessionId] = newMessages[sessionId].map((msg) => {
              if (msg.id === messageId && msg.reactions) {
                return {
                  ...msg,
                  reactions: msg.reactions.filter(
                    (r) => !(r.emoji === emoji && r.userId === userId)
                  ),
                };
              }
              return msg;
            });
          });
          return { messages: newMessages };
        });
      },

      // Notifications
      addNotification: (notificationData) => {
        const notification: ChatNotification = {
          ...notificationData,
          id: generateId(),
          timestamp: new Date(),
          isRead: false,
        };
        
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          ),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),

      // Typing indicators
      setTyping: (sessionId, userId, userName) => {
        set((state) => {
          const filtered = state.typingIndicators.filter(
            (indicator) => !(indicator.sessionId === sessionId && indicator.userId === userId)
          );
          
          return {
            typingIndicators: [
              ...filtered,
              { sessionId, userId, userName, timestamp: new Date() },
            ],
          };
        });
        
        // Auto-clear after 3 seconds
        setTimeout(() => {
          get().clearTyping(sessionId, userId);
        }, 3000);
      },

      clearTyping: (sessionId, userId) => {
        set((state) => ({
          typingIndicators: state.typingIndicators.filter(
            (indicator) => !(indicator.sessionId === sessionId && indicator.userId === userId)
          ),
        }));
      },

      // Connection
      setConnectionStatus: (status) => set({ connectionStatus: status }),

      // Preferences
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      // Crisis handling
      triggerCrisisAlert: (sessionId, message) => {
        // Send crisis message
        get().sendMessage(sessionId, {
          senderId: 'system',
          senderName: 'Crisis Alert',
          content: message,
          type: 'crisis_alert',
        });
        
        // Add notification
        get().addNotification({
          sessionId,
          type: 'crisis_alert',
          title: 'Crisis Alert',
          message: 'A crisis situation has been detected in this conversation',
          actionRequired: true,
        });
      },

      // Utility functions
      getSessionMessages: (sessionId) => {
        return get().messages[sessionId] || [];
      },

      getUnreadCount: (sessionId) => {
        const state = get();
        if (sessionId) {
          return (state.messages[sessionId] || []).filter((msg) => !msg.isRead).length;
        }
        
        return Object.values(state.messages)
          .flat()
          .filter((msg) => !msg.isRead).length;
      },

      searchMessages: (query, sessionId) => {
        const state = get();
        const messagesToSearch = sessionId
          ? state.messages[sessionId] || []
          : Object.values(state.messages).flat();
        
        return messagesToSearch.filter((msg) =>
          msg.content.toLowerCase().includes(query.toLowerCase())
        );
      },

      exportChatHistory: (sessionId) => {
        const state = get();
        const session = state.sessions.find((s) => s.id === sessionId);
        const messages = state.messages[sessionId] || [];
        
        return JSON.stringify({
          session,
          messages,
          exportedAt: new Date(),
        }, null, 2);
      },

      clearChatHistory: (sessionId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: [],
          },
        }));
      },
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        sessions: state.sessions,
        messages: state.messages,
        preferences: state.preferences,
        // Don't persist notifications and typing indicators
      }),
    }
  )
);

// Utility hooks
export const useActiveChat = () => {
  const {
    activeSessionId,
    sessions,
    messages,
    setActiveSession,
    sendMessage,
    markAllMessagesAsRead,
  } = useChatStore();
  
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const activeMessages = activeSessionId ? messages[activeSessionId] || [] : [];
  
  return {
    activeSession,
    activeMessages,
    setActiveSession,
    sendMessage: activeSessionId
      ? (message: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'sessionId'>) =>
          sendMessage(activeSessionId, message)
      : undefined,
    markAllAsRead: activeSessionId
      ? () => markAllMessagesAsRead(activeSessionId)
      : undefined,
  };
};

export const useChatNotifications = () => {
  const {
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    getUnreadCount,
  } = useChatStore();
  
  return {
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    unreadCount: getUnreadCount(),
    unreadNotifications: notifications.filter((n) => !n.isRead),
  };
};