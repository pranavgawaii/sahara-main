// Import all stores for internal use
import { useStore } from './useStore';
import { useUIStore, useToast, useModal, useTheme } from './useUIStore';
import { useWellnessStore, useMoodTracking, useGoals, useHabits } from './useWellnessStore';
import { useChatStore, useActiveChat, useChatNotifications } from './useChatStore';

// Main store exports
export { useStore } from './useStore';
export type {
  Student,

  ChatSession,
} from './useStore';

// UI store exports
export { useUIStore, useToast, useModal, useTheme } from './useUIStore';
export type {
  Theme,
  UIPreferences,
  ModalState,
  ToastState,
} from './useUIStore';

// Wellness store exports
export {
  useWellnessStore,
  useMoodTracking,
  useGoals,
  useHabits,
} from './useWellnessStore';
export type {
  MoodEntry,
  Goal,
  Habit,
  JournalEntry,
  WellnessMetrics,
} from './useWellnessStore';

// Chat store exports
export {
  useChatStore,
  useActiveChat,
  useChatNotifications,
} from './useChatStore';
export type {
  Message,
  ChatSession as ChatSessionDetailed,
  ChatNotification,
  TypingIndicator,
} from './useChatStore';

// Store utilities and helpers
export {

  mapToProblemInterface,
} from './useStore';

// Combined store hooks for common use cases
export const useAppState = () => {
  const mainStore = useStore();
  const uiStore = useUIStore();
  const wellnessStore = useWellnessStore();
  const chatStore = useChatStore();
  
  return {
    // Main app state
    student: mainStore.student,
    currentLanguage: mainStore.currentLanguage,
    onboardingCompleted: mainStore.onboardingCompleted,
    
    // UI state
    theme: uiStore.theme,
    isLoading: uiStore.isLoading,
    
    // Wellness state
    wellnessMetrics: wellnessStore.metrics,
    
    // Chat state
    connectionStatus: chatStore.connectionStatus,
    unreadMessages: chatStore.getUnreadCount(),
    
    // Actions
    setLanguage: mainStore.setLanguage,
    setTheme: uiStore.setTheme,
    setLoading: uiStore.setLoading,
  };
};

// Crisis management utilities
export const useCrisisManagement = () => {
  const { triggerCrisisAlert } = useChatStore();
  const { toast: addToast } = useToast();
  const { openModal } = useModal();
  
  const handleCrisisDetection = (sessionId: string, severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        openModal('crisis', { sessionId, severity });
        triggerCrisisAlert(sessionId, 'Crisis situation detected. Professional help is being contacted.');
        break;
      case 'medium':
        addToast({
          type: 'warning',
          title: 'Concerning Content Detected',
          description: 'Please consider reaching out to a counselor.',
          duration: 10000,
        });
        break;
      case 'low':
        addToast({
          type: 'info',
          title: 'Support Available',
          description: 'Remember that help is always available if you need it.',
        });
        break;
    }
  };
  
  return {
    handleCrisisDetection,
    triggerCrisisAlert,
  };
};

// Data persistence utilities
export const useDataManagement = () => {
  const mainStore = useStore();
  const wellnessStore = useWellnessStore();
  const chatStore = useChatStore();
  
  const exportAllData = () => {
    const data = {
      main: {
        student: mainStore.student,
    
        currentLanguage: mainStore.currentLanguage,
        onboardingCompleted: mainStore.onboardingCompleted,
      },
      wellness: wellnessStore.exportData(),
      chat: {
        sessions: chatStore.sessions,
        preferences: chatStore.preferences,
      },
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    return JSON.stringify(data, null, 2);
  };
  
  const clearAllData = () => {
    mainStore.clearUserData();
    wellnessStore.clearAllData();
    // Note: Chat data clearing should be handled carefully for privacy
  };
  
  return {
    exportAllData,
    clearAllData,
  };
};

// Analytics and insights
export const useAnalytics = () => {
  const { moodEntries, goals, habits } = useWellnessStore();
  const { sessions, messages } = useChatStore();
  
  const getEngagementMetrics = () => {
    const totalMoodEntries = moodEntries.length;
    const activeGoals = goals.filter(g => !g.isCompleted).length;
    const completedGoals = goals.filter(g => g.isCompleted).length;
    const activeHabits = habits.filter(h => h.isActive).length;
    const totalChatSessions = sessions.length;
    const totalMessages = Object.values(messages).flat().length;
    
    return {
      totalMoodEntries,
      activeGoals,
      completedGoals,
      activeHabits,
      totalChatSessions,
      totalMessages,
      engagementScore: Math.min(100, (
        (totalMoodEntries * 2) +
        (completedGoals * 5) +
        (activeHabits * 3) +
        (totalChatSessions * 2)
      )),
    };
  };
  
  const getWellnessTrends = () => {
    const recentMoods = moodEntries
      .filter(entry => {
        const daysDiff = (Date.now() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (recentMoods.length < 2) {
      return { trend: 'insufficient_data', change: 0 };
    }
    
    const firstWeek = recentMoods.slice(0, Math.min(7, recentMoods.length));
    const lastWeek = recentMoods.slice(-7);
    
    const firstWeekAvg = firstWeek.reduce((sum, entry) => sum + entry.mood, 0) / firstWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length;
    
    const change = lastWeekAvg - firstWeekAvg;
    
    return {
      trend: change > 0.5 ? 'improving' : change < -0.5 ? 'declining' : 'stable',
      change: Math.round(change * 100) / 100,
      firstWeekAvg: Math.round(firstWeekAvg * 100) / 100,
      lastWeekAvg: Math.round(lastWeekAvg * 100) / 100,
    };
  };
  
  return {
    getEngagementMetrics,
    getWellnessTrends,
  };
};

// Store reset utility for testing/development
export const useStoreReset = () => {
  const mainStore = useStore();
  const uiStore = useUIStore();
  const wellnessStore = useWellnessStore();
  const chatStore = useChatStore();
  
  const resetAllStores = () => {
    mainStore.clearUserData();
    uiStore.resetUI();
    wellnessStore.clearAllData();
    // Chat store doesn't have a reset method, but we can clear specific data
    chatStore.clearNotifications();
  };
  
  return {
    resetAllStores,
  };
};