import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Text } from '../../../../components';
import { useAudio } from '../../../../contexts/AudioContext';
import styles from './styles';

const MusicControls = () => {
  const { volume, changeVolume, tracks, currentTrackIndex, selectTrack, isPaused, togglePlayPause } = useAudio();

  return (
    <>
      {/* Volume Slider */}
      <View style={styles.volumeControl}>
        <View style={styles.volumeHeader}>
          <MaterialCommunityIcons
            name={volume === 0 ? 'volume-off' : volume < 0.5 ? 'volume-medium' : 'volume-high'}
            size={24}
            color="#fff"
          />
          <Text style={styles.volumeLabel}>Master Volume</Text>
          <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
        </View>
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={changeVolume}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#666"
          thumbTintColor="#4CAF50"
        />
      </View>

      {/* Play/Pause Button */}
      <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
        <View style={styles.optionLeft}>
          <MaterialCommunityIcons
            name={isPaused ? 'play-circle' : 'pause-circle'}
            size={24}
            color="#fff"
          />
          <Text style={styles.optionText}>
            {isPaused ? 'Music Paused' : 'Music Playing'}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={isPaused ? 'play' : 'pause'}
          size={32}
          color={isPaused ? '#666' : '#4CAF50'}
        />
      </TouchableOpacity>

      {/* Track Selection */}
      <View style={styles.trackList}>
        <Text style={styles.trackListTitle}>Track Selection</Text>
        {tracks.map((track, index) => (
          <TouchableOpacity
            key={track.id}
            style={[
              styles.trackOption,
              currentTrackIndex === index && styles.trackOptionActive,
            ]}
            onPress={() => selectTrack(index)}
          >
            <MaterialCommunityIcons
              name={currentTrackIndex === index ? 'music-circle' : 'music-circle-outline'}
              size={20}
              color={currentTrackIndex === index ? '#4CAF50' : '#fff'}
            />
            <Text
              style={[
                styles.trackText,
                currentTrackIndex === index && styles.trackTextActive,
              ]}
            >
              {track.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default MusicControls;
