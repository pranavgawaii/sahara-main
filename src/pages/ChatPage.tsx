import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  Shield, 
  AlertTriangle,
  MessageCircle,
  Smile,
  Heart,
  Brain,
  Loader2
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { geminiService, mentalHealthIssues, type ChatMessage } from '@/services/geminiService';

const ChatPage = () => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { student, currentProblemId } = useStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string>('general');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Category mapping for mental health support
  const categoryMapping: { [key: string]: string } = {
    'anxiety': 'anxiety',
    'career': 'placement',
    'family': 'family',
    'relationship': 'relationships',
    'financial': 'financial',
    'anti-ragging': 'ragging',
    'interfaith': 'interfaith'
  };

  // Initialize selected issue based on URL parameter
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categoryMapping[category]) {
      setSelectedIssue(categoryMapping[category]);
    }
  }, [searchParams]);

  // Initialize chat session
  const startChatSession = async () => {
    if (chatStarted) return;
    
    setIsLoading(true);
    try {
      const { sessionId: newSessionId, greeting } = await geminiService.startChat(selectedIssue);
      setSessionId(newSessionId);
      
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      setChatStarted(true);
    } catch (error) {
      console.error('Failed to start chat:', error);
      const errorMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startChatSession();
  }, [selectedIssue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionId || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Check for crisis indicators first
      const crisisAnalysis = await geminiService.detectCrisisIndicators(userMessage.content);
      
      if (crisisAnalysis.isCrisis && crisisAnalysis.riskLevel === 'immediate') {
        const crisisMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out immediately to:\n\n🚨 **Emergency Services: 911**\n📞 **Crisis Hotline: 988**\n🏥 **Campus Emergency: [Your Campus Number]**\n\nI'm here to support you, but please get immediate professional help. You don't have to go through this alone.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, crisisMessage]);
        setIsLoading(false);
        setIsTyping(false);
        return;
      }
      
      // Get regular response
      const response = await geminiService.sendMessage(sessionId, userMessage.content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        
        // Analyze conversation context after a few exchanges
        if (updatedMessages.length >= 6) {
          analyzeConversationAndProvideInsights(updatedMessages);
        }
        
        return updatedMessages;
      });
      
      // Dynamic issue categorization
      if (messages.length >= 2) {
        const detectedIssue = await geminiService.categorizeIssue(userMessage.content);
        if (detectedIssue !== selectedIssue && detectedIssue !== 'general') {
          const issueInfo = mentalHealthIssues.find(issue => issue.type === detectedIssue);
          if (issueInfo) {
            const suggestionMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: `I notice you might be dealing with ${issueInfo.label.toLowerCase()}. Would you like me to adjust our conversation to focus more specifically on this area? I can provide more targeted support and resources.`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, suggestionMessage]);
          }
        }
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m sorry, I\'m having trouble responding right now. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };
  
  const analyzeConversationAndProvideInsights = async (conversationHistory: ChatMessage[]) => {
    try {
      const analysis = await geminiService.analyzeConversationContext(conversationHistory);
      
      if (analysis.urgencyLevel === 'high' || analysis.urgencyLevel === 'crisis') {
        const urgentMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I want to check in with you. Based on our conversation, I'm sensing this might be particularly challenging for you right now. Remember that seeking additional support is a sign of strength. Would you like me to share some immediate resources that might help?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, urgentMessage]);
      }
      
      // Provide tailored suggestions periodically
      if (conversationHistory.length % 8 === 0) {
        const suggestions = await geminiService.generateTailoredSuggestions(
          selectedIssue,
          conversationHistory.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')
        );
        
        const suggestionsMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Based on our conversation, here are some personalized suggestions:\n\n**Immediate steps you can try:**\n${suggestions.immediateActions.map(action => `• ${action}`).join('\n')}\n\n**Helpful resources:**\n${suggestions.resources.map(resource => `• ${resource}`).join('\n')}\n\nWould you like to explore any of these further?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionsMessage]);
      }
    } catch (error) {
      console.error('Error analyzing conversation:', error);
    }
  };

  const handleIssueChange = (value: string) => {
    setSelectedIssue(value);
    setMessages([]);
    setSessionId(null);
    setChatStarted(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'assistant' ? <Bot className="w-3 h-3 text-primary" /> : <Brain className="w-3 h-3 text-muted-foreground" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-border/50 glass-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">AI Mental Health Counselor</h1>
                <p className="text-sm text-muted-foreground">
                  {mentalHealthIssues.find(issue => issue.type === selectedIssue)?.label || 'General Support'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedIssue} onValueChange={handleIssueChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {mentalHealthIssues.map((issue) => (
                  <SelectItem key={issue.type} value={issue.type}>
                    {issue.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Confidential
            </Badge>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 h-[calc(100vh-140px)] flex flex-col">
        {/* Safety Notice */}
        <Card className="glass-card p-4 mb-6 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Confidential AI Counseling</p>
              <p className="text-sm text-muted-foreground">
                This is a safe, confidential space. The AI counselor is here to provide support and guidance for your mental health concerns.
              </p>
            </div>
          </div>
        </Card>

        {/* Messages Area */}
        <Card className="glass-card flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${chatStarted ? 'bg-success' : 'bg-warning'} animate-pulse`} />
              <span className="text-sm text-muted-foreground">
                {chatStarted ? 'Connected to AI Counselor' : 'Initializing AI Counselor...'}
              </span>
              {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex flex-col gap-1 ${
                      msg.role === 'user' 
                        ? 'items-end' 
                        : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {msg.role === 'user' ? 'You' : 'AI Counselor'}
                      </Badge>
                      {getRoleIcon(msg.role)}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-card text-card-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Someone is typing...</span>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-3">
              <Input
                placeholder={chatStarted ? "Share what's on your mind..." : "Connecting to AI counselor..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                maxLength={1000}
                disabled={!chatStarted || isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || !chatStarted || isLoading}
                className="px-4"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Your conversations are confidential and secure
              </p>
              <p className="text-xs text-muted-foreground">
                {message.length}/1000 characters
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;