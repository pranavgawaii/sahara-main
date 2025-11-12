import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Individual response to a screening question
 */
export interface ScreeningResponse {
  questionId: string;    // Unique identifier for the question
  answer: number | string; // User's response (numeric scale or text)
}

/**
 * Complete screening assessment result
 * Contains responses, calculated scores, and severity classification
 */
export interface ScreeningResult {
  id: string;                    // Unique result identifier
  tool: 'PHQ9' | 'GAD7' | 'CUSTOM'; // Assessment tool used
  responses: ScreeningResponse[]; // Individual question responses
  score: number;                 // Calculated total score
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe'; // Severity classification
  problemTags: string[];         // Identified problem areas
  timestamp: Date;               // When assessment was completed
}

/**
 * Student identity and session information
 * Designed for privacy with ephemeral handles and minimal data retention
 */
export interface Student {
  token: string;              // Session authentication token
  institutionCode: string;    // Institution identifier
  ephemeralHandle: string;    // Anonymous display name
  language: string;           // Preferred language code
  role?: 'student' | 'counsellor' | 'staff'; // User role (optional)
  consentFlags: {             // Privacy and consent preferences
    dataProcessing: boolean;    // Consent for data processing
    anonymousChat: boolean;     // Allow anonymous chat participation
    counselorContact: boolean;  // Allow counselor contact in crisis
  };
  createdAt: Date;           // Session creation timestamp
}

/**
 * Anonymous chat session for peer support
 * Groups students by problem type and institution
 */
export interface ChatSession {
  id: string;              // Unique session identifier
  institutionCode: string; // Institution code for grouping
  problemId: string;       // Problem category identifier
  ephemeralName: string;   // Anonymous display name in chat
  joinedAt: Date;         // When user joined the session
}

/**
 * Main application state interface
 * Manages student data, screening results, chat sessions, and onboarding flow
 */
interface AppState {
  // Student data - ephemeral identity for privacy
  student: Student | null;        // Current student session
  currentLanguage: string;        // Selected language preference
  
  currentProblemId: string | null;     // Current identified problem category
  
  // Chat & social - anonymous peer support
  currentChatSession: ChatSession | null; // Active chat session
  
  // UI state - user flow management
  onboardingCompleted: boolean;    // Onboarding completion status
  
  // Actions - state mutation methods
  setStudent: (student: Student) => void;              // Set student identity
  setLanguage: (language: string) => void;             // Update language preference

  setCurrentProblem: (problemId: string) => void;      // Set current problem category
  joinChatSession: (session: ChatSession) => void;     // Join chat session
  leaveChatSession: () => void;                        // Leave current chat
  completeOnboarding: () => void;                      // Mark onboarding complete
  clearUserData: () => void;                           // Clear all user data
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      student: null,
      currentLanguage: 'en',

      currentProblemId: null,
      currentChatSession: null,
      onboardingCompleted: false,

      // Actions
      setStudent: (student) => set({ student }),
      
      setLanguage: (language) => set({ currentLanguage: language }),
      

      
      setCurrentProblem: (problemId) => set({ currentProblemId: problemId }),
      
      joinChatSession: (session) => set({ currentChatSession: session }),
      
      leaveChatSession: () => set({ currentChatSession: null }),
      
      completeOnboarding: () => set({ onboardingCompleted: true }),
      
      clearUserData: () =>
        set({
          student: null,

          currentProblemId: null,
          currentChatSession: null,
          onboardingCompleted: false,
        }),
    }),
    {
      name: 'sahara-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        onboardingCompleted: state.onboardingCompleted,
        // Don't persist sensitive data like student info or chat sessions
      }),
    }
  )
);

/**
 * Screening calculation utilities
 * Implements standard PHQ-9 and GAD-7 scoring algorithms
 */

/**
 * Calculate PHQ-9 depression screening score
 * @param responses Array of screening responses
 * @returns Object with total score and severity classification
 */
export const calculatePHQ9Score = (responses: ScreeningResponse[]): { score: number; severity: string } => {
  const score = responses.reduce((total, response) => total + (Number(response.answer) || 0), 0);
  
  let severity: string;
  if (score >= 20) severity = 'severe';
  else if (score >= 15) severity = 'moderately_severe';
  else if (score >= 10) severity = 'moderate';
  else if (score >= 5) severity = 'mild';
  else severity = 'minimal';
  
  return { score, severity };
};

/**
 * Calculate GAD-7 anxiety screening score
 * @param responses Array of screening responses
 * @returns Object with total score and severity classification
 */
export const calculateGAD7Score = (responses: ScreeningResponse[]): { score: number; severity: string } => {
  const score = responses.reduce((total, response) => total + (Number(response.answer) || 0), 0);
  
  let severity: string;
  if (score >= 15) severity = 'severe';
  else if (score >= 10) severity = 'moderate';
  else if (score >= 5) severity = 'mild';
  else severity = 'minimal';
  
  return { score, severity };
};

/**?
 * Triage mapping rules as defined in the specification
 * Maps screening results and keywords to specific problem categories
 * @param phq9Score PHQ-9 depression score
 * @param gad7Score GAD-7 anxiety score
 * @param keywords Array of keywords from user responses
 * @param customResponses Additional custom question responses
 * @returns Problem category identifier for chat grouping
 */
export const mapToProblemInterface = (
  phq9Score: number,
  gad7Score: number,
  keywords: string[],
  customResponses: { [key: string]: any } = {}
): string => {
  const keywordString = keywords.join(' ').toLowerCase();
  
  // High anxiety + job/career keywords
  if (gad7Score >= 10 && /job|placement|interview|career|internship/.test(keywordString)) {
    return 'placement_career_anxiety';
  }
  
  // High depression + relationship keywords
  if (phq9Score >= 10 && /breakup|relationship|dating|partner|love/.test(keywordString)) {
    return 'relationship_issues';
  }
  
  // Sleep issues frequency
  if (customResponses.sleep_issue_frequency >= 3) {
    return 'sleep_burnout';
  }
  
  // Academic stress keywords
  if (/exam|study|grade|academic|assignment|test/.test(keywordString)) {
    return 'academic_stress';
  }
  
  // Family/personal keywords
  if (/family|home|parents|personal|conflict/.test(keywordString)) {
    return 'family_personal_issues';
  }
  
  // Social isolation keywords
  if (/lonely|isolation|friends|social|alone/.test(keywordString)) {
    return 'social_isolation';
  }
  
  // Default fallback
  return 'other_mixed';
};