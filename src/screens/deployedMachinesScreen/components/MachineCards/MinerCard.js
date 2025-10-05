import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useMinerCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../MachineCard/styles';
import resStyles from '../MachineTypes/Smelter/components/ResourceList/styles';
import { getNodeTypeDefinition } from '../../../../data/nodeTypes';

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
            style={styles.assignNodeButton}
            onPress={() =>
              navigation.navigate("NodeSelectorScreen", { machine: liveMachine })
            }
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="select-marker"
              size={28}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.assignNodeText}>
              {liveMachine.assignedNodeId ? "Change" : "Assign"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Miner Details */}
      {assignedNode && (
        <View style={resStyles.card}>
          {/* Assigned node header */}
          <Text style={resStyles.sectionTitle}>Assigned Node</Text>
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
                {status.isIdle ? "Resume Mining" : "Pause Miner"}
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