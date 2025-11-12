import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  MessageCircle,
  Users,
  Image as ImageIcon,
  Send,
  Heart,
  MessageSquare,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  Plus,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useKhushMehtabChat } from '../../hooks/useKhushMehtabChat';
import { useToast } from '../../hooks/use-toast';

interface KhushMehtabAddaProps {
  className?: string;
}

const KhushMehtabAdda: React.FC<KhushMehtabAddaProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isConnected,
    isLoading,
    error,
    groupChats,
    selectedChat,
    messages,
    typingUsers,
    onlineUsers,
    unreadCounts,
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
  } = useKhushMehtabChat();
  
  // State management
  const [activeTab, setActiveTab] = useState('group-chat');
  const [newMessage, setNewMessage] = useState('');
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newChatTopic, setNewChatTopic] = useState('');
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [selectedReportReason, setSelectedReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-connect on component mount
  useEffect(() => {
    if (user && !isConnected && !isLoading) {
      connectToChat();
    }
  }, [user, isConnected, isLoading, connectToChat]);

  // Event handlers
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      toast({
        title: "Cannot Send Message",
        description: "Please select a chat and enter a message.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await sendMessage(newMessage, isAnonymous, selectedFiles);
      setNewMessage('');
      setSelectedFiles([]);
      setIsAnonymous(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCreateAnonymousChat = async () => {
    if (!newChatTopic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for the anonymous chat.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createAnonymousChat(newChatTopic);
      setNewChatTopic('');
      setShowCreateChat(false);
      setActiveTab('group-chat');
    } catch (error) {
      console.error('Failed to create anonymous chat:', error);
    }
  };

  const handleCreateAnonymousPost = async () => {
    if (!newPost.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content for your anonymous post.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create or join the anonymous posts channel
      if (!selectedChat || selectedChat.name !== 'Anonymous Posts') {
        await createAnonymousChat('Anonymous Posts');
      }
      
      // Send the anonymous post
      await sendMessage(newPost, true, selectedFiles);
      setNewPost('');
      setSelectedFiles([]);
      
      toast({
        title: "Posted Successfully",
        description: "Your anonymous post has been shared with the community.",
      });
    } catch (error) {
      console.error('Failed to create anonymous post:', error);
      toast({
        title: "Error",
        description: "Failed to post anonymously. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleLike = async (messageId: string) => {
    try {
      const message = messages.find(m => m.id === messageId);
      const hasLiked = message?.reactions?.some(r => r.type === 'like' && r.users.includes(user?.id || ''));
      
      if (hasLiked) {
        console.log('Remove like for message:', messageId);
      } else {
        await addReaction(messageId, 'like');
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };
  
  const handleReport = (messageId: string) => {
    setReportingMessageId(messageId);
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!reportingMessageId || !selectedReportReason) {
      toast({
        title: "Report Incomplete",
        description: "Please select a reason for reporting.",
        variant: "destructive"
      });
      return;
    }

    try {
      const reportReason = selectedReportReason === 'Other (please specify)' 
        ? reportDetails 
        : selectedReportReason;
      
      await reportMessage(reportingMessageId, reportReason);
      
      toast({
        title: "Message Reported",
        description: "Thank you for helping keep our community safe. Our moderators will review this report.",
      });
      
      // Reset form
      setShowReportModal(false);
      setReportingMessageId(null);
      setSelectedReportReason('');
      setReportDetails('');
    } catch (error) {
      console.error('Failed to report message:', error);
      toast({
        title: "Report Failed",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const cancelReport = () => {
    setShowReportModal(false);
    setReportingMessageId(null);
    setSelectedReportReason('');
    setReportDetails('');
  };

  const handleReportMessage = async (messageId: string) => {
    handleReport(messageId);
  };

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Community Guidelines with categories and enforcement
  const communityGuidelines = {
    respect: {
      title: "🤝 Respect & Kindness",
      rules: [
        "Be respectful and supportive to all community members",
        "Use inclusive language and avoid discriminatory comments",
        "Respect different perspectives and experiences",
        "No harassment, bullying, or personal attacks"
      ]
    },
    privacy: {
      title: "🔒 Privacy & Safety",
      rules: [
        "Never share personal information (phone, address, full name)",
        "Respect others' privacy and confidentiality",
        "Use content warnings for sensitive mental health topics",
        "Report any safety concerns immediately"
      ]
    },
    content: {
      title: "📝 Content Guidelines",
      rules: [
        "Keep discussions relevant to student wellness and support",
        "No spam, promotional content, or off-topic posts",
        "Avoid sharing graphic or triggering content without warnings",
        "Use appropriate language suitable for all ages"
      ]
    },
    enforcement: {
      title: "⚖️ Enforcement Policy",
      rules: [
        "First violation: Warning and guidance",
        "Second violation: 24-hour temporary suspension",
        "Third violation: 7-day suspension",
        "Severe violations: Immediate permanent ban"
      ]
    }
  };

  const reportReasons = [
    "Harassment or bullying",
    "Inappropriate content",
    "Spam or promotional content",
    "Privacy violation",
    "Hate speech or discrimination",
    "Self-harm or dangerous content",
    "Other (please specify)"
  ];

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to access Khush Mehtab Adda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Khush Mehtab Adda</CardTitle>
                <p className="text-sm text-gray-600">Connect with fellow students in a safe space</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Connecting..."}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshChats}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={connectToChat}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Retry Connection'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Community Guidelines</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGuidelines(!showGuidelines)}
            >
              {showGuidelines ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showGuidelines && (
          <CardContent>
            <div className="space-y-6">
              {Object.entries(communityGuidelines).map(([key, category]) => (
                <div key={key} className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800 border-b pb-1">
                    {category.title}
                  </h4>
                  <div className="space-y-2">
                    {category.rules.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                        <p className="text-xs text-gray-700">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-sm text-red-800">Report Violations</span>
                </div>
                <p className="text-xs text-red-700 mb-2">
                  Help keep our community safe by reporting inappropriate behavior.
                </p>
                <div className="flex flex-wrap gap-1">
                  {reportReasons.slice(0, 3).map((reason, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">+{reportReasons.length - 3} more</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="group-chat" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Group Chats</span>
                </TabsTrigger>
                <TabsTrigger value="anonymous-posts" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Anonymous Posts</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Group Chat Tab */}
            <TabsContent value="group-chat" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat List */}
                <div className="lg:col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Available Chats</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateChat(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showCreateChat && (
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Input
                            placeholder="Enter topic for anonymous chat"
                            value={newChatTopic}
                            onChange={(e) => setNewChatTopic(e.target.value)}
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={handleCreateAnonymousChat}
                              disabled={isLoading}
                            >
                              Create
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCreateChat(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {groupChats.map((chat) => (
                        <Card
                          key={chat.id}
                          className={`cursor-pointer transition-colors ${
                            selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            handleChatSelect(chat.id);
                            markAsRead(chat.id);
                          }}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-sm">{chat.name}</h4>
                                {unreadCounts[chat.id] > 0 && (
                                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                    {unreadCounts[chat.id]}
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {chat.memberCount}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{chat.university}</p>
                            {chat.lastMessage && (
                              <p className={`text-xs truncate ${
                                unreadCounts[chat.id] > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                              }`}>{chat.lastMessage}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTimestamp(chat.lastActivity)}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Messages */}
                <div className="lg:col-span-2">
                  {selectedChat ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{selectedChat.name}</h3>
                          {typingUsers.length > 0 && (
                            <p className="text-xs text-gray-500 italic">
                              {typingUsers.length === 1 
                                ? `${typingUsers[0]} is typing...`
                                : `${typingUsers.length} people are typing...`
                              }
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{selectedChat.memberCount} members</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {onlineUsers.length} online
                          </Badge>
                        </div>
                      </div>
                      
                      <ScrollArea className="h-96 border rounded-lg p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div key={message.id} className="flex space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.user.avatar} />
                                <AvatarFallback>
                                  {message.isAnonymous ? 'A' : message.user.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {message.isAnonymous ? 'Anonymous Student' : message.user.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(message.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{message.text}</p>
                                
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="space-y-2 mb-2">
                                    {message.attachments.map((attachment, index) => (
                                      <div key={index}>
                                        {attachment.type === 'image' ? (
                                          <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            className="max-w-xs rounded-lg"
                                          />
                                        ) : (
                                          <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                                            <ImageIcon className="h-4 w-4" />
                                            <span className="text-sm">{attachment.name}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex items-center space-x-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleLike(message.id)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <Heart className="h-4 w-4" />
                                    <span className="ml-1 text-xs">
                                      {message.reactions?.find(r => r.type === 'like')?.count || 0}
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReportMessage(message.id)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      {/* Message Input */}
                      <div className="space-y-3">
                        {selectedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded px-2 py-1">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="anonymous"
                              checked={isAnonymous}
                              onChange={(e) => setIsAnonymous(e.target.checked)}
                              className="rounded"
                            />
                            <label htmlFor="anonymous" className="text-sm text-gray-600">
                              Anonymous
                            </label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => {
                              setNewMessage(e.target.value);
                              if (e.target.value.length > 0) {
                                startTyping();
                              } else {
                                stopTyping();
                              }
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                stopTyping();
                                handleSendMessage();
                              }
                            }}
                            onBlur={() => stopTyping()}
                            className="flex-1"
                            rows={2}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !newMessage.trim()}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Chat</h3>
                      <p className="text-gray-500">Choose a chat from the list to start messaging</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Anonymous Posts Tab */}
            <TabsContent value="anonymous-posts" className="p-6">
              <div className="space-y-6">
                {/* Anonymous Post Creation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span>Share Anonymously</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Your identity is completely protected. Share your thoughts, concerns, or experiences safely.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Share something on your mind anonymously... You can discuss challenges, seek advice, or offer support to others."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    
                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded px-3 py-2">
                            <ImageIcon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-auto p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Add Media
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Anonymous
                        </Badge>
                      </div>
                      <Button
                        onClick={handleCreateAnonymousPost}
                        disabled={isLoading || !newPost.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Post Anonymously
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Anonymous Posts Feed */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Community Posts</h3>
                    <Badge variant="outline">
                      {messages.filter(m => m.isAnonymous).length} Anonymous Posts
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {messages
                        .filter(message => message.isAnonymous)
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((message) => (
                        <Card key={message.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                      A
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="font-medium text-sm">Anonymous Student</span>
                                    <p className="text-xs text-gray-500">
                                       University Student
                                     </p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(message.created_at)}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 leading-relaxed">{message.text}</p>
                              
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="space-y-2">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index}>
                                      {attachment.type === 'image' ? (
                                        <img
                                          src={attachment.url}
                                          alt={attachment.name}
                                          className="max-w-sm rounded-lg border"
                                        />
                                      ) : (
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                                          <ImageIcon className="h-5 w-5 text-gray-600" />
                                          <span className="text-sm font-medium">{attachment.name}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center space-x-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleLike(message.id)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <Heart className="h-4 w-4 mr-1" />
                                    <span className="text-sm">
                                      {message.reactions?.find(r => r.type === 'like')?.count || 0} Support
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-blue-500"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    <span className="text-sm">Reply</span>
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReportMessage(message.id)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                  <span className="text-sm">Report</span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {messages.filter(m => m.isAnonymous).length === 0 && (
                        <div className="text-center py-12">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-600 mb-2">No Anonymous Posts Yet</h3>
                          <p className="text-gray-500">Be the first to share something anonymously with the community</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Report Content</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Reason for reporting:</label>
              <Select value={selectedReportReason} onValueChange={setSelectedReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedReportReason === 'Other (please specify)' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Please specify:</label>
                <Textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe the issue..."
                  className="min-h-[80px]"
                />
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> False reports may result in restrictions on your account. 
                Reports are reviewed by our moderation team within 24 hours.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={cancelReport}>
              Cancel
            </Button>
            <Button 
              onClick={submitReport}
              disabled={!selectedReportReason}
              className="bg-red-600 hover:bg-red-700"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KhushMehtabAdda;