import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ProgressBar from "../../../../components/ProgressBar";
import styles from "./styles";

const CraftingProgress = ({ isProcessing, progress, processingTime, maxCraftable, onCancel }) => {
  if (!isProcessing) return null;
  
  return (
    <View style={styles.progressContainer}>
      <ProgressBar
        value={progress}
        max={
          isProcessing === "max"
            ? processingTime * maxCraftable
            : processingTime
        }
        label={null}
        color="#4CAF50"
        backgroundColor="#23233a"
        height={18}
        style={{ borderRadius: 8 }}
      />
      <Text style={styles.progressText}>
        {isProcessing === "max"
          ? `Processing... ${progress.toFixed(1)}s / ${(
              processingTime * maxCraftable
            ).toFixed(1)}s`
          : `Processing... ${progress.toFixed(
              1
            )}s / ${processingTime}s`}
      </Text>
      <TouchableOpacity
        onPress={onCancel}
        style={styles.cancelButton}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CraftingProgress;