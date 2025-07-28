import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

const NodeDetailsModal = ({
  visible,
  node,
  onClose,
  onExtract,
  onPlaceMachine,
  isAssigned,
}) => {
  if (!node) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{node.name}</Text>
          <Text style={styles.modalSubtitle}>Type: {node.type}</Text>
          <Text style={styles.modalText}>Ore Remaining: {node.amount}</Text>
          {isAssigned ? (
            <Text style={styles.modalText}>Machine Placed: ⚙️</Text>
          ) : (
            <TouchableOpacity
              style={styles.modalButton}
              onPress={onPlaceMachine}
            >
              <Text style={styles.modalButtonText}>Place Machine</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.modalButton} onPress={onExtract}>
            <Text style={styles.modalButtonText}>Extract Ore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NodeDetailsModal;
