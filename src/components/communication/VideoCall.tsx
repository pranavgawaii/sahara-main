import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings, Shield } from 'lucide-react';
import { vonageService, VideoSession } from '../../services/vonageService';
import { useAuthStore } from '../../stores/authStore';

interface VideoCallProps {
  counselorId: string;
  counselorName: string;
  onClose: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ counselorId, counselorName, onClose }) => {
  const { user } = useAuthStore();
  const [session, setSession] = useState<VideoSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callStartTime = useRef<Date | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeVideoCall();
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [counselorId]);

  useEffect(() => {
    if (isConnected && !durationInterval.current) {
      callStartTime.current = new Date();
      durationInterval.current = setInterval(() => {
        if (callStartTime.current) {
          const duration = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
          setCallDuration(duration);
        }
      }, 1000);
    }
  }, [isConnected]);

  const initializeVideoCall = async () => {
    if (!user) return;
    
    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      
      const videoSession = await vonageService.createVideoSession([user.id, counselorId]);
      setSession(videoSession);
      
      // Simulate connection process
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        setConnectionStatus('connected');
        initializeLocalVideo();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to initialize video call:', error);
      setConnectionStatus('disconnected');
      setIsConnecting(false);
    }
  };

  const initializeLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoEnabled, 
        audio: isAudioEnabled 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access camera/microphone:', error);
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In a real implementation, this would control the actual video stream
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In a real implementation, this would control the actual audio stream
  };

  const endCall = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    
    // Stop local video stream
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    onClose();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-pulse">
            <Video className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connecting to {counselorName}</h3>
          <p className="text-gray-600 mb-4">Please wait while we establish a secure connection...</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>End-to-end encrypted</span>
          </div>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">{counselorName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold">{counselorName}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="capitalize">{connectionStatus}</span>
              {isConnected && (
                <>
                  <span>•</span>
                  <span>{formatDuration(callDuration)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Shield className="w-4 h-4" />
          <span>Secure</span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {/* Remote Video (Counselor) */}
        <div className="w-full h-full relative">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold">{counselorName.charAt(0)}</span>
                </div>
                <p className="text-lg">{counselorName}</p>
                <p className="text-sm text-gray-400 mt-1">Waiting to connect...</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Student) - Picture in Picture */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center space-x-6">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isAudioEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Call Info */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          <p>Video call with {counselorName}</p>
          {isConnected && (
            <p className="mt-1">Duration: {formatDuration(callDuration)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;