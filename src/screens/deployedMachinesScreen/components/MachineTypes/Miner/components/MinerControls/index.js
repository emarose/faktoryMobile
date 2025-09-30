import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGame } from "../../../../../../../contexts/GameContext";
import styles from "./styles";

const MinerControls = ({ machine, assignedNodeId }) => {
  const { pauseMiner, resumeMiner, detachMachine } = useGame();

  const handlePauseResume = () => {
    if (machine.isIdle) {
      // User requested resume
      resumeMiner(machine.id, { user: true });
    } else {
      // User requested pause
      pauseMiner(machine.id, { user: true });
    }
  };

  const handleDetachNode = () => {
    // Detach the machine from node and mark as user-paused
    detachMachine(machine.id);
  };

  if (!assignedNodeId) return null;

  return (
    <View style={styles.controlButtonsContainer}>
      <TouchableOpacity
        style={[
          styles.pauseResumeButton,
          machine.isIdle ? styles.pauseResumeIdle : styles.pauseResumeActive,
        ]}
        onPress={handlePauseResume}
        activeOpacity={0.85}
      >
        <MaterialIcons
          name={machine.isIdle ? "play-arrow" : "pause"}
          size={18}
          color="#fff"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.pauseResumeText}>
          {machine.isIdle ? "Resume Mining" : "Pause Miner"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.detachButton}
        onPress={handleDetachNode}
        activeOpacity={0.85}
      >
        <MaterialIcons
          name="link-off"
          size={16}
          color="#bbb"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.detachText}>Detach Node</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MinerControls;
