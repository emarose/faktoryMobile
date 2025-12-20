import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useOilExtractorCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';
import { getNodeTypeDefinition } from '../../../../data/nodeTypes';
import { GameAssets } from '../../../../components/AppLoader';

const OilExtractorCard = ({ machine, navigation }) => {
  const {
    liveMachine,
    assignedNode,
    nodeDepletionData,
    status,
    machineColor,
    displayName,
    actions,
  } = useOilExtractorCard(machine);

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
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.6)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 8,
          padding: 12,
          marginBottom: isCollapsed ? 0 : 12,
        }}
      >
        <View style={styles.rowAlignCenter}>
          <View style={styles.machineInfo}>
            <View style={styles.rowSpaceBetween}>
              <View style={styles.rowAlignCenterGap}>
                <View
                  style={[
                    styles.machineIconContainer,
                    { borderColor: machineColor, borderWidth: 2 },
                  ]}
                >
                  {getMachineIcon(machine.type, machineColor)}
                </View>
                <Text style={[styles.machineName, { color: machineColor }]}>
                  {displayName}
                </Text>
              </View>
            </View>
          </View>

          {/* Collapse Toggle */}
          <TouchableOpacity
            onPress={() => setIsCollapsed(!isCollapsed)}
            style={{ padding: 8 }}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
              size={24}
              color={machineColor}
            />
          </TouchableOpacity>
        </View>

        {/* Assign Node Button - only show when expanded */}
        {!isCollapsed && (
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
        )}
      </LinearGradient>

      {/* Collapsed View */}
      {isCollapsed && (
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
            {!status.isIdle && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.accentGreen,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 10,
                color: status.color,
                textTransform: "uppercase",
              }}
            >
              {status.isIdle ? "Idle" : "Active"}
            </Text>
          </View>
        </View>
      )}

      {/* Collapsed View */}
      {isCollapsed && (
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
            {!status.isIdle && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.accentGreen,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 10,
                color: status.color,
                textTransform: "uppercase",
              }}
            >
              {status.isIdle ? "Idle" : "Active"}
            </Text>
          </View>
        </View>
      )}

      {/* Expanded View - Oil Extractor Details */}
      {!isCollapsed && assignedNode && (
        <View style={styles.card}>
          {/* Assigned node header */}
          <Text style={styles.sectionTitle}>Assigned Node</Text>
          <View style={styles.headerRow}>
            {(() => {
              const nodeTypeDef = getNodeTypeDefinition(assignedNode.type);
              const pillColor = nodeTypeDef ? nodeTypeDef.color : Colors.fallback;
              return (
                <View style={[styles.selectedNodePill, { backgroundColor: pillColor }]}>
                  <Text style={styles.selectedNodePillText}>{assignedNode.name}</Text>
                </View>
              );
            })()}
            <Text style={[styles.machineStatus, { color: status.color }]}>
              {status.text}
            </Text>
          </View>

          {/* Depletion info */}
          {nodeDepletionData && (
            <View style={{ marginTop: 8 }}>
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
                {nodeDepletionData.timeToDepletion !== Infinity && !nodeDepletionData.isDepleted && (
                  <Text style={styles.depletionTime}>
                    ~{nodeDepletionData.timeToDepletion} min to depletion at current rate
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
                status.isIdle ? styles.pauseResumeIdle : styles.pauseResumeActive,
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
                {status.isIdle ? "Resume Extracting" : "Pause Extractor"}
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
              <Text style={styles.detachText}>Detach Extractor</Text>
            </TouchableOpacity>
          </View>
          
          {/* Configure Button */}
          <View style={[styles.controlButtonsContainer, { marginTop: 8 }]}>
            <TouchableOpacity
              style={[styles.configureButton, { backgroundColor: "#ff9800" }]}
              onPress={() => navigation.navigate("NodeSelectorScreen", { machine: liveMachine })}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name="cog"
                size={18}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.pauseResumeText}>
                Change Oil Node
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default OilExtractorCard;