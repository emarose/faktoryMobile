import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();
const DEFAULT_VOLUME = 0.2;
// Define your music tracks here - update these paths to match your actual audio files
const MUSIC_TRACKS = [
  {
    id: 'track1',
    name: 'Lamerios Tema',
    file: require('../../assets/sounds/track1.mp3'),
  },
  {
    id: 'track2',
    name: 'El Equilibrio Perfecto',
    file: require('../../assets/sounds/track2.mp3'),
  },
  {
    id: 'track3',
    name: 'The Antidote',
    file: require('../../assets/sounds/track3.mp3'),
  },
  {
    id: 'track4',
    name: 'Jazz Nº1',
    file: require('../../assets/sounds/track4.mp3'),
  },
  {
    id: 'track5',
    name: 'Negativo',
    file: require('../../assets/sounds/track5.mp3'),
  },
  {
    id: 'track6',
    name: 'Otoño',
    file: require('../../assets/sounds/track6.mp3'),
  },
];

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const soundRef = useRef(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    setupAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      if (isMuted) {
        soundRef.current.setVolumeAsync(0);
      } else {
        soundRef.current.setVolumeAsync(DEFAULT_VOLUME);
      }
    }
  }, [isMuted]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      loadAndPlayTrack(0);
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const loadAndPlayTrack = async (index) => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    
    try {
      // Stop and unload previous sound completely
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
        } catch (e) {
          // Ignore if already stopped
        }
        try {
          await soundRef.current.unloadAsync();
        } catch (e) {
          // Ignore if already unloaded
        }
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        MUSIC_TRACKS[index].file,
        { shouldPlay: !isMuted, volume: isMuted ? 0 : DEFAULT_VOLUME },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error loading track:', error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      playNextTrack();
    }
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    loadAndPlayTrack(nextIndex);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const selectTrack = (index) => {
    if (index >= 0 && index < MUSIC_TRACKS.length) {
      loadAndPlayTrack(index);
      setIsPaused(false);
    }
  };

  const pauseMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPaused(true);
      }
    } catch (error) {
      console.error('Error pausing music:', error);
    }
  };

  const resumeMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Error resuming music:', error);
    }
  };

  const value = {
    isMuted,
    toggleMute,
    currentTrack: MUSIC_TRACKS[currentTrackIndex],
    tracks: MUSIC_TRACKS,
    selectTrack,
    currentTrackIndex,
    isPlaying,
    isPaused,
    pauseMusic,
    resumeMusic,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
