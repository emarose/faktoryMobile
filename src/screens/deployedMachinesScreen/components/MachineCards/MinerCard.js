import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../../components";
import ProgressBar from "../../../../components/ProgressBar";
import Colors from "../../../../constants/Colors";
import { useMinerCard } from "../../hooks";
import { getMachineIcon } from "../../hooks/useMachineCard";
import styles from "../../styles";
import resStyles from "../MachineTypes/Smelter/components/ResourceList/styles";
import { getNodeTypeDefinition } from "../../../../data/nodeTypes";
import { GameAssets } from "../../../../components/AppLoader";

const MinerCard = ({ machine, navigation }) => {
  const {
    liveMachine,
    assignedNode,
    nodeDepletionData,
    status,
    machineColor,
    displayName,
    actions,
  } = useMinerCard(machine);

  return (
    <View
      style={[
        styles.machineCard,
        {
          borderColor: machineColor,
          backgroundColor: Colors.backgroundPanel,
        },
      ]}
    >
      {/* Machine Header */}
      <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAlignCenterGap}>
              <View
                style={[
                  styles.machineIconContainer,
                  { backgroundColor: machineColor },
                ]}
              >
                {getMachineIcon(machine.type, Colors.textPrimary)}
              </View>
              <Text style={[styles.machineName, { color: machineColor }]}>
                {displayName}
              </Text>
            </View>
          </View>
        </View>

        {/* Assign Node Button */}
        <View style={styles.marginVertical10}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NodeSelectorScreen", {
                machine: liveMachine,
              })
            }
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#00ffff", "#ff00cc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.assignNodeButton}
            >
              <View style={styles.assignNodeButtonInner}>
                <Text style={styles.assignNodeText}>
                  {liveMachine.assignedNodeId ? "Change" : "Assign"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Miner Details */}
      {assignedNode && (
        <View style={resStyles.card}>
          {/* Assigned node header */}
          <View style={styles.headerRow}>
            <Text style={resStyles.sectionTitle}>Assigned Node</Text>

            <View style={styles.iconContainer}>
              {assignedNode.type &&
                GameAssets.icons[`${assignedNode.type}`] && (
                  <Image
                    source={GameAssets.icons[`${assignedNode.type}`]}
                    style={{ width: 16, height: 16 }}
                  />
                )}
            </View>
          </View>
          <Text
            style={[
              styles.machineStatus,
              { color: status.color, flex: 1, textAlign: "center" },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {status.text}
          </Text>

          {/* Depletion info */}
          {nodeDepletionData && (
            <View>
              <View style={styles.depletionSection}>
                <ProgressBar
                  value={nodeDepletionData.currentAmount}
                  max={nodeDepletionData.maxAmount}
                  label=""
                  color={
                    nodeDepletionData.isDepleted
                      ? "#ff6b6b"
                      : nodeDepletionData.isNearDepletion
                      ? "#ff9800"
                      : "#4CAF50"
                  }
                />
                {nodeDepletionData.timeToDepletion !== Infinity &&
                  !nodeDepletionData.isDepleted && (
                    <Text style={styles.depletionTime}>
                      ~{nodeDepletionData.timeToDepletion} min to depletion at
                      current rate
                    </Text>
                  )}
              </View>
            </View>
          )}

          {/* Controls */}
          <View style={[styles.controlButtonsContainer, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[
                styles.pauseResumeButton,
                status.isIdle
                  ? styles.pauseResumeIdle
                  : styles.pauseResumeActive,
              ]}
              onPress={actions.handlePauseResume}
              activeOpacity={0.85}
            >
              <MaterialIcons
                name={status.isIdle ? "play-arrow" : "pause"}
                size={18}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.pauseResumeText}>
                {status.isIdle ? "Resume" : "Pause"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detachButton}
              onPress={actions.handleDetachNode}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name="link-off"
                size={16}
                color={Colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.detachText}>Detach Miner</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default MinerCard;
