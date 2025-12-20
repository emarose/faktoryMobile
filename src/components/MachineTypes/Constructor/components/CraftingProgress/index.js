import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styles from "./styles";
import ProgressBar from "../../../../../components/ProgressBar";
import { Text } from "../../../../../components";

const CraftingProgress = ({
  isProcessing,
  machineProcesses,
  maxCraftable,
}) => {
  const [progress, setProgress] = useState(0);

  const currentProcess = machineProcesses && machineProcesses.length > 0 ? machineProcesses[0] : null;

  useEffect(() => {
    if (!currentProcess) {
      setProgress(0);
      return;
    }

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = (now - currentProcess.startedAt) / 1000;
      const currentProgress = Math.min(elapsed, currentProcess.processingTime);
      setProgress(currentProgress);
    };

    // Update immediately
    updateProgress();

    // Set up interval to update progress
    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [currentProcess]);

  if (!isProcessing || !currentProcess) return null;

  return (
    <View style={styles.progressContainer}>
      <ProgressBar
        value={progress}
        max={currentProcess.processingTime}
        label={null}
        color="#4CAF50"
        backgroundColor="#23233a"
        height={18}
        style={{ borderRadius: 8 }}
      />
      <Text style={styles.progressText}>
        {`Processing ${currentProcess.itemName}... ${progress.toFixed(1)}s / ${currentProcess.processingTime.toFixed(1)}s`}
      </Text>
      {machineProcesses.length > 1 && (
        <Text style={styles.queueText}>
          {`${machineProcesses.length - 1} more in queue`}
        </Text>
      )}
    </View>
  );
};

export default CraftingProgress;
