import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../components';
import { useGame } from '../../../contexts/GameContext';
import { useToastContext } from '../../../contexts/ToastContext';
import Colors from '../../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ManualSave = () => {
  const { saveGameManually, saveTimestamp } = useGame();
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState(false);

  const formatDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  };

  const handleManualSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    showToast("Saving game...", 2000);
    
    try {
      const success = await saveGameManually();
      if (success) {
        showToast("Game saved successfully!", 2000);
      } else {
        showToast("Failed to save game", 3000);
      }
    } catch (error) {
      console.error('Error during manual save:', error);
      showToast("Failed to save game", 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        {saveTimestamp && (
          <Text style={styles.saveInfo}>
            Last saved: {formatDateTime(saveTimestamp)}
          </Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleManualSave}
        disabled={isSaving}
      >
        <MaterialCommunityIcons 
          name="content-save" 
          size={20} 
          color={Colors.textPrimary} 
          style={styles.saveIcon} 
        />
        <Text style={styles.saveButtonText}>
          {isSaving ? "Saving..." : "Save Game"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  infoContainer: {
    marginBottom: 10,
  },
  saveInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.accentBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  saveButtonText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveIcon: {
    marginRight: 8,
  },
});

export default ManualSave;