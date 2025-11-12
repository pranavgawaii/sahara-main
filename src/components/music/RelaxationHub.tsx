import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, 
  VolumeX,
  Heart,
  Play,
  Pause,
  CloudRain,
  Trees,
  Waves,
  Wind,
  Music,
  Coffee,
  Flame,
  Mountain
} from 'lucide-react';

interface AmbientTrack {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  category: 'nature' | 'urban' | 'meditation';
  duration: string;
  color: string;
}

const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: CloudRain,
    description: 'Soft rainfall sounds for deep relaxation',
    category: 'nature',
    duration: '60 min',
    color: 'text-blue-500'
  },
  {
    id: 'forest',
    name: 'Forest Sounds',
    icon: Trees,
    description: 'Birds chirping and rustling leaves',
    category: 'nature',
    duration: '45 min',
    color: 'text-green-500'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    icon: Waves,
    description: 'Rhythmic ocean waves on the shore',
    category: 'nature',
    duration: '90 min',
    color: 'text-cyan-500'
  },
  {
    id: 'wind',
    name: 'Mountain Breeze',
    icon: Wind,
    description: 'Gentle wind through mountain peaks',
    category: 'nature',
    duration: '30 min',
    color: 'text-gray-500'
  },
  {
    id: 'meditation',
    name: 'Meditation Bells',
    icon: Music,
    description: 'Tibetan singing bowls and chimes',
    category: 'meditation',
    duration: '20 min',
    color: 'text-purple-500'
  },
  {
    id: 'cafe',
    name: 'Coffee Shop',
    icon: Coffee,
    description: 'Ambient coffee shop atmosphere',
    category: 'urban',
    duration: '120 min',
    color: 'text-amber-500'
  },
  {
    id: 'fireplace',
    name: 'Crackling Fire',
    icon: Flame,
    description: 'Warm fireplace with gentle crackling',
    category: 'meditation',
    duration: '75 min',
    color: 'text-orange-500'
  },
  {
    id: 'mountain',
    name: 'Mountain Stream',
    icon: Mountain,
    description: 'Flowing water over rocks and stones',
    category: 'nature',
    duration: '50 min',
    color: 'text-teal-500'
  }
];

export const RelaxationHub = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'nature' | 'urban' | 'meditation'>('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load preferences from localStorage
    const savedMute = localStorage.getItem('audio-muted');
    const savedVolume = localStorage.getItem('audio-volume');
    if (savedMute) setIsMuted(JSON.parse(savedMute));
    if (savedVolume) setVolume([parseInt(savedVolume)]);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('audio-muted', JSON.stringify(newMuteState));
    if (audioRef.current) {
      audioRef.current.muted = newMuteState;
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    localStorage.setItem('audio-volume', newVolume[0].toString());
  };

  const playTrack = (trackId: string) => {
    if (currentTrack === trackId && isPlaying) {
      // Pause current track
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Play new track or resume
      setCurrentTrack(trackId);
      setIsPlaying(true);
      
      // In a real app, you would load the actual audio file here
      // For demo purposes, we'll simulate audio playback
      if (audioRef.current) {
        audioRef.current.src = `/audio/${trackId}.mp3`; // Placeholder path
        audioRef.current.play().catch(() => {
          // Handle audio play errors gracefully
          console.log('Audio playback not available in demo');
        });
      }
    }
  };

  const stopAllTracks = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const filteredTracks = selectedCategory === 'all' 
    ? AMBIENT_TRACKS 
    : AMBIENT_TRACKS.filter(track => track.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Sounds' },
    { id: 'nature', label: 'Nature' },
    { id: 'urban', label: 'Urban' },
    { id: 'meditation', label: 'Meditation' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-accent/10">
          <Heart className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Relaxation Hub</h3>
          <p className="text-muted-foreground">Calming ambient sounds for relaxation</p>
        </div>
      </div>

      {/* Audio Controls */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          {/* Master Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleMute}
                className="p-3 hover:bg-primary/10 transition-colors"
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>
              
              {currentTrack && (
                <Button
                  variant="outline"
                  onClick={stopAllTracks}
                  className="flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Stop All
                </Button>
              )}
            </div>
            
            {currentTrack && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Now Playing: {AMBIENT_TRACKS.find(t => t.id === currentTrack)?.name}
              </Badge>
            )}
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volume</label>
              <span className="text-sm text-muted-foreground">{volume[0]}%</span>
            </div>
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
              disabled={isMuted}
            />
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id as any)}
            className="text-sm"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Ambient Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTracks.map((track) => {
          const IconComponent = track.icon;
          const isCurrentTrack = currentTrack === track.id;
          const isTrackPlaying = isCurrentTrack && isPlaying;
          
          return (
            <Card 
              key={track.id} 
              className={`glass-card p-4 hover:shadow-ambient transition-all cursor-pointer ${
                isCurrentTrack ? 'ring-2 ring-primary/50 bg-primary/5' : ''
              }`}
              onClick={() => playTrack(track.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 ${
                  isTrackPlaying ? 'animate-pulse' : ''
                }`}>
                  <IconComponent className={`w-5 h-5 ${track.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground truncate">{track.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(track.id);
                      }}
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {track.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs capitalize">
                      {track.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{track.duration}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTrack(null);
        }}
        onError={() => {
          setIsPlaying(false);
          setCurrentTrack(null);
        }}
      />

      {filteredTracks.length === 0 && (
        <Card className="glass-card p-8 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No tracks found</h4>
          <p className="text-muted-foreground">Try selecting a different category</p>
        </Card>
      )}
    </div>
  );
};