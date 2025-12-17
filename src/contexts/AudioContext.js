import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AudioContext = createContext();
const DEFAULT_VOLUME = 0.3;

// Storage keys for persisting audio settings
const STORAGE_KEYS = {
  VOLUME: '@faktory/audioVolume',
  IS_PAUSED: '@faktory/audioIsPaused',
};

const MUSIC_TRACKS = [
  {
    id: 'track1',
    name: 'The Antidote',
    file: require('../../assets/sounds/track3.mp3'),
  },
  {
    id: 'track2',
    name: 'El Equilibrio Perfecto',
    file: require('../../assets/sounds/track2.mp3'),
  },
  {
    id: 'track3',
    name: 'Lamerios theme',
    file: require('../../assets/sounds/track1.mp3'),
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
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const soundRef = useRef(null);
  const isLoadingRef = useRef(false);
  const currentTrackIndexRef = useRef(0); // Track the current index to avoid stale closures

  // Load persisted audio settings on mount
  useEffect(() => {
    const init = async () => {
      await loadAudioSettings();
      setSettingsLoaded(true);
    };
    init();
  }, []);

  // Setup audio only after settings are loaded
  useEffect(() => {
    if (!settingsLoaded) return;
    
    setupAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [settingsLoaded]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(volume);
    }
    // Persist volume state
    if (settingsLoaded) {
      saveAudioSetting(STORAGE_KEYS.VOLUME, volume);
    }
  }, [volume, settingsLoaded]);

  // Persist pause state
  useEffect(() => {
    if (settingsLoaded) {
      saveAudioSetting(STORAGE_KEYS.IS_PAUSED, isPaused);
    }
  }, [isPaused, settingsLoaded]);

  const loadAudioSettings = async () => {
    try {
      const [savedVolume, savedIsPaused] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.VOLUME),
        AsyncStorage.getItem(STORAGE_KEYS.IS_PAUSED),
      ]);

      if (savedVolume !== null) {
        setVolume(JSON.parse(savedVolume));
      }
      if (savedIsPaused !== null) {
        setIsPaused(JSON.parse(savedIsPaused));
      }
    } catch (error) {
      console.error('Error loading audio settings:', error);
    }
  };

  const saveAudioSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving audio setting ${key}:`, error);
    }
  };

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
        { shouldPlay: !isPaused, volume: volume },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setCurrentTrackIndex(index);
      currentTrackIndexRef.current = index; // Keep ref in sync
      setIsPlaying(!isPaused);
      
      // If it was paused, pause the newly loaded track
      if (isPaused) {
        await sound.pauseAsync();
      }
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
    // Use ref to get the current index, avoiding stale closure issues
    const nextIndex = (currentTrackIndexRef.current + 1) % MUSIC_TRACKS.length;
    loadAndPlayTrack(nextIndex);
  };

  const changeVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };

  const togglePlayPause = async () => {
    if (isPaused) {
      await resumeMusic();
    } else {
      await pauseMusic();
    }
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
    volume,
    changeVolume,
    currentTrack: MUSIC_TRACKS[currentTrackIndex],
    tracks: MUSIC_TRACKS,
    selectTrack,
    currentTrackIndex,
    isPlaying,
    isPaused,
    togglePlayPause,
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
