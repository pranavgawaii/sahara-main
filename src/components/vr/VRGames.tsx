import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Star, 
  Clock, 
  Users, 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  Puzzle, 
  Music, 
  Waves, 
  Mountain, 
  TreePine, 
  Sparkles,
  CheckCircle,
  XCircle,
  Timer,
  Award
} from 'lucide-react';
import { vrService } from '@/services/vrService';
import { useStore } from '@/stores/useStore';
import { useTranslation } from 'react-i18next';

interface VRGame {
  id: string;
  name: string;
  description: string;
  category: 'relaxation' | 'cognitive' | 'social' | 'therapeutic';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  maxPlayers: number;
  features: string[];
  benefits: string[];
  icon: React.ComponentType<any>;
  color: string;
  isMultiplayer: boolean;
  requiresMovement: boolean;
}

interface GameSession {
  gameId: string;
  startTime: Date;
  score: number;
  level: number;
  isActive: boolean;
  participants: string[];
}

interface VRGamesProps {
  onGameStart?: (game: VRGame) => void;
  onGameEnd?: (session: GameSession) => void;
}

const VR_GAMES: VRGame[] = [
  {
    id: 'meditation-garden',
    name: 'Meditation Garden',
    description: 'Peaceful virtual garden for guided meditation and mindfulness',
    category: 'relaxation',
    difficulty: 'easy',
    duration: 15,
    maxPlayers: 1,
    features: ['Guided Meditation', 'Nature Sounds', 'Breathing Exercises'],
    benefits: ['Stress Relief', 'Improved Focus', 'Better Sleep'],
    icon: TreePine,
    color: 'from-green-500 to-emerald-600',
    isMultiplayer: false,
    requiresMovement: false
  },
  {
    id: 'memory-palace',
    name: 'Memory Palace',
    description: 'Cognitive training through spatial memory challenges',
    category: 'cognitive',
    difficulty: 'medium',
    duration: 20,
    maxPlayers: 1,
    features: ['Memory Training', 'Spatial Awareness', 'Progressive Difficulty'],
    benefits: ['Enhanced Memory', 'Better Concentration', 'Cognitive Flexibility'],
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    isMultiplayer: false,
    requiresMovement: true
  },
  {
    id: 'virtual-campfire',
    name: 'Virtual Campfire',
    description: 'Social gathering space for group discussions and activities',
    category: 'social',
    difficulty: 'easy',
    duration: 30,
    maxPlayers: 8,
    features: ['Voice Chat', 'Group Activities', 'Storytelling'],
    benefits: ['Social Connection', 'Communication Skills', 'Reduced Isolation'],
    icon: Users,
    color: 'from-orange-500 to-red-600',
    isMultiplayer: true,
    requiresMovement: false
  },
  {
    id: 'breathing-waves',
    name: 'Breathing Waves',
    description: 'Interactive breathing exercises with visual feedback',
    category: 'therapeutic',
    difficulty: 'easy',
    duration: 10,
    maxPlayers: 1,
    features: ['Breathing Guidance', 'Heart Rate Sync', 'Calming Visuals'],
    benefits: ['Anxiety Relief', 'Emotional Regulation', 'Stress Management'],
    icon: Waves,
    color: 'from-blue-500 to-cyan-600',
    isMultiplayer: false,
    requiresMovement: false
  },
  {
    id: 'focus-challenge',
    name: 'Focus Challenge',
    description: 'Attention training through interactive puzzles and tasks',
    category: 'cognitive',
    difficulty: 'hard',
    duration: 25,
    maxPlayers: 1,
    features: ['Attention Training', 'Problem Solving', 'Progress Tracking'],
    benefits: ['Improved Focus', 'Better Problem Solving', 'Mental Agility'],
    icon: Target,
    color: 'from-yellow-500 to-orange-600',
    isMultiplayer: false,
    requiresMovement: true
  },
  {
    id: 'collaborative-art',
    name: 'Collaborative Art',
    description: 'Create art together in a shared virtual space',
    category: 'social',
    difficulty: 'medium',
    duration: 45,
    maxPlayers: 6,
    features: ['3D Art Creation', 'Real-time Collaboration', 'Art Sharing'],
    benefits: ['Creative Expression', 'Teamwork', 'Stress Relief'],
    icon: Sparkles,
    color: 'from-pink-500 to-purple-600',
    isMultiplayer: true,
    requiresMovement: true
  }
];

export const VRGames: React.FC<VRGamesProps> = ({ onGameStart, onGameEnd }) => {
  const { t } = useTranslation(['common', 'ui']);
  const { student } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'relaxation' | 'cognitive' | 'social' | 'therapeutic'>('all');
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStats, setGameStats] = useState<Record<string, { played: number; bestScore: number; totalTime: number }>>({});

  // Filter games by category
  const filteredGames = selectedCategory === 'all' 
    ? VR_GAMES 
    : VR_GAMES.filter(game => game.category === selectedCategory);

  // Category options
  const categories = [
    { id: 'all' as const, name: 'All Games', icon: Gamepad2, color: 'bg-slate-600' },
    { id: 'relaxation' as const, name: 'Relaxation', icon: Heart, color: 'bg-green-600' },
    { id: 'cognitive' as const, name: 'Cognitive', icon: Brain, color: 'bg-purple-600' },
    { id: 'social' as const, name: 'Social', icon: Users, color: 'bg-blue-600' },
    { id: 'therapeutic' as const, name: 'Therapeutic', icon: Zap, color: 'bg-orange-600' }
  ];

  // Start a VR game
  const startGame = async (game: VRGame) => {
    setIsLoading(true);
    
    try {
      // Create game session
      const session: GameSession = {
        gameId: game.id,
        startTime: new Date(),
        score: 0,
        level: 1,
        isActive: true,
        participants: [student?.ephemeralHandle || 'anonymous']
      };
      
      setCurrentSession(session);
      
      // Initialize VR game environment
      await vrService.startVRSession(game.id, 'wellness');
      
      // Notify parent component
      onGameStart?.(game);
      
      console.log('VR Game started:', game.name);
    } catch (error) {
      console.error('Failed to start VR game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // End current game
  const endGame = async () => {
    if (!currentSession) return;
    
    try {
      // Calculate session duration
      const duration = Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000 / 60);
      
      // Update game stats
      const gameId = currentSession.gameId;
      setGameStats(prev => ({
        ...prev,
        [gameId]: {
          played: (prev[gameId]?.played || 0) + 1,
          bestScore: Math.max(prev[gameId]?.bestScore || 0, currentSession.score),
          totalTime: (prev[gameId]?.totalTime || 0) + duration
        }
      }));
      
      // End VR session
      await vrService.endVRSession();
      
      // Notify parent component
      onGameEnd?.(currentSession);
      
      setCurrentSession(null);
      
      console.log('VR Game ended');
    } catch (error) {
      console.error('Failed to end VR game:', error);
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Format duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">VR Games & Experiences</h2>
          <p className="text-purple-200">
            Interactive virtual reality games designed for mental wellness and cognitive training
          </p>
        </div>
        
        {currentSession && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Game Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 ${
                isActive 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const IconComponent = game.icon;
          const stats = gameStats[game.id];
          const isCurrentGame = currentSession?.gameId === game.id;
          
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className={`bg-black/30 border-white/10 overflow-hidden transition-all duration-200 ${
                isCurrentGame ? 'ring-2 ring-green-500 bg-green-500/10' : 'hover:bg-white/10'
              }`}>
                {/* Game Header */}
                <div className={`relative h-32 bg-gradient-to-br ${game.color}`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`${getDifficultyColor(game.difficulty)} border-0`}>
                      {game.difficulty}
                    </Badge>
                    {game.isMultiplayer && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-0">
                        Multiplayer
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="w-5 h-5 text-white" />
                      <h3 className="font-semibold text-white">{game.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Game Content */}
                <div className="p-4">
                  <p className="text-sm text-purple-200 mb-3">{game.description}</p>
                  
                  {/* Game Info */}
                  <div className="flex items-center justify-between mb-3 text-xs text-purple-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(game.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {game.maxPlayers === 1 ? 'Solo' : `Up to ${game.maxPlayers}`}
                    </div>
                    {game.requiresMovement && (
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Movement
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {game.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs border-purple-400 text-purple-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-white mb-1">Benefits:</h4>
                    <div className="flex flex-wrap gap-1">
                      {game.benefits.slice(0, 2).map((benefit) => (
                        <span key={benefit} className="text-xs text-green-300">
                          • {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  {stats && (
                    <div className="mb-4 p-2 bg-white/5 rounded">
                      <div className="flex justify-between text-xs text-purple-300">
                        <span>Played: {stats.played}</span>
                        <span>Best: {stats.bestScore}</span>
                        <span>Time: {formatDuration(stats.totalTime)}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {isCurrentGame ? (
                    <Button 
                      onClick={endGame}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      End Game
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => startGame(game)}
                      disabled={isLoading || !!currentSession}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Start Game
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Current Session Info */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="bg-green-500/10 border-green-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {VR_GAMES.find(g => g.id === currentSession.gameId)?.name}
                  </h3>
                  <p className="text-sm text-green-300">
                    Level {currentSession.level} • Score: {currentSession.score}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-green-300">
                  Started: {currentSession.startTime.toLocaleTimeString()}
                </p>
                <p className="text-xs text-green-400">
                  {currentSession.participants.length} participant(s)
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <Gamepad2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
          <p className="text-purple-200">
            No games available in the selected category. Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
};

export default VRGames;