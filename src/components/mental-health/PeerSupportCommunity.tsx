import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  MessageCircle,
  Heart,
  Shield,
  Clock,
  ThumbsUp,
  Reply,
  Flag,
  Star,
  UserPlus,
  Send,
  Lock,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  moderator: string;
  lastActivity: string;
  tags: string[];
}

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  category: string;
  isAnonymous: boolean;
  tags: string[];
  isSupported: boolean;
}

interface PeerSupportCommunityProps {
  category?: string;
  showCreatePost?: boolean;
}

const SUPPORT_GROUPS: SupportGroup[] = [
  {
    id: 'anxiety-support',
    name: 'Anxiety Support Circle',
    description: 'A safe space to share experiences and coping strategies for anxiety',
    category: 'anxiety',
    memberCount: 234,
    isPrivate: false,
    moderator: 'Aiswarya Menon',
    lastActivity: '2 minutes ago',
    tags: ['anxiety', 'coping', 'breathing', 'mindfulness']
  },
  {
    id: 'career-stress',
    name: 'Career & Placement Support',
    description: 'Navigate career anxiety and placement stress together',
    category: 'career',
    memberCount: 189,
    isPrivate: false,
    moderator: 'Akeela P',
    lastActivity: '15 minutes ago',
    tags: ['career', 'placement', 'interviews', 'confidence']
  },
  {
    id: 'family-harmony',
    name: 'Family Relationship Support',
    description: 'Discuss family challenges and build healthier relationships',
    category: 'family',
    memberCount: 156,
    isPrivate: true,
    moderator: 'Dr. Priya Sharma',
    lastActivity: '1 hour ago',
    tags: ['family', 'communication', 'boundaries', 'understanding']
  },
  {
    id: 'relationship-guidance',
    name: 'Healthy Relationships Hub',
    description: 'Support for building and maintaining healthy relationships',
    category: 'relationship',
    memberCount: 198,
    isPrivate: false,
    moderator: 'Dr. Emily Rodriguez',
    lastActivity: '30 minutes ago',
    tags: ['relationships', 'communication', 'trust', 'boundaries']
  },
  {
    id: 'financial-wellness',
    name: 'Financial Wellness Community',
    description: 'Share tips and support for managing financial stress',
    category: 'financial',
    memberCount: 142,
    isPrivate: false,
    moderator: 'Prof. David Kim',
    lastActivity: '45 minutes ago',
    tags: ['budgeting', 'financial-stress', 'planning', 'resources']
  },
  {
    id: 'anti-ragging-support',
    name: 'Safe Campus Initiative',
    description: 'Confidential support for those affected by ragging or bullying',
    category: 'anti-ragging',
    memberCount: 89,
    isPrivate: true,
    moderator: 'Campus Safety Team',
    lastActivity: '3 hours ago',
    tags: ['safety', 'support', 'reporting', 'healing']
  },
  {
    id: 'interfaith-harmony',
    name: 'Unity in Diversity Circle',
    description: 'Promoting understanding and respect across all faiths and cultures',
    category: 'interfaith',
    memberCount: 167,
    isPrivate: false,
    moderator: 'Interfaith Council',
    lastActivity: '1 hour ago',
    tags: ['diversity', 'respect', 'understanding', 'harmony']
  }
];

const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Anonymous Student',
    content: 'I\'ve been struggling with interview anxiety lately. The thought of placement interviews makes my heart race. Has anyone found effective techniques to calm nerves before big interviews?',
    timestamp: '2 hours ago',
    likes: 12,
    replies: 8,
    category: 'career',
    isAnonymous: true,
    tags: ['anxiety', 'interviews', 'placement'],
    isSupported: true
  },
  {
    id: 'post-2',
    author: 'WellnessWarrior23',
    content: 'Sharing a breathing technique that really helped me during my panic attacks: 4-7-8 breathing. Inhale for 4, hold for 7, exhale for 8. It\'s been a game-changer for me!',
    timestamp: '4 hours ago',
    likes: 28,
    replies: 15,
    category: 'anxiety',
    isAnonymous: false,
    tags: ['breathing', 'techniques', 'panic-attacks'],
    isSupported: false
  },
  {
    id: 'post-3',
    author: 'Anonymous Student',
    content: 'My family doesn\'t understand my career choices and it\'s causing a lot of stress at home. How do you handle family pressure while staying true to your goals?',
    timestamp: '6 hours ago',
    likes: 19,
    replies: 22,
    category: 'family',
    isAnonymous: true,
    tags: ['family-pressure', 'career-choices', 'stress'],
    isSupported: true
  },
  {
    id: 'post-4',
    author: 'BudgetBuddy',
    content: 'Created a simple budgeting spreadsheet for students! It helps track expenses and plan for the month. Happy to share the template if anyone\'s interested.',
    timestamp: '8 hours ago',
    likes: 35,
    replies: 12,
    category: 'financial',
    isAnonymous: false,
    tags: ['budgeting', 'resources', 'planning'],
    isSupported: false
  }
];

const PeerSupportCommunity: React.FC<PeerSupportCommunityProps> = ({ 
  category, 
  showCreatePost = true 
}) => {
  const { t } = useTranslation(['common']);
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const filteredGroups = category 
    ? SUPPORT_GROUPS.filter(group => group.category === category)
    : SUPPORT_GROUPS;

  const filteredPosts = category 
    ? COMMUNITY_POSTS.filter(post => post.category === category)
    : COMMUNITY_POSTS;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'anxiety': return 'bg-blue-100 text-blue-800';
      case 'career': return 'bg-green-100 text-green-800';
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'relationship': return 'bg-pink-100 text-pink-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      case 'anti-ragging': return 'bg-red-100 text-red-800';
      case 'interfaith': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
    // Implementation for joining group
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      console.log('Creating post:', {
        content: newPostContent,
        isAnonymous,
        category
      });
      setNewPostContent('');
    }
  };

  const handleLikePost = (postId: string) => {
    console.log('Liking post:', postId);
    // Implementation for liking post
  };

  const handleReplyToPost = (postId: string) => {
    console.log('Replying to post:', postId);
    // Implementation for replying to post
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="posts">Community Posts</TabsTrigger>
          <TabsTrigger value="resources">Peer Resources</TabsTrigger>
        </TabsList>

        {/* Support Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        {group.isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
                      </div>
                      <Badge className={getCategoryColor(group.category)}>
                        {group.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                      {group.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {group.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {group.memberCount} members
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {group.lastActivity}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {group.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Moderated by {group.moderator}
                      </div>
                      
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {group.isPrivate ? 'Request to Join' : 'Join Group'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Community Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          {showCreatePost && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Share with the Community
                </CardTitle>
                <CardDescription>
                  Your post will be moderated to ensure a safe and supportive environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts, ask for advice, or offer support to others..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isAnonymous ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                    >
                      {isAnonymous ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {isAnonymous ? 'Anonymous' : 'Public'}
                    </Button>
                  </div>
                  <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {post.isAnonymous ? '?' : post.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-800">
                            {post.isAnonymous ? 'Anonymous Student' : post.author}
                          </div>
                          <div className="text-sm text-gray-500">{post.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category}
                        </Badge>
                        {post.isSupported && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Shield className="w-3 h-3 mr-1" />
                            Supported
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReplyToPost(post.id)}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          {post.replies}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Peer Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Peer Mentorship</h3>
                <p className="text-gray-600 mb-4">
                  Connect with experienced students who can guide you through challenges
                </p>
                <Button className="w-full">
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Buddy System</h3>
                <p className="text-gray-600 mb-4">
                  Get paired with a peer for mutual support and accountability
                </p>
                <Button className="w-full">
                  Find a Buddy
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Crisis Support</h3>
                <p className="text-gray-600 mb-4">
                  24/7 peer crisis support network for immediate help
                </p>
                <Button className="w-full" variant="outline">
                  Emergency Support
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Study Groups</h3>
                <p className="text-gray-600 mb-4">
                  Join study groups focused on wellness and academic success
                </p>
                <Button className="w-full">
                  Join Study Groups
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeerSupportCommunity;