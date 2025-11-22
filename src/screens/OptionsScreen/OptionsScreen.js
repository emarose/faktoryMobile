import React from 'react';
import { View, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, FontSelector, CustomHeader } from '../../components';
import Colors from '../../constants/Colors';
import GameDataManager from './components/GameDataManager';
import ManualSave from './components/ManualSave';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';

const OptionsScreen = () => {
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