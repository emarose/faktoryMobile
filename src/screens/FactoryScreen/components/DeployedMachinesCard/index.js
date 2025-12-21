import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { items } from "../../../../data/items";
import styles from "./styles";
import Colors from "../../../../constants/Colors";
import { getMachineIcon } from "../../../DeployedMachinesScreen/hooks/useMachineCard";

const DeployedMachinesCard = ({
  placedMachines,
  ownedMachines,
  craftingQueue,
  allResourceNodes,
  onPress,
}) => {
  // Process individual machines with detailed information
  const machinesWithDetails = useMemo(() => {
    // Combine placed machines and owned machines, avoiding duplicates
    const machineMap = new Map();

    // Add placed machines first (they have priority)
    (placedMachines || []).forEach((machine) => {
      machineMap.set(machine.id, { ...machine, source: "placed" });
    });

    // Add owned machines only if they're not already in placed machines
    (ownedMachines || []).forEach((machine) => {
      if (!machineMap.has(machine.id)) {
        machineMap.set(machine.id, { ...machine, source: "owned" });
      }
    });

    const allMachines = Array.from(machineMap.values());

    if (allMachines.length === 0) return [];

    // Add detailed status info to each machine
    const detailedMachines = allMachines.map((machine) => {
      const machineInfo = items[machine.type] || {};
      let status = "idle";
      let activity = "Inactive";
      let progress = null;
      let outputInfo = null;

      // Determine machine status and activity
      if (machine.isIdle) {
        status = "idle";
        activity = "Idle";
      } else if (machine.type === "miner" || machine.type === "extractor") {
        // Check if miner has an assigned node
        if (machine.assignedNodeId && allResourceNodes) {
          // Find the assigned node
          const assignedNode = allResourceNodes.find(
            (node) => node.id === machine.assignedNodeId
          );

          if (assignedNode) {
            status = machine.isIdle ? "idle" : "active";

            // Get the resource type from the node type
            const nodeTypeKey = assignedNode.type;
            const nodeTypeInfo = items[nodeTypeKey];

            if (nodeTypeInfo && nodeTypeInfo.output) {
              const outputKeys = Object.keys(nodeTypeInfo.output);
              const resourceKey = outputKeys[0];
              const resourceInfo = items[resourceKey];
              const resourceName = resourceInfo
                ? resourceInfo.name
                : resourceKey;

              activity = machine.isIdle
                ? `Paused (${resourceName})`
                : `Mining ${resourceName}`;
              outputInfo = assignedNode.name;
            } else {
              activity = machine.isIdle ? "Paused" : "Mining";
              outputInfo = assignedNode.name;
            }
          } else {
            // Node not found (might be deleted)
            status = "idle";
            activity = "Node not found";
            outputInfo = "Invalid assignment";
          }
        } else {
          // Miner exists but no node assigned
          status = "idle";
          outputInfo = "No node assigned";
        }
      } else {
        // For crafting machines, check if they have active processes
        const activeProcesses = craftingQueue.filter(
          (proc) => proc.machineId === machine.id && proc.status === "pending"
        );

        if (activeProcesses.length > 0) {
          status = "processing";
          const currentProcess = activeProcesses[0];
          
          // Use the correct properties from the actual process object
          const itemName = currentProcess.itemName || items[currentProcess.recipeId]?.name || currentProcess.recipeId || 'Unknown Item';
          const quantity = 1; // Default to 1 as recipes typically produce single items
          
          activity = `Crafting ${itemName}`;

          // Calculate progress using the correct time properties
          if (currentProcess.startedAt && currentProcess.endsAt) {
            const elapsed = Date.now() - currentProcess.startedAt;
            const total = currentProcess.endsAt - currentProcess.startedAt;
            progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
          }

          outputInfo = `${quantity}x ${itemName}`;
        } else {
          status = "active";
          activity = "Ready for work";
        }
      }

      return {
        ...machine,
        machineName: machineInfo.name || machine.type,
        status,
        activity,
        progress,
        outputInfo,
        location: machine.position
          ? `(${machine.position.x}, ${machine.position.y})`
          : null,
      };
    });

    // Sort by status priority and then by type
    return detailedMachines.sort((a, b) => {
      const statusPriority = { processing: 0, active: 1, idle: 2 };
      const aPriority = statusPriority[a.status] || 3;
      const bPriority = statusPriority[b.status] || 3;

      if (aPriority === bPriority) {
        return a.type.localeCompare(b.type);
      }
      return aPriority - bPriority;
    });
  }, [placedMachines, ownedMachines, craftingQueue, allResourceNodes]);

  // Calculate summary stats
  const totalMachines = machinesWithDetails.length;
  const totalActive = machinesWithDetails.filter(
    (m) => m.status === "active"
  ).length;
  const totalProcessing = machinesWithDetails.filter(
    (m) => m.status === "processing"
  ).length;
  const totalIdle = machinesWithDetails.filter(
    (m) => m.status === "idle"
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "processing":
        return "#2196F3";
      case "idle":
        return "#FF9800";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return "play-circle";
      case "processing":
        return "cog";
      case "idle":
        return "pause-circle";
      default:
        return "help-circle";
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#00ffff', '#ff00cc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 10,
          padding: 2,
        }}
      >
        <View style={{ borderRadius: 10, backgroundColor: "rgba(0,0,0,0.8)" }}>
          {/* Header with total summary */}
          <View style={styles.cardHeader}>
            <Text style={styles.gridItemTitle}>Deployed Machines</Text>
            {totalMachines > 0 && (
              <View style={styles.totalSummary}>
                <View style={styles.totalStatusBar}>
                  {totalActive > 0 && (
                    <View
                      style={[
                        styles.statusSegment,
                        {
                          backgroundColor: "#4CAF50",
                          flex: totalActive,
                        },
                      ]}
                    />
                  )}
                  {totalProcessing > 0 && (
                    <View
                      style={[
                        styles.statusSegment,
                        {
                          backgroundColor: "#2196F3",
                          flex: totalProcessing,
                        },
                      ]}
                    />
                  )}
                  {totalIdle > 0 && (
                    <View
                      style={[
                        styles.statusSegment,
                        {
                          backgroundColor: "#FF9800",
                          flex: totalIdle,
                        },
                      ]}
                    />
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Status legend */}
          {totalMachines > 0 && (
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.6)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statusLegend}
            >
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
                <Text style={styles.legendText}>Active ({totalActive})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#2196F3" }]} />
                <Text style={styles.legendText}>
                  Processing ({totalProcessing})
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#FF9800" }]} />
                <Text style={styles.legendText}>Idle ({totalIdle})</Text>
              </View>
            </LinearGradient>
          )}

          {/* Individual machines list */}
          {machinesWithDetails.length > 0 && (
            <View style={styles.machinesListContainer}>
              {machinesWithDetails.slice(0, 4).map((machine, index) => (
                <View
                  key={`machine-${machine.id}-${index}`}
                  style={styles.individualMachineRow}
                >
                  {/* Machine basic info */}
                  <View style={styles.machineBasicInfo}>
                    <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
                      {getMachineIcon(machine.type, "#64B5F6", 48)}
                    </View>
                    <View style={styles.machineNameContainer}>
                      <Text style={styles.individualMachineName}>
                        {machine.machineName}
                      </Text>
                      {machine.location && (
                        <Text style={styles.machineLocation}>
                          {machine.location}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Status and activity */}
                  <View style={styles.machineStatusContainer}>
                    <View style={styles.statusRow}>
                      <MaterialCommunityIcons
                        name={getStatusIcon(machine.status)}
                        size={14}
                        color={getStatusColor(machine.status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(machine.status) },
                        ]}
                      >
                        {machine.status.charAt(0).toUpperCase() +
                          machine.status.slice(1)}
                      </Text>
                    </View>

                    <Text style={styles.activityText} numberOfLines={1}>
                      {machine.activity}
                    </Text>

                    {machine.outputInfo && (
                      <Text style={styles.outputText} numberOfLines={1}>
                        → {machine.outputInfo}
                      </Text>
                    )}

                    {/* Progress bar for processing machines */}
                    {machine.progress !== null && (
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${machine.progress}%`,
                                backgroundColor: getStatusColor(machine.status),
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {Math.round(machine.progress)}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {machinesWithDetails.length > 4 && (
                <View style={styles.moreItemsContainer}>
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={16}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.moreItemsText}>
                    +{machinesWithDetails.length - 4} more machines...
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default DeployedMachinesCard;
