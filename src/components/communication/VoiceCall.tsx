import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Shield } from 'lucide-react';
import { vonageService, VoiceCall as VoiceCallType } from '../../services/vonageService';
import { useAuthStore } from '../../stores/authStore';

interface VoiceCallProps {
  counselorId: string;
  counselorName: string;
  counselorPhone?: string;
  onClose: () => void;
}

export const VoiceCall: React.FC<VoiceCallProps> = ({ 
  counselorId, 
  counselorName, 
  counselorPhone = '+1234567890',
  onClose 
}) => {
  const { user } = useAuthStore();
  const [call, setCall] = useState<VoiceCallType | null>(null);
  const [callStatus, setCallStatus] = useState<'dialing' | 'ringing' | 'connected' | 'ended'>('dialing');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  
  const callStartTime = useRef<Date | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    initiateCall();
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [counselorId]);

  useEffect(() => {
    if (callStatus === 'connected' && !durationInterval.current) {
      callStartTime.current = new Date();
      durationInterval.current = setInterval(() => {
        if (callStartTime.current) {
          const duration = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
          setCallDuration(duration);
        }
      }, 1000);
    }
  }, [callStatus]);

  const initiateCall = async () => {
    if (!user) return;
    
    try {
      setIsConnecting(true);
      setCallStatus('dialing');
      
      // Simulate dialing
      setTimeout(() => {
        setCallStatus('ringing');
        setIsConnecting(false);
      }, 1000);
      
      const voiceCall = await vonageService.initiateVoiceCall(
        user.id,
        counselorId,
        '+1234567890' // Default phone number since user.phone is not available
      );
      
      setCall(voiceCall);
      
      // Simulate call progression
      setTimeout(() => {
        setCallStatus('connected');
        initializeAudio();
      }, 4000);
      
    } catch (error) {
      console.error('Failed to initiate voice call:', error);
      setCallStatus('ended');
      setIsConnecting(false);
    }
  };

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // In a real implementation, this would be connected to Vonage Voice API
      console.log('Audio stream initialized:', stream);
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In a real implementation, this would mute/unmute the actual audio stream
  };

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
    // In a real implementation, this would switch between speaker and earpiece
  };

  const endCall = async () => {
    if (call) {
      await vonageService.endVoiceCall(call.id);
    }
    
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    
    setCallStatus('ended');
    
    // Close after a brief delay to show call ended status
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'dialing':
        return 'Dialing...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'dialing':
      case 'ringing':
        return 'text-yellow-400';
      case 'connected':
        return 'text-green-400';
      case 'ended':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full mx-4 text-center text-white shadow-2xl">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl font-bold text-white">{counselorName.charAt(0)}</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">{counselorName}</h2>
          <p className="text-lg opacity-90">College Counselor</p>
        </div>

        {/* Status */}
        <div className="mb-8">
          <div className={`text-lg font-medium ${getStatusColor()} mb-2`}>
            {getStatusText()}
          </div>
          
          {/* Connection indicator */}
          {(callStatus === 'dialing' || callStatus === 'ringing') && (
            <div className="flex justify-center mb-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          
          {/* Security indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm opacity-75">
            <Shield className="w-4 h-4" />
            <span>Encrypted call</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-6 mb-6">
          {/* Mute/Unmute */}
          <button
            onClick={toggleAudio}
            disabled={callStatus !== 'connected'}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              callStatus === 'connected'
                ? isAudioEnabled
                  ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Speaker */}
          <button
            onClick={toggleSpeaker}
            disabled={callStatus !== 'connected'}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              callStatus === 'connected'
                ? isSpeakerEnabled
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isSpeakerEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {/* End Call Button */}
        <div className="flex justify-center">
          <button
            onClick={endCall}
            disabled={callStatus === 'ended'}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              callStatus === 'ended'
                ? 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>

        {/* Call Info */}
        {callStatus === 'connected' && (
          <div className="mt-6 text-sm opacity-75">
            <p>Voice call with {counselorName}</p>
            <p className="mt-1">High quality • Encrypted</p>
          </div>
        )}

        {callStatus === 'ended' && (
          <div className="mt-6 text-sm opacity-75">
            <p>Call ended</p>
            <p className="mt-1">Thank you for using our secure calling service</p>
          </div>
        )}

        {/* Cancel button for dialing/ringing states */}
        {(callStatus === 'dialing' || callStatus === 'ringing') && (
          <button
            onClick={onClose}
            className="mt-4 text-sm text-white opacity-75 hover:opacity-100 transition-opacity"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceCall;