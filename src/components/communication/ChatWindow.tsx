import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Shield, Lock } from 'lucide-react';
import { vonageService, ChatSession } from '../../services/vonageService';
import { useAuthStore } from '../../stores/authStore';

interface ChatWindowProps {
  counselorId: string;
  counselorName: string;
  onClose: () => void;
}

interface Message {
  messageId: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string;
  sessionId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ counselorId, counselorName, onClose }) => {
  const { user } = useAuthStore();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, [counselorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Poll for new messages every 2 seconds
    const interval = setInterval(() => {
      if (session) {
        loadMessages();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [session]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    if (!user) return;
    
    try {
      setIsConnecting(true);
      const chatSession = await vonageService.createChatSession([user.id, counselorId]);
      setSession(chatSession);
      await loadMessages();
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const loadMessages = async () => {
    if (!session) return;
    
    try {
      const chatMessages = await vonageService.getChatMessages(session.id);
      setMessages(chatMessages.map(msg => ({
        messageId: msg.id,
        senderId: msg.senderId,
        recipientId: counselorId,
        message: msg.content,
        sessionId: session.id,
        timestamp: msg.timestamp.toISOString()
      })));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !user) return;
    
    setIsLoading(true);
    try {
      await vonageService.sendMessage(
        session.id,
        user.id,
        newMessage
      );
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEndChat = async () => {
    if (session) {
      await vonageService.endChatSession(session.id);
    }
    onClose();
  };

  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to {counselorName}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">{counselorName.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold">{counselorName}</h3>
              <div className="flex items-center space-x-2 text-sm text-blue-100">
                <Shield className="w-4 h-4" />
                <span>Secure Chat</span>
                <Lock className="w-3 h-3" />
              </div>
            </div>
          </div>
          <button
            onClick={handleEndChat}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Start a conversation with {counselorName}</p>
              <p className="text-sm mt-2">Your messages are encrypted and secure</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.messageId}
                className={`flex ${
                  message.senderId === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <Lock className="w-3 h-3 mr-1" />
            Messages are encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;