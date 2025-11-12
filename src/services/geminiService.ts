import { GoogleGenerativeAI } from '@google/generative-ai';

// Read API key from environment; fall back to mock mode if missing
const API_KEY = (import.meta as any)?.env?.VITE_GEMINI_API_KEY as string | undefined;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  issueType?: string;
}

export interface MentalHealthIssue {
  type: string;
  label: string;
  description: string;
  prompt: string;
}

export const mentalHealthIssues: MentalHealthIssue[] = [
  {
    type: 'anxiety',
    label: 'Anxiety & Stress',
    description: 'Feeling overwhelmed, worried, or stressed about various situations',
    prompt: 'You are a compassionate mental health counselor specializing in anxiety and stress management. Provide supportive, evidence-based guidance while being empathetic and non-judgmental. Focus on practical coping strategies, breathing techniques, and mindfulness approaches.'
  },
  {
    type: 'relationships',
    label: 'Relationship Issues',
    description: 'Problems with friends, romantic partners, or social connections',
    prompt: 'You are a skilled relationship counselor who helps students navigate interpersonal challenges. Offer balanced perspectives, communication strategies, and healthy boundary-setting techniques. Be supportive while encouraging personal growth and self-reflection.'
  },
  {
    type: 'placement',
    label: 'Career & Placement Stress',
    description: 'Concerns about job prospects, career choices, or placement pressure',
    prompt: 'You are a career counselor and mental health professional who understands the unique pressures students face regarding placements and career decisions. Provide practical advice on managing career anxiety, building confidence, and developing resilience in the face of uncertainty.'
  },
  {
    type: 'family',
    label: 'Family Issues',
    description: 'Conflicts or challenges with family members and expectations',
    prompt: 'You are a family therapist who specializes in helping young adults navigate family dynamics and generational differences. Offer strategies for healthy communication, setting boundaries, and managing family expectations while maintaining relationships.'
  },
  {
    type: 'ragging',
    label: 'Bullying & Ragging',
    description: 'Experiencing harassment, bullying, or ragging from peers',
    prompt: 'You are a trauma-informed counselor who specializes in helping students deal with bullying, harassment, and ragging. Provide immediate emotional support, safety planning, and empowerment strategies. Encourage seeking help from authorities when appropriate and focus on building resilience and self-worth.'
  },
  {
    type: 'academic',
    label: 'Academic Pressure',
    description: 'Struggling with studies, exams, or academic performance',
    prompt: 'You are an educational psychologist who helps students manage academic stress and performance anxiety. Provide study strategies, time management techniques, and ways to cope with academic pressure while maintaining mental health.'
  },
  {
    type: 'financial',
    label: 'Financial Stress',
    description: 'Managing financial pressures, budgeting concerns, and money-related anxiety',
    prompt: 'You are a financial wellness counselor who understands the unique financial pressures students face. Provide practical budgeting advice, stress management techniques for financial anxiety, and guidance on accessing financial resources and support. Focus on building financial literacy and reducing money-related stress.'
  },
  {
    type: 'interfaith',
    label: 'Interfaith & Cultural Harmony',
    description: 'Navigating religious diversity, cultural differences, and promoting understanding',
    prompt: 'You are a counselor specializing in interfaith dialogue and cultural sensitivity. Help students navigate religious and cultural differences with respect and understanding. Provide guidance on building bridges across communities, managing cultural conflicts, and promoting harmony in diverse environments.'
  },
  {
    type: 'general',
    label: 'General Support',
    description: 'General mental health support and guidance',
    prompt: 'You are a compassionate mental health counselor providing general support to students. Listen actively, validate feelings, and offer appropriate guidance based on the specific concerns shared. Always prioritize safety and encourage professional help when needed.'
  }
];

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any;
  private chatSessions: Map<string, any> = new Map();
  private useMock = false;

  constructor() {
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      this.useMock = true;
      this.genAI = null;
      this.model = null;
      console.warn('Gemini API key missing; using offline counseling fallback.');
    }
  }

  async startChat(issueType: string = 'general'): Promise<{ sessionId: string; greeting: string }> {
    const sessionId = Date.now().toString();
    const issue = mentalHealthIssues.find(i => i.type === issueType) || mentalHealthIssues.find(i => i.type === 'general')!;
    
    const systemPrompt = `${issue.prompt}

Important guidelines:
- Always maintain a supportive, non-judgmental tone
- Provide practical, actionable advice
- Encourage professional help for serious issues
- Respect confidentiality and privacy
- Use simple, clear language
- Ask follow-up questions to better understand the situation
- Validate the student's feelings and experiences
- If the situation seems urgent or involves self-harm, immediately encourage contacting emergency services or campus counseling

You are now ready to help a student with ${issue.label.toLowerCase()}. Start with a warm, welcoming message.`;

    // Mock mode: provide immediate, local greeting without external calls
    if (this.useMock || !this.model) {
      const greeting = this.generateMockGreeting(issueType);
      this.chatSessions.set(sessionId, { chat: null, issueType, mock: true, history: [] });
      return { sessionId, greeting };
    }

    try {
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model',
            parts: [{ text: 'I understand. I\'m here to provide compassionate support and guidance. How can I help you today?' }]
          }
        ]
      });

      this.chatSessions.set(sessionId, { chat, issueType, mock: false, history: [] });
      
      // Generate initial greeting
      const result = await chat.sendMessage(`Please provide a warm, welcoming greeting for a student seeking help with ${issue.label.toLowerCase()}. Keep it brief and encouraging.`);
      const greeting = result.response.text();
      return { sessionId, greeting };
    } catch (error: any) {
      console.error('Error starting chat:', error);
      console.error('Error details:', error.message, error.stack);
      
      // Fall back to mock greeting instead of failing the session
      const greeting = this.generateMockGreeting(issueType);
      this.chatSessions.set(sessionId, { chat: null, issueType, mock: true, history: [] });
      return { sessionId, greeting };
    }
  }

  async sendMessage(sessionId: string, message: string): Promise<string> {
    const session = this.chatSessions.get(sessionId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    // Mock mode or session flagged as mock
    if (this.useMock || session.mock || !this.model || !session.chat) {
      // keep short memory in mock mode for better context
      if (session.history && Array.isArray(session.history)) {
        session.history.push({ role: 'user', content: message });
        session.history = session.history.slice(-5);
      } else {
        session.history = [{ role: 'user', content: message }];
      }

      // Generate tailored suggestions and build a contextual response
      const suggestions = await this.generateTailoredSuggestions(session.issueType, message);
      const keywords = this.extractKeywords(message);
      const pick = (arr: string[], count = 1) => this.pickStable(arr, count, message);
      const nowTips = pick(suggestions.immediateActions, 2);
      const longTip = pick(suggestions.longTermStrategies, 1)[0];
      const followUps = [
        'Would you like me to guide you through one of these steps?',
        'Does one of these feel doable right now?',
        'We can break this down together—shall we start with the first step?',
        'I can share more coping tools if you’d like.'
      ];
      const followUp = pick(followUps, 1)[0];

      const reflect = keywords.length
        ? `From what you shared about ${keywords.join(', ')}, `
        : '';

      return `${reflect}here are two things you can try now: • ${nowTips[0]} • ${nowTips[1]}. Longer term, consider: ${longTip}. ${followUp}`;
    }

    try {
      const result = await session.chat.sendMessage(message);
      const response = result.response.text();
      return response;
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.message, error.stack);
      
      // Fall back to mock response if the API call fails
      return this.generateMockResponse(session.issueType, message);
    }
  }

  async categorizeIssue(message: string): Promise<string> {
    // Offline categorization when model unavailable
    if (!this.model) {
      const text = message.toLowerCase();
      const checks: { key: string; words: string[] }[] = [
        { key: 'anxiety', words: ['anxious', 'panic', 'overwhelm', 'stress', 'worried'] },
        { key: 'relationships', words: ['friend', 'partner', 'relationship', 'breakup', 'lonely'] },
        { key: 'placement', words: ['job', 'career', 'placement', 'interview', 'internship'] },
        { key: 'family', words: ['parent', 'mother', 'father', 'family', 'home'] },
        { key: 'ragging', words: ['bully', 'ragging', 'harass', 'abuse'] },
        { key: 'academic', words: ['exam', 'grade', 'study', 'assignment', 'performance'] }
      ];
      for (const c of checks) {
        if (c.words.some(w => text.includes(w))) return c.key;
      }
      return 'general';
    }
    try {
      const prompt = `Analyze the following message and categorize it into one of these mental health issue types:
- anxiety: anxiety, stress, worry, panic, overwhelm
- relationships: friendship, dating, social, interpersonal, loneliness
- placement: career, job, internship, placement, future, employment
- family: family, parents, siblings, home, expectations
- ragging: bullying, harassment, ragging, intimidation, abuse
- academic: studies, exams, grades, performance, learning
- general: any other mental health concern

Message: "${message}"

Respond with only the category name (one word).`;

      const result = await this.model.generateContent(prompt);
      const category = result.response.text().trim().toLowerCase();
      
      // Validate the category
      const validCategories = mentalHealthIssues.map(issue => issue.type);
      return validCategories.includes(category) ? category : 'general';
    } catch (error) {
      console.error('Error categorizing issue:', error);
      return 'general';
    }
  }

  async analyzeConversationContext(conversationHistory: ChatMessage[]): Promise<{
    primaryIssues: string[];
    emotionalState: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
    suggestedResources: string[];
    followUpQuestions: string[];
  }> {
    // Offline fallback
    if (!this.model) {
      return {
        primaryIssues: ['general'],
        emotionalState: 'unknown',
        urgencyLevel: 'low',
        suggestedResources: ['Campus counseling services', 'Breathing exercises', 'Peer support groups'],
        followUpQuestions: ['Would you like to share a bit more about how you’re feeling?']
      };
    }
    try {
      const messages = conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      
      const prompt = `Analyze this conversation between a student and a mental health counselor. Provide insights in JSON format:

Conversation:
${messages}

Analyze and respond with a JSON object containing:
{
  "primaryIssues": ["array of main issues identified"],
  "emotionalState": "current emotional state (anxious/depressed/stressed/overwhelmed/calm/etc.)",
  "urgencyLevel": "low/medium/high/crisis",
  "suggestedResources": ["array of specific resources that would help"],
  "followUpQuestions": ["array of thoughtful questions to ask next"]
}

Focus on identifying patterns, emotional indicators, and specific concerns mentioned.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      const analysis = JSON.parse(response.replace(/```json|```/g, '').trim());
      return analysis;
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      return {
        primaryIssues: ['general'],
        emotionalState: 'unknown',
        urgencyLevel: 'low',
        suggestedResources: ['General mental health support'],
        followUpQuestions: ['How are you feeling right now?']
      };
    }
  }

  async generateTailoredSuggestions(issueType: string, conversationContext: string): Promise<{
    immediateActions: string[];
    longTermStrategies: string[];
    resources: string[];
    professionalHelp: boolean;
  }> {
    // Offline fallback
    if (!this.model) {
      return {
        immediateActions: ['Take deep breaths', 'Step away for a short walk', 'Write down your thoughts'],
        longTermStrategies: ['Establish a routine', 'Practice mindfulness', 'Talk to a trusted person weekly'],
        resources: ['Campus counseling services', 'Headspace or Calm', 'Study groups and peer circles'],
        professionalHelp: false
      };
    }
    try {
      const issue = mentalHealthIssues.find(i => i.type === issueType) || mentalHealthIssues.find(i => i.type === 'general')!;
      
      const prompt = `Based on the conversation context and the identified issue type "${issue.label}", provide tailored suggestions in JSON format:

Context: ${conversationContext}
Issue Type: ${issue.label} - ${issue.description}

Provide a JSON response with:
{
  "immediateActions": ["3-5 immediate coping strategies"],
  "longTermStrategies": ["3-5 long-term approaches"],
  "resources": ["specific resources, apps, or techniques"],
  "professionalHelp": true/false (whether professional help is recommended)
}

Make suggestions specific, actionable, and appropriate for college students.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const suggestions = JSON.parse(response.replace(/```json|```/g, '').trim());
      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return {
        immediateActions: ['Take deep breaths', 'Find a quiet space', 'Reach out to someone you trust'],
        longTermStrategies: ['Establish a routine', 'Practice self-care', 'Build a support network'],
        resources: ['Campus counseling services', 'Mental health apps', 'Peer support groups'],
        professionalHelp: false
      };
    }
  }

  async detectCrisisIndicators(message: string): Promise<{
    isCrisis: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'immediate';
    indicators: string[];
    recommendedAction: string;
  }> {
    // Offline keyword-based detection
    if (!this.model) {
      const text = message.toLowerCase();
      const crisisWords = ['suicide', 'kill myself', 'end it', 'self-harm', 'cutting', 'hopeless', 'can\'t go on'];
      const isCrisis = crisisWords.some(w => text.includes(w));
      return {
        isCrisis,
        riskLevel: isCrisis ? 'high' : 'low',
        indicators: crisisWords.filter(w => text.includes(w)),
        recommendedAction: isCrisis ? 'Contact emergency services and campus counseling immediately' : 'Continue supportive conversation'
      };
    }
    try {
      const prompt = `Analyze this message for crisis indicators related to self-harm, suicide, or immediate danger:

Message: "${message}"

Respond with JSON:
{
  "isCrisis": true/false,
  "riskLevel": "low/medium/high/immediate",
  "indicators": ["specific concerning phrases or themes"],
  "recommendedAction": "immediate action to recommend"
}

Look for: suicidal ideation, self-harm mentions, hopelessness, immediate danger, substance abuse crisis.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const analysis = JSON.parse(response.replace(/```json|```/g, '').trim());
      return analysis;
    } catch (error) {
      console.error('Error detecting crisis indicators:', error);
      return {
        isCrisis: false,
        riskLevel: 'low',
        indicators: [],
        recommendedAction: 'Continue supportive conversation'
      };
    }
  }

  endChat(sessionId: string): void {
    this.chatSessions.delete(sessionId);
  }

  getActiveSessionsCount(): number {
    return this.chatSessions.size;
  }

  // --- Helpers for mock mode ---
  private generateMockGreeting(issueType: string): string {
    const issue = mentalHealthIssues.find(i => i.type === issueType) || mentalHealthIssues.find(i => i.type === 'general')!;
    const greetings: Record<string, string> = {
      anxiety: "Hi, I'm here for you. We can take this one step at a time. Would you like to start with a few grounding breaths?",
      relationships: "Hey, thanks for reaching out. Relationships can be complicated—I'm here to listen and help you sort through things.",
      placement: "Hi! Placement stress is really common and totally valid. Let’s talk through it and find some practical steps.",
      family: "Hello—family dynamics can be tough. We’ll navigate this together at your pace.",
      ragging: "I’m really sorry you’re facing this. Your safety matters. I’ll support you and share options to keep you safe.",
      academic: "Hi! Academic pressure is real. We can explore strategies to make things more manageable.",
      general: "Hi there. I’m here to support you with whatever you’re going through. How are you feeling today?"
    };
    return greetings[issue.type] || greetings.general;
  }

  private generateMockResponse(issueType: string, message: string): string {
    const text = message.toLowerCase();
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();

    if (/(suicide|kill myself|end it|self-harm|cutting)/.test(text)) {
      return normalize("I’m very concerned by what you shared. Your safety matters most. Please reach out immediately: call emergency services (911) or your campus helpline. I can stay with you here while you get help—you’re not alone.");
    }

    if (/(panic|anxious|overwhelm|stress|stressed|worry|worried)/.test(text)) {
      return normalize("That sounds really overwhelming. Let’s try a quick grounding exercise: breathe in for 4 seconds, hold for 4, and out for 6. Would you like more coping strategies for anxiety?");
    }

    if (/(exam|grades|study|assignment|deadline|performance)/.test(text)) {
      return normalize("Academic pressure can be intense. We can create a small, realistic plan together. What’s the next task you’d like help breaking down?");
    }

    if (/(relationship|breakup|friend|lonely|alone)/.test(text)) {
      return normalize("Thanks for sharing that—it takes courage. Would you like to talk about what happened and what you need most right now?");
    }

    if (/(job|career|placement|interview|internship)/.test(text)) {
      return normalize("Career stress is common. Let’s focus on one step: practice, support, and perspective. What upcoming challenge feels biggest right now?");
    }

    if (/(family|parent|mother|father|home|expectations)/.test(text)) {
      return normalize("Family expectations can be tough. We can explore boundaries and communication strategies at your pace. What’s one situation you’d like to unpack?");
    }

    return normalize("Thank you for sharing. I’m here to listen and support you. Would you like coping strategies, or to explore this a bit more together?");
  }
}

export const geminiService = new GeminiService();
export default geminiService;