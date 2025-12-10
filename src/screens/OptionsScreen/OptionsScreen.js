import React from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, FontSelector, CustomHeader } from '../../components';
import Colors from '../../constants/Colors';
import GameDataManager from './components/GameDataManager';
import ManualSave from './components/ManualSave';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudio } from '../../contexts/AudioContext';
import Slider from '@react-native-community/slider';
import styles from './styles';

const OptionsScreen = () => {
  const { volume, changeVolume, tracks, currentTrackIndex, selectTrack, isPaused, togglePlayPause } = useAudio();

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Options"
        rightIcon="factory"
        onRightIconPress={() => console.log('Factory icon pressed')}
      />
      <ImageBackground
        source={require('../../../assets/images/backgrounds/background.png')}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.4)", "rgba(58, 2, 66, 0.6)", "rgba(0, 0, 0, 0.5)"]}
          style={styles.gradientOverlay}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Music</Text>
          <View style={styles.optionCard}>
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Save</Text>
          <View style={styles.optionCard}>
            <ManualSave />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Data</Text>
          <View style={styles.optionCard}>
            <GameDataManager />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UI Settings</Text>
          <View style={styles.optionCard}>
            <FontSelector />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.optionCard}>
            <Text style={styles.versionText}>Faktory Mobile v1.0.0</Text>
            <Text style={styles.infoText}>A resource management and factory building game</Text>
          </View>
        </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};



export default OptionsScreen;