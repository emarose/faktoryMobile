import React, { useContext, useMemo } from "react";
import { GameContext } from "../../contexts/GameContext";
import milestones from "../../data/milestones";
import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Text } from "../../components";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceOverviewHeader from "./components/ResourceOverviewHeader/ResourceOverviewHeader";
import { items } from "../../data/items";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FactoryScreen() {
  const navigation = useNavigation();
  const { 
    currentMilestone, 
    inventory, 
    discoveredNodes, 
    placedMachines, 
    craftingQueue 
  } = useContext(GameContext);
  
  // Busca el milestone completo para acceder a requirementsDescription
  const milestoneFull = currentMilestone
    ? milestones.find((m) => m.id === currentMilestone.id)
    : null;

  // Helper function to get item display name
  const getItemDisplayName = (itemKey) => {
    // Handle special cases
    if (itemKey === 'discoveredNodes') return 'Resource Nodes discovered';
    
    // Find in items data
    const item = items[itemKey];
    if (item?.name) return item.name;
    
    // Convert camelCase to readable format
    return itemKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Get current inventory amount for a requirement
  const getCurrentAmount = (requirementKey) => {
    if (requirementKey === 'discoveredNodes') {
      return Object.keys(discoveredNodes).filter(nodeId => discoveredNodes[nodeId]).length;
    }
    
    return inventory[requirementKey]?.currentAmount || 0;
  };

  // Calculate milestone progress requirements
  const milestoneProgress = useMemo(() => {
    if (!milestoneFull?.requirements) return [];
    
    return Object.entries(milestoneFull.requirements).map(([key, required]) => ({
      key,
      name: getItemDisplayName(key),
      current: getCurrentAmount(key),
      required,
      completed: getCurrentAmount(key) >= required,
      percentage: Math.min((getCurrentAmount(key) / required) * 100, 100)
    }));
  }, [milestoneFull, inventory, discoveredNodes]);

  // Check if milestone is fully completed
  const isMilestoneCompleted = milestoneProgress.every(item => item.completed);

  // Calculate deployed machines summary
  const machinesSummary = useMemo(() => {
    if (!placedMachines || placedMachines.length === 0) return [];

    // Group machines by type and calculate stats
    const machineGroups = {};
    placedMachines.forEach(machine => {
      const type = machine.type;
      if (!machineGroups[type]) {
        machineGroups[type] = {
          type,
          name: items[type]?.name || type,
          count: 0,
          activeCount: 0,
          processingCount: 0,
          idleCount: 0,
        };
      }
      
      machineGroups[type].count++;
      
      // Check machine status
      if (machine.isIdle) {
        machineGroups[type].idleCount++;
      } else if (type === "miner" || type === "oilExtractor") {
        machineGroups[type].activeCount++;
      } else {
        // For crafting machines, check if they have active processes
        const activeProcesses = craftingQueue.filter(
          proc => proc.machineId === machine.id && proc.status === "pending"
        );
        if (activeProcesses.length > 0) {
          machineGroups[type].processingCount++;
        } else {
          machineGroups[type].activeCount++;
        }
      }
    });

    return Object.values(machineGroups);
  }, [placedMachines, craftingQueue]);

  return (
    <SafeAreaView style={styles.container}>
      <ResourceOverviewHeader />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{}}>
          <TouchableOpacity
            style={[styles.gridItem, styles.milestoneCard]}
            onPress={() => navigation.navigate("MilestonesScreen")}
          >
            <View style={styles.milestoneHeader}>
              <MaterialCommunityIcons 
                name={isMilestoneCompleted ? "check-circle" : "star"} 
                size={28} 
                color={isMilestoneCompleted ? "#4CAF50" : "#ffd700"}
              />
              {currentMilestone && !currentMilestone.unlocked ? (
                <View style={styles.milestoneInfo}>
                  <Text style={styles.milestoneTitle}>
                    {currentMilestone.name}
                  </Text>
                  <Text style={styles.milestoneDescription}>
                    {milestoneFull?.requirementsDescription}
                  </Text>
                </View>
              ) : (
                <Text style={styles.completedText}>
                  All milestones completed!
                </Text>
              )}
            </View>
            
            {/* Progress bars for each requirement */}
            {currentMilestone && !currentMilestone.unlocked && milestoneProgress.length > 0 && (
              <View style={styles.progressSection}>
                {milestoneProgress.map((requirement) => (
                  <View key={requirement.key} style={styles.requirementRow}>
                    <View style={styles.requirementHeader}>
                      <Text style={styles.requirementName}>
                        {requirement.name}
                      </Text>
                      <Text style={[
                        styles.requirementCount,
                        requirement.completed && styles.requirementCompleted
                      ]}>
                        {requirement.current}/{requirement.required}
                      </Text>
                    </View>
                    <View style={styles.miniProgressBar}>
                      <View 
                        style={[
                          styles.miniProgressFill,
                          {
                            width: `${requirement.percentage}%`,
                            backgroundColor: requirement.completed ? "#4CAF50" : "#ffd700"
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
                
                {/* Overall completion indicator */}
                <View style={styles.overallProgress}>
                  <Text style={styles.overallProgressText}>
                    {milestoneProgress.filter(r => r.completed).length}/{milestoneProgress.length} completed
                  </Text>
                  {isMilestoneCompleted && (
                    <Text style={styles.readyToComplete}>
                      Ready to complete! 🎉
                    </Text>
                  )}
                </View>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("BuildScreen")}
          >
            <Text style={styles.gridItemTitle}>Build Machines</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MapScreen")}
          >
            <Text style={styles.gridItemTitle}>World Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, styles.deployedMachinesCard]}
            onPress={() => navigation.navigate("DeployedMachinesScreen")}
          >
            <View style={styles.deployedMachinesHeader}>
              <MaterialCommunityIcons name="factory" size={24} color="#4CAF50" />
              <Text style={styles.gridItemTitle}>Deployed Machines</Text>
              <Text style={styles.totalMachinesCount}>
                {placedMachines?.length || 0} total
              </Text>
            </View>
            
            {/* Mini summary of machines */}
            {machinesSummary.length > 0 && (
              <View style={styles.machinesSummaryContainer}>
                {machinesSummary.slice(0, 4).map((machineGroup) => (
                  <View key={machineGroup.type} style={styles.machineGroupSummary}>
                    <View style={styles.machineGroupHeader}>
                      <MaterialCommunityIcons 
                        name={
                          machineGroup.type === "miner" ? "robot-industrial" :
                          machineGroup.type === "smelter" ? "fire" :
                          machineGroup.type === "constructor" ? "hammer-wrench" :
                          machineGroup.type === "oilExtractor" ? "oil-lamp" :
                          "cog"
                        } 
                        size={16} 
                        color="#b8c7d1" 
                      />
                      <Text style={styles.machineGroupName}>
                        {machineGroup.name}
                      </Text>
                      <Text style={styles.machineGroupCount}>
                        x{machineGroup.count}
                      </Text>
                    </View>
                    
                    {/* Status indicators */}
                    <View style={styles.statusIndicators}>
                      {machineGroup.activeCount > 0 && (
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: "#4CAF50" }]} />
                          <Text style={styles.statusText}>{machineGroup.activeCount}</Text>
                        </View>
                      )}
                      {machineGroup.processingCount > 0 && (
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: "#2196F3" }]} />
                          <Text style={styles.statusText}>{machineGroup.processingCount}</Text>
                        </View>
                      )}
                      {machineGroup.idleCount > 0 && (
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: "#ff9800" }]} />
                          <Text style={styles.statusText}>{machineGroup.idleCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
                
                {machinesSummary.length > 4 && (
                  <Text style={styles.moreMachinesText}>
                    +{machinesSummary.length - 4} more types...
                  </Text>
                )}
              </View>
            )}
            
            {machinesSummary.length === 0 && (
              <Text style={styles.noMachinesText}>No machines deployed yet</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("InventoryScreen")}
          >
            <Text style={styles.gridItemTitle}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ProductAssemblyScreen")}
          >
            <Text style={styles.gridItemTitle}>Product Assembly</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
