import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useExtractorCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';

import { GameAssets } from '../../../../components/AppLoader';

const ExtractorCard = ({ machine, navigation }) => {
  const {
    liveMachine,
    assignedNode,
    nodeDepletionData,
    status,
    machineColor,
    displayName,
    actions,
  } = useExtractorCard(machine);

  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View
      style={[
        styles.machineCard,
        {
          borderColor: machineColor,
        },
      ]}
    >
      {/* Machine Header */}
      <View
        style={{
          borderRadius: 8,
          padding: assignedNode ? 6 : 4,
          marginBottom: (assignedNode && isCollapsed) ? 0 : (assignedNode ? 12 : 0),
        }}
      >
        <View style={{ flexDirection: "column", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: assignedNode ? 12 : 8 }}>
              <View
                style={[styles.machineIconContainer, { borderColor: machineColor }]}
              >
                {getMachineIcon(machine.type, machineColor, 64)}
              </View>
              <Text style={[styles.machineName, { color: machineColor, fontSize: 16 }]}>
                {displayName}
              </Text>
            </View>

            {/* Show collapse toggle only when node is assigned */}
            {assignedNode ? (
              <TouchableOpacity
                onPress={() => setIsCollapsed(!isCollapsed)}
                style={{ padding: 8 }}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                  size={32}
                  color={machineColor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("NodeSelectorScreen", { machine: liveMachine })} activeOpacity={0.7} style={{ marginLeft: 8 }}>
                <LinearGradient
                  colors={["#00ffff", "#ff00cc"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 6, padding: 1.5 }}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderRadius: 5,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, color: Colors.textPrimary, fontWeight: "bold" }}>
                      Assign
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Assign Node Button - only show when expanded and has node */}
          {assignedNode && !isCollapsed && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("NodeSelectorScreen", {
                  machine: liveMachine,
                })
              }
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#00ffff', '#ff00cc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.assignNodeButton}
              >
                <View style={styles.assignNodeButtonInner}>
                  <Text style={styles.assignNodeText}>
                    {status.isIdle ? "Change" : "Change"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Collapsed View - only show when has node and is collapsed */}
      {assignedNode && isCollapsed && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          {assignedNode ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: Colors.accentGold,
                    width: 24,
                    height: 24,
                  },
                ]}
              >
                {assignedNode.type && GameAssets.icons[`${assignedNode.type}`] && (
                  <Image
                    source={GameAssets.icons[`${assignedNode.type}`]}
                    style={{ width: 12, height: 12 }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                {assignedNode.name}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>
              No node assigned
            </Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={[
                styles.selectedNodePill,
                {
                  backgroundColor: status.color + "20",
                  borderWidth: 1,
                  borderColor: status.color,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                },
              ]}
            >
              <Text style={{ fontSize: 10, color: status.color }}>
                {status.isIdle ? "Idle" : "Extracting"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Expanded Extractor Details */}
      {assignedNode && !isCollapsed && (
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.borderLight,
          }}
        >
          {/* Assigned node header */}
          <View
            style={[
              styles.headerRow,
              {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                marginBottom: 12,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: Colors.accentGold,
                  },
                ]}
              >
                {assignedNode.type &&
                  GameAssets.icons[`${assignedNode.type}`] && (
                    <Image
                      source={GameAssets.icons[`${assignedNode.type}`]}
                      style={{ width: 16, height: 16 }}
                    />
                  )}
              </View>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: Colors.accentGold, fontSize: 13, fontWeight: "600" },
                ]}
              >
                Assigned Node
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View style={{ marginBottom: 12, alignItems: "flex-start" }}>
            <View
              style={[
                styles.selectedNodePill,
                { backgroundColor: status.color + "40", borderWidth: 1, borderColor: status.color },
              ]}
            >
              <Text
                style={[
                  styles.selectedNodePillText,
                  { color: status.color, fontSize: 11 },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {status.text}
              </Text>
            </View>
          </View>

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
                status.isDepleted && status.isIdle && { opacity: 0.4 },
              ]}
              onPress={actions.handlePauseResume}
              activeOpacity={0.85}
              disabled={status.isDepleted && status.isIdle}
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
              style={[
                styles.detachButton,
                status.isDepleted && {
                  backgroundColor: Colors.textDanger + "20",
                  borderColor: Colors.textDanger,
                  borderWidth: 1,
                },
              ]}
              onPress={actions.handleDetachNode}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name="link-off"
                size={16}
                color={status.isDepleted ? Colors.textDanger : Colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.detachText, status.isDepleted && { color: Colors.textDanger }]}>
                Detach Extractor
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

export default ExtractorCard;