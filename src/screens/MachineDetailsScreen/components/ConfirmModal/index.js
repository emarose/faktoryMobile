import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from "../../styles";

const ConfirmModal = ({ visible, maxCraftable, processingTime, onConfirm, onCancel }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            You're about to craft {maxCraftable} items. This
            will take{" "}
            {(processingTime * maxCraftable).toFixed(1)}s.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                backgroundColor: "#4CAF50",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                marginRight: 10,
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                backgroundColor: "#23233a",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#444455",
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#bbb", fontWeight: "bold" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;