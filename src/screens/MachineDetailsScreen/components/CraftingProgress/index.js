import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ProgressBar from "../../../../components/ProgressBar";
import styles from "./styles";

const CraftingProgress = ({ isProcessing, progress, processingTime, onCancel, totalAmount = 1 }) => {
  if (!isProcessing) return null;

  const totalTime = processingTime; // Ya viene multiplicado desde el screen principal

  return (
    <View style={styles.progressContainer}>
      <ProgressBar
       a value={progress}
        max={totalTime}
        label={null}
        color="#4CAF50"
        backgroundColor="#23233a"
        height={18}
        style={{ borderRadius: 8 }}
      />
      <Text style={styles.progressText}>
        {`Processing... ${progress.toFixed(1)}s / ${totalTime.toFixed(1)}s`}
      </Text>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CraftingProgress;