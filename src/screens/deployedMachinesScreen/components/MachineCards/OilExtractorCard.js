import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useOilExtractorCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';
import { getNodeTypeDefinition } from '../../../../data/nodeTypes';

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

        {/* Assign Node Button */}
        <View style={styles.marginVertical10}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NodeSelectorScreen", { machine: liveMachine })
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
                <MaterialCommunityIcons
                  name="select-marker"
                  size={20}
                  color={Colors.textPrimary}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.assignNodeText}>
                  {liveMachine.assignedNodeId ? "Change" : "Assign"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Oil Extractor Details */}
      {assignedNode && (
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