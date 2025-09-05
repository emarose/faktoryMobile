import React, { useMemo, useState, useRef, useEffect } from "react";
import { Animated, Easing, View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { getNodeTypeDefinition } from "../../../../data/nodeTypes";
import ProgressBar from "../../../../components/ProgressBar";
import SmelterModal from "../MachineTypes/Smelter/components/SmelterModal";
import ConstructorModal from "../MachineTypes/Constructor/components/ConstructorModal";
import { useGame } from "../../../../contexts/GameContext";
import NodeSelectorModal from "../MachineTypes/Miner/components/NodeSelectorModal";

// helper: resource icon mapping (returns MaterialCommunityIcons name)
function getResourceIcon(resourceType) {
  if (!resourceType) return "cube-outline";
  const t = resourceType.toLowerCase();
  if (t.includes("iron")) return "circle-slice-8";
  if (t.includes("copper")) return "hexagon-multiple";
  if (t.includes("coal")) return "fire";
  if (t.includes("oil")) return "oil";
  if (t.includes("limestone")) return "square-outline";
  if (t.includes("uranium")) return "radioactive";
  return "cube-outline";
}

function getResourceColor(resourceType) {
  if (!resourceType) return "#4CAF50";
  const t = resourceType.toLowerCase();
  if (t.includes("iron")) return "#8B4513";
  if (t.includes("copper")) return "#CD7F32";
  if (t.includes("coal")) return "#2F2F2F";
  if (t.includes("oil")) return "#6a4c93";
  if (t.includes("limestone")) return "#bfbfbf";
  if (t.includes("uranium")) return "#00c853";
  return "#4CAF50";
}

function getMachineIcon(type) {
  switch (type) {
    case "miner":
      return (
        <MaterialCommunityIcons
          name="robot-industrial"
          size={28}
          color="#4CAF50"
        />
      );
    case "refinery":
      return (
        <MaterialCommunityIcons
          name="chemical-weapon"
          size={28}
          color="#ff4081"
        />
      );
    case "foundry":
      return (
        <MaterialCommunityIcons name="furnace" size={28} color="#ffb300" />
      );
    case "smelter":
      return (
        <MaterialCommunityIcons name="factory" size={28} color="#4CAF50" />
      );
    case "constructor":
      return (
        <MaterialCommunityIcons name="cog" size={28} color="#2196F3" />
      );
    default:
      return <MaterialIcons name="build" size={28} color="#aaa" />;
  }
}

const MachineCard = ({ machine, node, children, onPress }) => {
  const {
    setPlacedMachines,
    placedMachines,
  } = useGame();
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [showSmelterModal, setShowSmelterModal] = useState(false);
  const [showConstructorModal, setShowConstructorModal] = useState(false);

  const openNodeSelector = () => {
    setShowNodeSelector(true);
  };

  const closeNodeSelector = () => {
    setShowNodeSelector(false);
  };

  const openSmelterModal = () => {
    setShowSmelterModal(true);
  };

  const closeSmelterModal = () => {
    setShowSmelterModal(false);
  };

  const openConstructorModal = () => {
    setShowConstructorModal(true);
  };

  const closeConstructorModal = () => {
    setShowConstructorModal(false);
  };

  const handleSelectRecipe = (recipeId) => {
    setPlacedMachines((prev) =>
      prev.map((m) =>
        m.id === machine.id ? { ...m, currentRecipeId: recipeId } : m
      )
    );
    if (machine.type === "smelter") {
      closeSmelterModal();
    } else if (machine.type === "constructor") {
      closeConstructorModal();
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const props = {};
      if (machine.type === "miner") {
        props.onOpenModal = openNodeSelector;
      } else if (machine.type === "smelter") {
        props.onOpenModal = openSmelterModal;
      } else if (machine.type === "constructor") {
        props.onOpenModal = openConstructorModal;
      }
      return React.cloneElement(child, props);
    }
    return child;
  });

  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;

  return (
    <View style={styles.machineCard}>
      <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAlignCenterGap}>
              <View style={styles.machineIconContainer}>
                {getMachineIcon(machine.type)}
              </View>
              <Text style={[styles.machineName, { color: "#4CAF50" }]}>
                {machine.displayName || machine.name || machine.type}
              </Text>
            </View>
            {/* Show loupe icon for miners, smelters, and constructors */}
            {(machine.type === "miner" || machine.type === "smelter" || machine.type === "constructor") ? (
              <TouchableOpacity
                onPress={machine.type === "miner" ? onPress : undefined}
                style={styles.loupeButton}
                activeOpacity={0.7}
                disabled={machine.type === "smelter" || machine.type === "constructor"}
              >
                <MaterialIcons name="loupe" size={32} color="#bbb" />
              </TouchableOpacity>
            ) : null}
          </View>

          {childrenWithProps}

          {showSmelterModal && (
            <SmelterModal
              machine={liveMachine}
              visible={showSmelterModal}
              onClose={closeSmelterModal}
              onSelectRecipe={handleSelectRecipe}
            />
          )}
          {showConstructorModal && (
            <ConstructorModal
              machine={liveMachine}
              visible={showConstructorModal}
              onClose={closeConstructorModal}
            />
          )}
          {showNodeSelector && (
            <NodeSelectorModal
              visible={showNodeSelector}
              slideAnim={slideAnim}
              onClose={closeNodeSelector}
              groupedNodes={groupedNodes}
              selectedResourceType={selectedResourceType}
              setSelectedResourceType={setSelectedResourceType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredNodes={filteredNodes}
              handleAssignNode={handleAssignNode}
              getResourceIcon={getResourceIcon}
              getResourceColor={getResourceColor}
              calculateDistance={calculateDistance}
            />
          )}
          {/* Node info and depletion/progress bar for any assigned node */}
          {node && (
            <View style={styles.nodeInfoContainer}>
              {/* Encabezado del Nodo (Nombre y Estado) */}
              <View style={styles.headerRow}>
                {isMiner && node && (
                  (() => {
                    const nodeTypeDef = getNodeTypeDefinition(node.type);
                    const pillColor = nodeTypeDef ? nodeTypeDef.color : '#333';
                    return (
                      <View style={[styles.selectedNodePill, { backgroundColor: pillColor }]}> 
                        <Text style={styles.selectedNodePillText}>{node.name}</Text>
                      </View>
                    );
                  })()
                )}
                <Text style={styles.machineStatus}>
                  {isIdle ? "Miner is on hold" : machine.statusText}
                </Text>
              </View>

              {/* Barra de Progreso y Mensaje de Depleción */}
              <View style={styles.depletionSection}>
                <ProgressBar
                  value={nodeDepletionAmount}
                  max={nodeCapacity}
                  label={"Node Depletion"}
                />
                {nodeDepletionAmount <= 0 && (
                  <Text style={styles.nodeDepletedText}>Node Depleted</Text>
                )}
              </View>

              {/* Controles del Minero (Botones) */}
              {isMiner && node && (
                <View style={styles.controlButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.pauseResumeButton,
                      isIdle
                        ? styles.pauseResumeIdle
                        : styles.pauseResumeActive,
                    ]}
                    onPress={handlePauseResume}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name={isIdle ? "play-arrow" : "pause"}
                      size={18}
                      color="#fff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.pauseResumeText}>
                      {isIdle ? "Resume Mining" : "Pause Miner"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detachButton}
                    onPress={() => {
                      setPlacedMachines((prevPlaced) =>
                        prevPlaced.map((m) =>
                          m.id === liveMachine.id
                            ? { ...m, isIdle: true, assignedNodeId: undefined }
                            : m
                        )
                      );
                    }}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name="link-off"
                      size={16}
                      color="#bbb"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.detachText}>Detach Miner</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MachineCard;
