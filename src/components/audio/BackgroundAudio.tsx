import React, { useEffect, useRef } from 'react';
import { useAudio } from './AudioManager';

interface BackgroundAudioProps {
  audioSrc?: string;
  volume?: number;
}

const BackgroundAudio: React.FC<BackgroundAudioProps> = ({ 
  audioSrc = '/ambient-therapy.mp3',
  volume = 0.3 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isMuted } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Configure audio properties
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';

    // Handle user interaction requirement for autoplay
    const handleUserInteraction = () => {
      if (!isMuted && audio.paused) {
        audio.play().catch(console.error);
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    // Try to play immediately (will work if autoplay is allowed)
    if (!isMuted) {
      audio.play().catch(() => {
        // Autoplay blocked, will play on user interaction
        console.log('Autoplay blocked, waiting for user interaction');
      });
    }

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [volume]);

  // Handle mute/unmute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  }, [isMuted]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  return (
    <audio
      ref={audioRef}
      src={audioSrc}
      style={{ display: 'none' }}
      onError={(e) => {
        console.warn('Background audio file not found. Please add ambient-therapy.mp3 to the public directory for therapeutic background sounds.');
      }}
      onLoadStart={() => {
        console.log('Background audio loading started');
      }}
      onCanPlayThrough={() => {
        console.log('Background audio ready to play');
      }}
    />
  );
};

export default BackgroundAudio;