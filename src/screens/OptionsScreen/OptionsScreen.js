import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, FontSelector } from '../../components';
import Colors from '../../constants/Colors';
import GameDataManager from './components/GameDataManager';
import ManualSave from './components/ManualSave';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OptionsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="cog" size={32} color={Colors.accentGold} />
          <Text style={styles.headerText}>Options</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.accentGold,
    marginBottom: 8,
  },
  optionCard: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
});

export default OptionsScreen;