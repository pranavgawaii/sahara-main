import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MoodEntry {
  id: string;
  date: Date;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = very sad, 5 = very happy
  energy: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  sleep: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  tags: string[];
  activities: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'academic' | 'social' | 'personal';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: Date;
  isCompleted: boolean;
  createdAt: Date;
  milestones: Array<{
    id: string;
    title: string;
    value: number;
    isCompleted: boolean;
    completedAt?: Date;
  }>;
}

export interface WellnessMetrics {
  weeklyMoodAverage: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  stressLevel: 'low' | 'moderate' | 'high';
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  energyLevel: 'low' | 'moderate' | 'high';
  consistencyScore: number; // 0-100
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'wellness' | 'academic' | 'social' | 'health';
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays: number[]; // 0-6 for days of week
  streak: number;
  longestStreak: number;
  completedDates: Date[];
  isActive: boolean;
  createdAt: Date;
  reminder?: {
    enabled: boolean;
    time: string;
    message: string;
  };
}

export interface JournalEntry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  isPrivate: boolean;
  gratitude?: string[];
  challenges?: string[];
  achievements?: string[];
}

interface WellnessState {
  // Data
  moodEntries: MoodEntry[];
  goals: Goal[];
  habits: Habit[];
  journalEntries: JournalEntry[];
  
  // Computed metrics
  metrics: WellnessMetrics | null;
  
  // UI state
  selectedDateRange: { start: Date; end: Date };
  activeView: 'daily' | 'weekly' | 'monthly' | 'yearly';
  
  // Actions - Mood tracking
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteMoodEntry: (id: string) => void;
  getMoodEntriesInRange: (start: Date, end: Date) => MoodEntry[];
  
  // Actions - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'isCompleted' | 'currentValue'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  updateGoalProgress: (id: string, value: number) => void;
  
  // Actions - Habits
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'longestStreak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  markHabitComplete: (id: string, date: Date) => void;
  markHabitIncomplete: (id: string, date: Date) => void;
  
  // Actions - Journal
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  
  // Actions - Analytics
  calculateMetrics: () => void;
  setDateRange: (start: Date, end: Date) => void;
  setActiveView: (view: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  
  // Utility actions
  exportData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateWellnessMetrics = (moodEntries: MoodEntry[]): WellnessMetrics => {
  if (moodEntries.length === 0) {
    return {
      weeklyMoodAverage: 0,
      moodTrend: 'stable',
      stressLevel: 'moderate',
      sleepQuality: 'fair',
      energyLevel: 'moderate',
      consistencyScore: 0,
    };
  }
  
  const recentEntries = moodEntries
    .filter(entry => {
      const daysDiff = (Date.now() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const weeklyMoodAverage = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
  
  // Calculate trend
  let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (recentEntries.length >= 3) {
    const recent = recentEntries.slice(0, 3).reduce((sum, entry) => sum + entry.mood, 0) / 3;
    const older = recentEntries.slice(-3).reduce((sum, entry) => sum + entry.mood, 0) / 3;
    if (recent > older + 0.5) moodTrend = 'improving';
    else if (recent < older - 0.5) moodTrend = 'declining';
  }
  
  const avgStress = recentEntries.reduce((sum, entry) => sum + entry.stress, 0) / recentEntries.length;
  const avgSleep = recentEntries.reduce((sum, entry) => sum + entry.sleep, 0) / recentEntries.length;
  const avgEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length;
  
  return {
    weeklyMoodAverage,
    moodTrend,
    stressLevel: avgStress <= 2 ? 'low' : avgStress <= 3.5 ? 'moderate' : 'high',
    sleepQuality: avgSleep <= 2 ? 'poor' : avgSleep <= 3 ? 'fair' : avgSleep <= 4 ? 'good' : 'excellent',
    energyLevel: avgEnergy <= 2 ? 'low' : avgEnergy <= 3.5 ? 'moderate' : 'high',
    consistencyScore: Math.min(100, (recentEntries.length / 7) * 100),
  };
};

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set, get) => ({
      // Initial state
      moodEntries: [],
      goals: [],
      habits: [],
      journalEntries: [],
      metrics: null,
      selectedDateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      activeView: 'weekly',

      // Mood tracking actions
      addMoodEntry: (entry) => {
        const newEntry = { ...entry, id: generateId() };
        set((state) => {
          const newState = {
            moodEntries: [...state.moodEntries, newEntry],
          };
          return {
            ...newState,
            metrics: calculateWellnessMetrics(newState.moodEntries),
          };
        });
      },

      updateMoodEntry: (id, updates) =>
        set((state) => {
          const newEntries = state.moodEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          );
          return {
            moodEntries: newEntries,
            metrics: calculateWellnessMetrics(newEntries),
          };
        }),

      deleteMoodEntry: (id) =>
        set((state) => {
          const newEntries = state.moodEntries.filter((entry) => entry.id !== id);
          return {
            moodEntries: newEntries,
            metrics: calculateWellnessMetrics(newEntries),
          };
        }),

      getMoodEntriesInRange: (start, end) => {
        const { moodEntries } = get();
        return moodEntries.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= start && entryDate <= end;
        });
      },

      // Goal actions
      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: generateId(),
          createdAt: new Date(),
          isCompleted: false,
          currentValue: 0,
        };
        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
      },

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      completeGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, isCompleted: true } : goal
          ),
        })),

      updateGoalProgress: (id, value) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  currentValue: value,
                  isCompleted: value >= goal.targetValue,
                }
              : goal
          ),
        })),

      // Habit actions
      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: generateId(),
          createdAt: new Date(),
          streak: 0,
          longestStreak: 0,
          completedDates: [],
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),

      markHabitComplete: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            
            const dateStr = date.toDateString();
            const alreadyCompleted = habit.completedDates.some(
              (d) => new Date(d).toDateString() === dateStr
            );
            
            if (alreadyCompleted) return habit;
            
            const newCompletedDates = [...habit.completedDates, date];
            const newStreak = habit.streak + 1;
            
            return {
              ...habit,
              completedDates: newCompletedDates,
              streak: newStreak,
              longestStreak: Math.max(habit.longestStreak, newStreak),
            };
          }),
        })),

      markHabitIncomplete: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            
            const dateStr = date.toDateString();
            const newCompletedDates = habit.completedDates.filter(
              (d) => new Date(d).toDateString() !== dateStr
            );
            
            return {
              ...habit,
              completedDates: newCompletedDates,
              streak: Math.max(0, habit.streak - 1),
            };
          }),
        })),

      // Journal actions
      addJournalEntry: (entry) => {
        const newEntry = { ...entry, id: generateId() };
        set((state) => ({
          journalEntries: [...state.journalEntries, newEntry],
        }));
      },

      updateJournalEntry: (id, updates) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),

      deleteJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
        })),

      // Analytics actions
      calculateMetrics: () =>
        set((state) => ({
          metrics: calculateWellnessMetrics(state.moodEntries),
        })),

      setDateRange: (start, end) => set({ selectedDateRange: { start, end } }),
      
      setActiveView: (view) => set({ activeView: view }),

      // Utility actions
      exportData: () => {
        const state = get();
        return JSON.stringify({
          moodEntries: state.moodEntries,
          goals: state.goals,
          habits: state.habits,
          journalEntries: state.journalEntries,
          exportedAt: new Date(),
        });
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            moodEntries: parsed.moodEntries || [],
            goals: parsed.goals || [],
            habits: parsed.habits || [],
            journalEntries: parsed.journalEntries || [],
          });
          get().calculateMetrics();
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      clearAllData: () =>
        set({
          moodEntries: [],
          goals: [],
          habits: [],
          journalEntries: [],
          metrics: null,
        }),
    }),
    {
      name: 'wellness-store',
      partialize: (state) => ({
        moodEntries: state.moodEntries,
        goals: state.goals,
        habits: state.habits,
        journalEntries: state.journalEntries,
        selectedDateRange: state.selectedDateRange,
        activeView: state.activeView,
      }),
    }
  )
);

// Utility hooks
export const useMoodTracking = () => {
  const {
    moodEntries,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getMoodEntriesInRange,
    metrics,
  } = useWellnessStore();
  
  return {
    moodEntries,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getMoodEntriesInRange,
    metrics,
  };
};

export const useGoals = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    updateGoalProgress,
  } = useWellnessStore();
  
  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    updateGoalProgress,
    activeGoals: goals.filter(goal => !goal.isCompleted),
    completedGoals: goals.filter(goal => goal.isCompleted),
  };
};

export const useHabits = () => {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitIncomplete,
  } = useWellnessStore();
  
  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitIncomplete,
    activeHabits: habits.filter(habit => habit.isActive),
  };
};