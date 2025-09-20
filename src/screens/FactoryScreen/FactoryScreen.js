import React, { useContext, useMemo } from "react";
import { GameContext } from "../../contexts/GameContext";
import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Text, CustomHeader } from "../../components";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceOverviewHeader from "./components/ResourceOverviewHeader/ResourceOverviewHeader";
import MilestoneCard from "./components/MilestoneCard";
import { items } from "../../data/items";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FactoryScreen() {
  const navigation = useNavigation();
  const { 
    currentMilestone, 
    inventory, 
    discoveredNodes, 
    placedMachines, 
    ownedMachines,
    craftingQueue 
  } = useContext(GameContext);

  // Calculate deployed machines summary
  const machinesSummary = useMemo(() => {
    try {
      // Combine all machines like DeployedMachinesScreen does
      const placedMachinesArray = Array.isArray(placedMachines) ? placedMachines : [];
      const ownedMachinesArray = Array.isArray(ownedMachines) ? ownedMachines : [];
    
    const allMachines = [
      ...placedMachinesArray,
      ...ownedMachinesArray.filter((m) => m && !placedMachinesArray.some((p) => p && p.id === m.id)),
    ];
    
    if (allMachines.length === 0) return [];

    // Group machines by type and calculate stats
    const machineGroups = Object.create(null); // Create object without prototype to avoid 'constructor' collision
    allMachines.forEach(machine => {
      // Safety check - ensure machine is valid and has a type
      if (!machine || !machine.type) {
        return;
      }
      
      const type = machine.type;
      
      if (!machineGroups[type]) {
        machineGroups[type] = {
          type,
          name: items[type]?.name || type,
          count: 0,
          activeCount: 0,
          processingCount: 0,
          idleCount: 0,
          pausedCount: 0,
          resources: new Set(), // Track what resources are being mined/processed
          totalProgress: 0, // For averaging progress
          machines: [] // Store individual machines for detailed info
        };
      }
      
      machineGroups[type].count++;
      
      // Safety check before push operation
      if (!machineGroups[type].machines) {
        machineGroups[type].machines = [];
      }
      if (Array.isArray(machineGroups[type].machines)) {
        machineGroups[type].machines.push(machine);
      } else {
        console.warn('machineGroups machines property is not an array:', machineGroups[type].machines);
        machineGroups[type].machines = [machine];
      }
      
      // Check machine status and gather resource info
      if (machine.isIdle) {
        machineGroups[type].idleCount++;
      } else if (type === "miner" || type === "oilExtractor") {
        machineGroups[type].activeCount++;
        
        // Track what resource is being mined
        if (machine.assignedNodeId && discoveredNodes) {
          const nodeData = discoveredNodes[machine.assignedNodeId];
          if (nodeData && nodeData.type) {
            const resourceName = items[nodeData.type]?.name || nodeData.type;
            if (resourceName) {
              // Safety check for resources Set
              if (!machineGroups[type].resources || typeof machineGroups[type].resources.add !== 'function') {
                machineGroups[type].resources = new Set();
              }
              machineGroups[type].resources.add(resourceName);
            }
          }
        }
      } else {
        // For crafting machines, check if they have active processes
        const activeProcesses = (craftingQueue || []).filter(
          proc => proc && proc.machineId === machine.id
        );
        
        if (activeProcesses.length > 0) {
          const currentProcess = activeProcesses[0];
          if (currentProcess && currentProcess.status === "pending") {
            machineGroups[type].processingCount++;
            
            // Calculate progress with safety checks
            if (currentProcess.startedAt && currentProcess.processingTime) {
              const now = Date.now();
              const elapsed = (now - currentProcess.startedAt) / 1000;
              const totalTime = currentProcess.processingTime;
              const progress = Math.min(elapsed / totalTime, 1) * 100;
              if (!isNaN(progress)) {
                machineGroups[type].totalProgress += progress;
              }
            }
            
            // Track what's being crafted
            if (currentProcess.recipeId && items[currentProcess.recipeId] && items[currentProcess.recipeId].name) {
              // Safety check for resources Set
              if (!machineGroups[type].resources || typeof machineGroups[type].resources.add !== 'function') {
                machineGroups[type].resources = new Set();
              }
              machineGroups[type].resources.add(items[currentProcess.recipeId].name);
            }
          } else if (currentProcess && currentProcess.status === "paused") {
            machineGroups[type].pausedCount++;
            if (currentProcess.recipeId && items[currentProcess.recipeId] && items[currentProcess.recipeId].name) {
              // Safety check for resources Set
              if (!machineGroups[type].resources || typeof machineGroups[type].resources.add !== 'function') {
                machineGroups[type].resources = new Set();
              }
              machineGroups[type].resources.add(items[currentProcess.recipeId].name);
            }
          }
        } else {
          machineGroups[type].activeCount++;
        }
      }
    });
    
    // Calculate average progress for each group
    Object.values(machineGroups).forEach(group => {
      if (group && typeof group.processingCount === 'number' && group.processingCount > 0 && typeof group.totalProgress === 'number') {
        group.averageProgress = group.totalProgress / group.processingCount;
      } else {
        group.averageProgress = 0;
      }
      // Convert Set to Array for easier display - safety check for resources Set
      if (group && group.resources && typeof group.resources.has === 'function') {
        group.resources = Array.from(group.resources);
      } else {
        group.resources = [];
      }
    });

    return Object.values(machineGroups);
    } catch (error) {
      console.error('Error in machinesSummary calculation:', error);
      return []; // Return empty array as fallback
    }
  }, [placedMachines, ownedMachines, craftingQueue, discoveredNodes]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader 
        title="Factory Dashboard" 
        showBackButton={false}
        rightIcon="cog"
        onRightIconPress={() => navigation.navigate("InventoryScreen")}
      />
      <ResourceOverviewHeader />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{}}>
          <MilestoneCard
            currentMilestone={currentMilestone}
            inventory={inventory}
            discoveredNodes={discoveredNodes}
            onPress={() => navigation.navigate("MilestonesScreen")}
          />

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("BuildScreen")}
          >
            <Text style={styles.gridItemTitle}>Machine Builder</Text>
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
                {(() => {
                  const placedCount = Array.isArray(placedMachines) ? placedMachines.length : 0;
                  const ownedCount = Array.isArray(ownedMachines) ? ownedMachines.length : 0;
                  return placedCount + ownedCount;
                })()} total
              </Text>
            </View>
            
            {/* Mini summary of machines */}
            {Array.isArray(machinesSummary) && machinesSummary.length > 0 && (
              <View style={styles.machinesSummaryContainer}>
                {machinesSummary.filter(group => group && group.type).map((machineGroup) => (
                  <View key={machineGroup.type} style={styles.machineGroupSummary}>
                    <View style={styles.machineGroupHeader}>
                      <MaterialCommunityIcons 
                        name={
                          machineGroup.type === "miner" ? "robot-industrial" :
                          machineGroup.type === "smelter" ? "fire" :
                          machineGroup.type === "constructor" ? "hammer-wrench" :
                          machineGroup.type === "oilExtractor" ? "oil-lamp" :
                          machineGroup.type === "assembler" ? "cogs" :
                          "cog"
                        } 
                        size={16} 
                        color="#b8c7d1" 
                      />
                      <Text style={styles.machineGroupName}>
                        {machineGroup.name || 'Unknown Machine'}
                      </Text>
                      <Text style={styles.machineGroupCount}>
                        x{machineGroup.count || 0}
                      </Text>
                    </View>
                    
                    {/* Resources being processed */}
                    {Array.isArray(machineGroup.resources) && machineGroup.resources.length > 0 && (
                      <View style={styles.resourcesContainer}>
                        <Text style={styles.resourcesLabel}>
                          {machineGroup.type === "miner" || machineGroup.type === "oilExtractor" ? "Mining:" : "Crafting:"}
                        </Text>
                        <Text style={styles.resourcesList} numberOfLines={1}>
                          {machineGroup.resources.slice(0, 2).join(", ")}
                          {machineGroup.resources.length > 2 && ` +${machineGroup.resources.length - 2} more`}
                        </Text>
                      </View>
                    )}
                    
                    {/* Progress bar for processing machines */}
                    {(machineGroup.processingCount || 0) > 0 && (machineGroup.averageProgress || 0) > 0 && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${Math.max(0, Math.min(100, machineGroup.averageProgress || 0))}%`,
                                backgroundColor: "#2196F3"
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {Math.round(machineGroup.averageProgress || 0)}%
                        </Text>
                      </View>
                    )}
                    
                    {/* Status indicators */}
                    <View style={styles.statusIndicators}>
                      {(machineGroup.activeCount || 0) > 0 && (
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: "#4CAF50" }]} />
                          <Text style={styles.statusText}>
                            {machineGroup.activeCount || 0} {machineGroup.type === "miner" || machineGroup.type === "oilExtractor" ? "mining" : "idle"}
                          </Text>
                        </View>
                      )}
                      {(machineGroup.processingCount || 0) > 0 && (
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: "#2196F3" }]} />
                          <Text style={styles.statusText}>{machineGroup.processingCount || 0} crafting</Text>
                        </View>
                      )}
                      {(machineGroup.pausedCount || 0) > 0 && (
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: "#ff9800" }]} />
                          <Text style={styles.statusText}>{machineGroup.pausedCount || 0} paused</Text>
                        </View>
                      )}
                      {(machineGroup.idleCount || 0) > 0 && (
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: "#9E9E9E" }]} />
                          <Text style={styles.statusText}>{machineGroup.idleCount || 0} idle</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
                
                {machinesSummary.length > 3 && (
                  <Text style={styles.moreMachinesText}>
                    +{machinesSummary.length - 3} more types...
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
