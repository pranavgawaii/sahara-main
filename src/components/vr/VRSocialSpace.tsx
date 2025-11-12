import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Send, 
  UserPlus, 
  UserMinus, 
  Settings, 
  Hand, 
  Heart, 
  Smile, 
  ThumbsUp, 
  Coffee, 
  BookOpen, 
  Music, 
  Gamepad2, 
  Video, 
  Phone, 
  Share, 
  Crown, 
  Shield, 
  Eye, 
  EyeOff,
  MoreHorizontal,
  LogOut,
  UserCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Headphones
} from 'lucide-react';
import { vrService } from '@/services/vrService';
import { useStore } from '@/stores/useStore';
import { useTranslation } from 'react-i18next';

interface VRUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  role: 'participant' | 'moderator' | 'counselor';
  joinedAt: Date;
  position: { x: number; y: number; z: number };
  status: 'active' | 'away' | 'busy';
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'system';
}

interface VRRoom {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'therapy';
  maxParticipants: number;
  currentParticipants: number;
  environment: string;
  activities: string[];
  moderator?: string;
  isPasswordProtected: boolean;
  tags: string[];
}

interface VRSocialSpaceProps {
  onRoomJoin?: (room: VRRoom) => void;
  onRoomLeave?: () => void;
}

const SAMPLE_ROOMS: VRRoom[] = [
  {
    id: 'study-lounge',
    name: 'Study Lounge',
    description: 'Quiet space for focused studying and academic discussions',
    type: 'public',
    maxParticipants: 12,
    currentParticipants: 7,
    environment: 'library',
    activities: ['Study Groups', 'Q&A Sessions', 'Note Sharing'],
    isPasswordProtected: false,
    tags: ['study', 'academic', 'quiet']
  },
  {
    id: 'wellness-circle',
    name: 'Wellness Circle',
    description: 'Supportive community for mental health discussions',
    type: 'public',
    maxParticipants: 8,
    currentParticipants: 5,
    environment: 'garden',
    activities: ['Group Therapy', 'Meditation', 'Peer Support'],
    moderator: 'Dr. Sarah Wilson',
    isPasswordProtected: false,
    tags: ['wellness', 'support', 'therapy']
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    description: 'Collaborative space for art, music, and creative expression',
    type: 'public',
    maxParticipants: 10,
    currentParticipants: 3,
    environment: 'art-studio',
    activities: ['Art Creation', 'Music Jam', 'Creative Writing'],
    isPasswordProtected: false,
    tags: ['creative', 'art', 'music']
  },
  {
    id: 'game-arena',
    name: 'Game Arena',
    description: 'Fun gaming space for recreational activities',
    type: 'public',
    maxParticipants: 16,
    currentParticipants: 12,
    environment: 'arcade',
    activities: ['VR Games', 'Tournaments', 'Team Challenges'],
    isPasswordProtected: false,
    tags: ['gaming', 'fun', 'competitive']
  },
  {
    id: 'private-session',
    name: 'Private Counseling',
    description: 'One-on-one therapy session with licensed counselor',
    type: 'therapy',
    maxParticipants: 2,
    currentParticipants: 0,
    environment: 'therapy-room',
    activities: ['Individual Therapy', 'Crisis Support'],
    moderator: 'Dr. Michael Chen',
    isPasswordProtected: true,
    tags: ['private', 'therapy', 'counseling']
  }
];

const SAMPLE_USERS: VRUser[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    isOnline: true,
    isSpeaking: false,
    isMuted: false,
    isCameraOn: true,
    role: 'participant',
    joinedAt: new Date(Date.now() - 300000),
    position: { x: 0, y: 0, z: 0 },
    status: 'active'
  },
  {
    id: 'user2',
    name: 'Sarah Kim',
    isOnline: true,
    isSpeaking: true,
    isMuted: false,
    isCameraOn: true,
    role: 'moderator',
    joinedAt: new Date(Date.now() - 600000),
    position: { x: 2, y: 0, z: 1 },
    status: 'active'
  },
  {
    id: 'user3',
    name: 'Mike Rodriguez',
    isOnline: true,
    isSpeaking: false,
    isMuted: true,
    isCameraOn: false,
    role: 'participant',
    joinedAt: new Date(Date.now() - 150000),
    position: { x: -1, y: 0, z: 2 },
    status: 'away'
  }
];

export const VRSocialSpace: React.FC<VRSocialSpaceProps> = ({ onRoomJoin, onRoomLeave }) => {
  const { t } = useTranslation(['common', 'ui']);
  const { student } = useStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Room state
  const [currentRoom, setCurrentRoom] = useState<VRRoom | null>(null);
  const [availableRooms, setAvailableRooms] = useState<VRRoom[]>(SAMPLE_ROOMS);
  const [isJoining, setIsJoining] = useState(false);
  const [roomFilter, setRoomFilter] = useState<'all' | 'public' | 'private' | 'therapy'>('all');
  
  // User state
  const [connectedUsers, setConnectedUsers] = useState<VRUser[]>(SAMPLE_USERS);
  const [currentUser, setCurrentUser] = useState<VRUser>({
    id: student?.ephemeralHandle || 'current-user',
    name: student?.ephemeralHandle || 'You',
    isOnline: true,
    isSpeaking: false,
    isMuted: false,
    isCameraOn: true,
    role: 'participant',
    joinedAt: new Date(),
    position: { x: 0, y: 0, z: 0 },
    status: 'active'
  });
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      userName: 'System',
      message: 'Welcome to the VR Social Space! Feel free to interact with others.',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  
  // UI state
  const [showUserList, setShowUserList] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState<VRUser | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Join a VR room
  const joinRoom = async (room: VRRoom) => {
    setIsJoining(true);
    
    try {
      // Start VR session for the room
      await vrService.startVRSession(room.id, 'social');
      
      setCurrentRoom(room);
      
      // Add system message
      const joinMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        message: `${currentUser.name} joined the room`,
        timestamp: new Date(),
        type: 'system'
      };
      setChatMessages(prev => [...prev, joinMessage]);
      
      onRoomJoin?.(room);
      
      console.log('Joined VR room:', room.name);
    } catch (error) {
      console.error('Failed to join VR room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  // Leave current room
  const leaveRoom = async () => {
    if (!currentRoom) return;
    
    try {
      await vrService.endVRSession();
      
      // Add system message
      const leaveMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        message: `${currentUser.name} left the room`,
        timestamp: new Date(),
        type: 'system'
      };
      setChatMessages(prev => [...prev, leaveMessage]);
      
      setCurrentRoom(null);
      onRoomLeave?.();
      
      console.log('Left VR room');
    } catch (error) {
      console.error('Failed to leave VR room:', error);
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !currentRoom) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Send emoji reaction
  const sendEmoji = (emoji: string) => {
    if (!currentRoom) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      message: emoji,
      timestamp: new Date(),
      type: 'emoji'
    };
    
    setChatMessages(prev => [...prev, message]);
  };

  // Toggle user controls
  const toggleMute = () => {
    setCurrentUser(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleCamera = () => {
    setCurrentUser(prev => ({ ...prev, isCameraOn: !prev.isCameraOn }));
  };

  // Filter rooms
  const filteredRooms = roomFilter === 'all' 
    ? availableRooms 
    : availableRooms.filter(room => room.type === roomFilter);

  // Get room type color
  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-500';
      case 'private': return 'bg-blue-500';
      case 'therapy': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Get user status color
  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentRoom) {
    // Room selection view
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">VR Social Spaces</h2>
          <p className="text-purple-200">
            Connect with peers in immersive virtual environments designed for social interaction and support
          </p>
        </div>

        {/* Room Filter */}
        <div className="flex gap-2">
          {[
            { id: 'all', name: 'All Rooms', icon: Users },
            { id: 'public', name: 'Public', icon: Users },
            { id: 'private', name: 'Private', icon: Shield },
            { id: 'therapy', name: 'Therapy', icon: Heart }
          ].map((filter) => {
            const IconComponent = filter.icon;
            const isActive = roomFilter === filter.id;
            
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => setRoomFilter(filter.id as any)}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {filter.name}
              </Button>
            );
          })}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-black/30 border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-200">
                {/* Room Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{room.name}</h3>
                      <p className="text-sm text-purple-200">{room.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={`${getRoomTypeColor(room.type)} text-white border-0`}>
                        {room.type}
                      </Badge>
                      {room.isPasswordProtected && (
                        <Shield className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Room Stats */}
                  <div className="flex items-center justify-between text-sm text-purple-300">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.currentParticipants}/{room.maxParticipants}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {room.environment}
                    </div>
                  </div>
                </div>

                {/* Room Content */}
                <div className="p-4">
                  {/* Activities */}
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-white mb-1">Activities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {room.activities.slice(0, 3).map((activity) => (
                        <Badge key={activity} variant="outline" className="text-xs border-purple-400 text-purple-300">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Moderator */}
                  {room.moderator && (
                    <div className="mb-3 text-xs text-green-300">
                      <Crown className="w-3 h-3 inline mr-1" />
                      Moderated by {room.moderator}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {room.tags.map((tag) => (
                        <span key={tag} className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button 
                    onClick={() => joinRoom(room)}
                    disabled={isJoining || room.currentParticipants >= room.maxParticipants}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isJoining ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </div>
                    ) : room.currentParticipants >= room.maxParticipants ? (
                      'Room Full'
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Join Room
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // In-room view
  return (
    <div className="h-full flex flex-col">
      {/* Room Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getRoomTypeColor(currentRoom.type)}`} />
          <div>
            <h2 className="text-xl font-semibold text-white">{currentRoom.name}</h2>
            <p className="text-sm text-purple-200">
              {connectedUsers.length} participants • {currentRoom.environment}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* User Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className={`${currentUser.isMuted ? 'text-red-400' : 'text-white'} hover:bg-white/10`}
          >
            {currentUser.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCamera}
            className={`${!currentUser.isCameraOn ? 'text-red-400' : 'text-white'} hover:bg-white/10`}
          >
            {currentUser.isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={leaveRoom}
            variant="destructive"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main VR Space */}
        <div className="flex-1 flex flex-col">
          {/* VR Canvas Area */}
          <div className="flex-1 bg-black/50 border border-purple-500/30 rounded-lg m-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Headphones className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">VR Space Active</h3>
                <p className="text-purple-200">Put on your VR headset to join the immersive experience</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-200 mr-2">Quick reactions:</span>
              {[
                { emoji: '👋', label: 'Wave' },
                { emoji: '👍', label: 'Thumbs up' },
                { emoji: '❤️', label: 'Heart' },
                { emoji: '😊', label: 'Smile' },
                { emoji: '☕', label: 'Coffee' },
                { emoji: '🎵', label: 'Music' }
              ].map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => sendEmoji(reaction.emoji)}
                  className="text-white hover:bg-white/10"
                  title={reaction.label}
                >
                  {reaction.emoji}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-white/10 flex flex-col">
          {/* Users List */}
          {showUserList && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Participants ({connectedUsers.length})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserList(!showUserList)}
                  className="text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {connectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 p-2 rounded hover:bg-white/5">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-purple-600 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getUserStatusColor(user.status)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-white truncate">{user.name}</span>
                        {user.role === 'moderator' && <Crown className="w-3 h-3 text-yellow-400" />}
                        {user.role === 'counselor' && <Shield className="w-3 h-3 text-blue-400" />}
                      </div>
                      <div className="flex items-center gap-1">
                        {user.isSpeaking && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                        {user.isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                        {!user.isCameraOn && <CameraOff className="w-3 h-3 text-red-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          {showChat && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <h3 className="font-semibold text-white">Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 p-3 space-y-2 overflow-y-auto"
              >
                {chatMessages.map((message) => (
                  <div key={message.id} className={`${
                    message.type === 'system' ? 'text-center' : ''
                  }`}>
                    {message.type === 'system' ? (
                      <div className="text-xs text-purple-400 italic">
                        {message.message}
                      </div>
                    ) : (
                      <div className={`${
                        message.userId === currentUser.id ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`inline-block max-w-[80%] p-2 rounded-lg ${
                          message.userId === currentUser.id 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-white/10 text-white'
                        }`}>
                          {message.userId !== currentUser.id && (
                            <div className="text-xs text-purple-300 mb-1">
                              {message.userName}
                            </div>
                          )}
                          <div className={`${
                            message.type === 'emoji' ? 'text-2xl' : 'text-sm'
                          }`}>
                            {message.message}
                          </div>
                          <div className="text-xs text-purple-300 mt-1">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VRSocialSpace;