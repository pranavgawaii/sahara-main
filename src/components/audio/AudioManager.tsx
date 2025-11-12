import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioContextType {
  toggleMute: () => void;
  isMuted: boolean;
  isBackgroundAudioLoaded: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioManagerProps {
  children: React.ReactNode;
}

export const AudioManagerProvider: React.FC<AudioManagerProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [isBackgroundAudioLoaded, setIsBackgroundAudioLoaded] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load mute preference from localStorage
    const savedMute = localStorage.getItem('audio-muted');
    if (savedMute) {
      const muteState = JSON.parse(savedMute);
      setIsMuted(muteState);
    }

    // Initialize background audio
    const initBackgroundAudio = () => {
      if (!backgroundAudioRef.current) {
        backgroundAudioRef.current = new Audio('/ambient-therapy.mp3');
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = 0.3; // Gentle background volume
        backgroundAudioRef.current.preload = 'auto';
        
        // Handle audio loading
        backgroundAudioRef.current.addEventListener('canplaythrough', () => {
          setIsBackgroundAudioLoaded(true);
          // Auto-play if not muted (with user interaction)
          if (!isMuted) {
            backgroundAudioRef.current?.play().catch(() => {
              // Handle autoplay restrictions
              console.log('Autoplay prevented - user interaction required');
            });
          }
        });

        backgroundAudioRef.current.addEventListener('error', () => {
          console.warn('Background audio failed to load');
        });
      }
    };

    initBackgroundAudio();

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Control background audio based on mute state
    if (backgroundAudioRef.current && isBackgroundAudioLoaded) {
      if (isMuted) {
        backgroundAudioRef.current.pause();
      } else {
        backgroundAudioRef.current.play().catch(() => {
          console.log('Audio play prevented - user interaction required');
        });
      }
    }
  }, [isMuted, isBackgroundAudioLoaded]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('audio-muted', JSON.stringify(newMuteState));
  };

  const contextValue: AudioContextType = {
    toggleMute,
    isMuted,
    isBackgroundAudioLoaded,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioManagerProvider');
  }
  return context;
};