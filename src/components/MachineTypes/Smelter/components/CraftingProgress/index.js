import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import ProgressBar from "../../../../../components/ProgressBar";

const CraftingProgress = ({
  isProcessing,
  progress = 0,
  processingTime = 1,
  onCancel,
  totalAmount = 1,
}) => {
  if (!isProcessing) return null;

  const totalTime = processingTime; // Ya viene multiplicado desde el screen principal
  const safeProgress = Math.max(0, Number(progress) || 0);
  const safeTotalTime = Math.max(1, Number(totalTime) || 1);

  return (
    <View style={styles.progressContainer}>
      <ProgressBar
        value={safeProgress}
        max={safeTotalTime}
        label={null}
        color="#4CAF50"
        backgroundColor="#23233a"
        height={18}
        style={{ borderRadius: 8 }}
      />
      <Text style={styles.progressText}>
        {`Processing... ${safeProgress.toFixed(1)}s / ${safeTotalTime.toFixed(1)}s`}
      </Text>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CraftingProgress;
