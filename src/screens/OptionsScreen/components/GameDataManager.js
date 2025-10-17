import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Text } from '../../../components';
import { useGame } from '../../../contexts/GameContext';
import Colors from '../../../constants/Colors';

const GameDataManager = () => {
  const { resetGameData } = useGame();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleResetGame = () => {
    setIsModalVisible(true);
  };

  const confirmResetGame = async () => {
    const success = await resetGameData();
    setIsModalVisible(false);
    
    if (success) {
      Alert.alert(
        "Game Reset", 
        "Game data has been reset successfully. The app will now restart.",
        [{ text: "OK" }]
      );
      // In a real scenario, you might want to restart the app or navigate to a start screen
    } else {
      Alert.alert(
        "Reset Failed", 
        "There was an error resetting the game data. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={handleResetGame}
      >
        <Text style={styles.resetButtonText}>New Game</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Game Data?</Text>
            <Text style={styles.modalMessage}>
              This will delete all your progress and start a new game. This action cannot be undone.
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmResetGame}
              >
                <Text style={styles.confirmButtonText}>Reset Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: Colors.textDanger,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.backgroundSecondary,
    marginRight: 10,
  },
  cancelButtonText: {
    color: Colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: Colors.textDanger,
  },
  confirmButtonText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
});

export default GameDataManager;