import React, { useContext, useMemo } from "react";
import { GameContext } from "../../contexts/GameContext";
import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Text } from "../../components";
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
    craftingQueue 
  } = useContext(GameContext);

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
