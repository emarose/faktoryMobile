import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGame } from "../../../../../../../contexts/GameContext";
import styles from "./styles";

const MinerControls = ({ machine, assignedNodeId }) => {
  const { setPlacedMachines } = useGame();

  const handlePauseResume = () => {
    setPlacedMachines((prevPlaced) =>
      prevPlaced.map((m) =>
        m.id === machine.id ? { ...m, isIdle: !m.isIdle } : m
      )
    );
  };

  const handleDetachNode = () => {
    setPlacedMachines((prevPlaced) =>
      prevPlaced.map((m) =>
        m.id === machine.id ? { ...m, assignedNodeId: undefined, isIdle: true } : m
      )
    );
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
