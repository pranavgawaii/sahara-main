import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Trophy,
  RotateCcw,
  Star,
  Target,
  Palette,
  Zap
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  color: string;
  icon: any;
}

const games: Game[] = [
  {
    id: 'breathing',
    title: 'Breathing Bubbles',
    description: 'Follow the expanding bubble to practice deep breathing',
    duration: '5 min',
    difficulty: 'Easy',
    points: 10,
    color: 'primary',
    icon: Heart
  },
  {
    id: 'focus',
    title: 'Focus Garden',
    description: 'Water virtual plants by maintaining focus',
    duration: '10 min',
    difficulty: 'Medium',
    points: 20,
    color: 'success',
    icon: Sparkles
  },
  {
    id: 'memory',
    title: 'Memory Palace',
    description: 'Build concentration through pattern memory games',
    duration: '8 min',
    difficulty: 'Hard',
    points: 30,
    color: 'accent',
    icon: Brain
  },
  {
    id: 'mindful-coloring',
    title: 'Mindful Coloring',
    description: 'Relax through digital coloring patterns',
    duration: '15 min',
    difficulty: 'Easy',
    points: 15,
    color: 'primary',
    icon: Palette
  },
  {
    id: 'reaction-calm',
    title: 'Calm Reactions',
    description: 'Test mindful responses to visual stimuli',
    duration: '7 min',
    difficulty: 'Medium',
    points: 25,
    color: 'accent',
    icon: Zap
  },
  {
    id: 'focus-target',
    title: 'Focus Target',
    description: 'Improve concentration with visual tracking',
    duration: '6 min',
    difficulty: 'Medium',
    points: 18,
    color: 'success',
    icon: Target
  }
];

interface BreathingGameProps {
  onComplete: (points: number) => void;
  onClose: () => void;
}

const BreathingGame: React.FC<BreathingGameProps> = ({ onComplete, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (phase === 'inhale' && prev >= 4) {
          setPhase('hold');
          return 0;
        }
        if (phase === 'hold' && prev >= 2) {
          setPhase('exhale');
          return 0;
        }
        if (phase === 'exhale' && prev >= 4) {
          setPhase('inhale');
          setCycles(c => c + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  useEffect(() => {
    if (cycles >= 5) {
      setIsActive(false);
      onComplete(10);
    }
  }, [cycles, onComplete]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimer(0);
    setCycles(0);
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1 + (timer * 0.3);
      case 'hold': return 2.2;
      case 'exhale': return 2.2 - (timer * 0.3);
      default: return 1;
    }
  };

  return (
    <Card className="glass-card p-8 text-center max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Breathing Exercise</h3>
      
      <div className="relative w-48 h-48 mx-auto mb-6">
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-r from-primary to-accent opacity-60"
          animate={{ scale: getCircleScale() }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium capitalize">{phase}</p>
            <p className="text-sm text-muted-foreground">{4 - timer}s</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Cycles completed: {cycles}/5</p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(cycles / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        {!isActive && cycles === 0 ? (
          <Button onClick={startExercise} className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Start Exercise
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            {cycles >= 5 ? 'Complete!' : 'Close'}
          </Button>
        )}
      </div>
    </Card>
  );
};

interface FocusGameProps {
  onComplete: (points: number) => void;
  onClose: () => void;
}

const FocusGarden: React.FC<FocusGameProps> = ({ onComplete, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [plants, setPlants] = useState(Array(6).fill(0));
  const [currentPlant, setCurrentPlant] = useState(0);
  const [timer, setTimer] = useState(0);
  const [focusLevel, setFocusLevel] = useState(100);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
      setFocusLevel(prev => Math.max(0, prev - 1));
      
      if (timer > 0 && timer % 10 === 0) {
        setPlants(prev => {
          const newPlants = [...prev];
          newPlants[currentPlant] = Math.min(100, newPlants[currentPlant] + 20);
          return newPlants;
        });
        setCurrentPlant(prev => (prev + 1) % 6);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timer, currentPlant]);

  useEffect(() => {
    if (timer >= 60) {
      setIsActive(false);
      const completedPlants = plants.filter(p => p >= 100).length;
      onComplete(completedPlants * 5);
    }
  }, [timer, plants, onComplete]);

  const waterPlant = () => {
    if (focusLevel > 0) {
      setFocusLevel(prev => Math.min(100, prev + 10));
      setPlants(prev => {
        const newPlants = [...prev];
        newPlants[currentPlant] = Math.min(100, newPlants[currentPlant] + 15);
        return newPlants;
      });
    }
  };

  return (
    <Card className="glass-card p-8 text-center max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Focus Garden</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {plants.map((growth, index) => (
          <div key={index} className={`relative w-16 h-16 mx-auto border-2 rounded-lg ${
            index === currentPlant ? 'border-primary' : 'border-muted'
          }`}>
            <div className="absolute bottom-0 w-full bg-success rounded-b transition-all duration-300"
                 style={{ height: `${growth}%` }} />
            <Sparkles className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 ${
              growth >= 100 ? 'text-success' : 'text-muted-foreground'
            }`} />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Focus Level: {focusLevel}%</p>
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div className="bg-primary h-2 rounded-full transition-all duration-300"
               style={{ width: `${focusLevel}%` }} />
        </div>
        <p className="text-sm text-muted-foreground">Time: {timer}/60s</p>
      </div>

      <div className="flex gap-3 justify-center">
        {!isActive && timer === 0 ? (
          <Button onClick={() => setIsActive(true)} className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Start Garden
          </Button>
        ) : isActive ? (
          <Button onClick={waterPlant} disabled={focusLevel === 0}>
            Water Plant
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Complete!
          </Button>
        )}
      </div>
    </Card>
  );
};

const MemoryPalace: React.FC<FocusGameProps> = ({ onComplete, onClose }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'input' | 'complete'>('ready');

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9));
  };

  const startLevel = () => {
    const newSequence = generateSequence(level + 2);
    setSequence(newSequence);
    setUserSequence([]);
    setGameState('showing');
    setIsShowing(true);
    
    setTimeout(() => {
      setIsShowing(false);
      setGameState('input');
    }, (level + 2) * 1000);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'input') return;
    
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);
    
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameState('complete');
      onComplete(level * 5);
      return;
    }
    
    if (newUserSequence.length === sequence.length) {
      if (level >= 5) {
        setGameState('complete');
        onComplete(30);
      } else {
        setLevel(prev => prev + 1);
        setTimeout(startLevel, 1000);
      }
    }
  };

  return (
    <Card className="glass-card p-8 text-center max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Memory Palace</h3>
      
      <div className="mb-6">
        <p className="text-lg font-medium mb-2">Level {level}</p>
        <p className="text-sm text-muted-foreground">
          {gameState === 'ready' && 'Click Start to begin'}
          {gameState === 'showing' && 'Watch the sequence'}
          {gameState === 'input' && 'Repeat the sequence'}
          {gameState === 'complete' && 'Game Complete!'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6 max-w-48 mx-auto">
        {Array.from({ length: 9 }, (_, index) => (
          <button
            key={index}
            className={`w-14 h-14 rounded-lg border-2 transition-all duration-200 ${
              isShowing && sequence[userSequence.length] === index
                ? 'bg-primary border-primary'
                : 'bg-muted border-muted hover:bg-muted/80'
            }`}
            onClick={() => handleTileClick(index)}
            disabled={gameState !== 'input'}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        {gameState === 'ready' ? (
          <Button onClick={startLevel} className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Start Game
          </Button>
        ) : gameState === 'complete' ? (
          <Button variant="outline" onClick={onClose}>
            Complete!
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </Card>
  );
 };

const MindfulColoring: React.FC<FocusGameProps> = ({ onComplete, onClose }) => {
  const [coloredCells, setColoredCells] = useState<{[key: number]: string}>({});
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [progress, setProgress] = useState(0);
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const totalCells = 64;

  const handleCellClick = (index: number) => {
    setColoredCells(prev => ({ ...prev, [index]: currentColor }));
    const newProgress = Object.keys({ ...coloredCells, [index]: currentColor }).length;
    setProgress(newProgress);
    
    if (newProgress >= totalCells * 0.8) {
      setTimeout(() => onComplete(15), 500);
    }
  };

  return (
    <Card className="glass-card p-8 text-center max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Mindful Coloring</h3>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Progress: {Math.round((progress / totalCells) * 100)}%</p>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300"
               style={{ width: `${(progress / totalCells) * 100}%` }} />
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {colors.map(color => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 ${
              currentColor === color ? 'border-foreground' : 'border-muted'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
          />
        ))}
      </div>

      <div className="grid grid-cols-8 gap-1 mb-6 max-w-64 mx-auto">
        {Array.from({ length: totalCells }, (_, index) => (
          <button
            key={index}
            className="w-7 h-7 border border-muted rounded hover:scale-110 transition-transform"
            style={{ backgroundColor: coloredCells[index] || '#f3f4f6' }}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>

      <Button variant="outline" onClick={onClose}>
        {progress >= totalCells * 0.8 ? 'Complete!' : 'Close'}
      </Button>
    </Card>
  );
};

const CalmReactions: React.FC<FocusGameProps> = ({ onComplete, onClose }) => {
  const [gameState, setGameState] = useState<'ready' | 'waiting' | 'react' | 'complete'>('ready');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const startRound = () => {
    setGameState('waiting');
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    
    setTimeout(() => {
      setGameState('react');
      setStartTime(Date.now());
    }, delay);
  };

  const handleReaction = () => {
    if (gameState === 'react') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      
      if (time < 1000) {
        setScore(prev => prev + Math.max(0, 100 - time / 10));
      }
      
      setRound(prev => prev + 1);
      
      if (round >= 4) {
        setGameState('complete');
        onComplete(Math.round(score / 10));
      } else {
        setTimeout(startRound, 1500);
      }
    }
  };

  return (
    <Card className="glass-card p-8 text-center max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Calm Reactions</h3>
      
      <div className="mb-6">
        <p className="text-lg font-medium mb-2">Round {round + 1}/5</p>
        <p className="text-sm text-muted-foreground">
          {gameState === 'ready' && 'Click when the circle turns green'}
          {gameState === 'waiting' && 'Wait for green...'}
          {gameState === 'react' && 'Click now!'}
          {gameState === 'complete' && `Final Score: ${Math.round(score)}`}
        </p>
      </div>

      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className={`w-full h-full rounded-full transition-all duration-300 ${
          gameState === 'react' ? 'bg-green-500' : 
          gameState === 'waiting' ? 'bg-yellow-500' : 'bg-muted'
        }`} />
      </div>

      {reactionTime > 0 && gameState !== 'complete' && (
        <p className="text-sm text-muted-foreground mb-4">
          Reaction time: {reactionTime}ms
        </p>
      )}

      <div className="flex gap-3 justify-center">
        {gameState === 'ready' ? (
          <Button onClick={startRound} className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Start Game
          </Button>
        ) : gameState === 'complete' ? (
          <Button variant="outline" onClick={onClose}>
            Complete!
          </Button>
        ) : (
          <Button onClick={handleReaction} className="w-32 h-32 rounded-full">
            Click!
          </Button>
        )}
      </div>
    </Card>
  );
};

const FocusTarget: React.FC<FocusGameProps> = ({ onComplete, onClose }) => {
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const gameInterval = setInterval(() => {
      setTargetPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });
    }, 1500);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    };
  }, [isActive, score, onComplete]);

  const handleTargetClick = () => {
    setScore(prev => prev + 1);
  };

  return (
    <Card className="glass-card p-8 text-center max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Focus Target</h3>
      
      <div className="mb-4">
        <p className="text-lg font-medium mb-2">Score: {score}</p>
        <p className="text-sm text-muted-foreground">Time: {timeLeft}s</p>
      </div>

      <div className="relative w-80 h-60 bg-muted/20 rounded-lg mb-6 mx-auto overflow-hidden">
        {isActive && (
          <motion.button
            className="absolute w-8 h-8 bg-primary rounded-full hover:scale-110 transition-transform"
            style={{
              left: `${targetPosition.x}%`,
              top: `${targetPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={handleTargetClick}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          >
            <Target className="w-full h-full" />
          </motion.button>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {!isActive && timeLeft === 30 ? (
          <Button onClick={() => setIsActive(true)} className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Start Game
          </Button>
        ) : timeLeft === 0 ? (
          <Button variant="outline" onClick={onClose}>
            Complete!
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </Card>
  );
};

export const MindfulnessGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set());

  const handleGameComplete = (points: number) => {
    setUserPoints(prev => prev + points);
    if (selectedGame) {
      setCompletedGames(prev => new Set([...prev, selectedGame]));
    }
    setSelectedGame(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'muted';
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary border-primary/20';
      case 'accent': return 'bg-accent/10 text-accent border-accent/20';
      case 'success': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (selectedGame === 'breathing') {
    return (
      <BreathingGame 
        onComplete={handleGameComplete}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'focus') {
    return (
      <FocusGarden 
        onComplete={handleGameComplete}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'memory') {
    return (
      <MemoryPalace 
        onComplete={handleGameComplete}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'mindful-coloring') {
    return (
      <MindfulColoring 
        onComplete={handleGameComplete}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'reaction-calm') {
    return (
      <CalmReactions 
        onComplete={handleGameComplete}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'focus-target') {
    return (
      <FocusTarget 
        onComplete={handleGameComplete}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Points */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Mindfulness Games</h3>
          <p className="text-muted-foreground">Interactive exercises for mental wellness</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="font-semibold">{userPoints} points</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => {
          const IconComponent = game.icon;
          const isCompleted = completedGames.has(game.id);
          
          return (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`glass-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border ${getColorClass(game.color)}`}
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${getColorClass(game.color)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                    </div>
                  )}
                </div>

                <h4 className="font-semibold text-foreground mb-2">{game.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`text-${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {game.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Trophy className="w-3 h-3" />
                    <span>{game.points}pts</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  size="sm"
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Completed' : 'Play Now'}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/10">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Today's Progress</p>
              <p className="text-sm text-muted-foreground">
                {completedGames.size}/{games.length} games completed
              </p>
            </div>
          </div>
          <div className="w-24 h-2 bg-muted rounded-full">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedGames.size / games.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};