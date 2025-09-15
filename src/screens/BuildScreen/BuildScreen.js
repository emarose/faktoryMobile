import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGame } from "../../contexts/GameContext";
import { useMachineColors } from "../../hooks";
import Colors from "../../constants/Colors";

const { width } = Dimensions.get('window');

const BuildScreen = () => {
  const { buildableItems, buildItem, inventory, ownedMachines, unlockedMachineNames, milestones } = useGame();
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Show all buildable items, but distinguish between locked and unlocked
  const allBuildableItems = buildableItems.map(item => {
    const isUnlocked = unlockedMachineNames.includes(item.name);
    const requiredMilestone = milestones.find(milestone => 
      milestone.unlockedMachines && milestone.unlockedMachines.includes(item.name)
    );
    
    return {
      ...item,
      isUnlocked,
      requiredMilestone: requiredMilestone || null
    };
  }).sort((a, b) => {
    // Primero: máquinas que se pueden construir (unlocked y con recursos)
    const aCanBuild = a.isUnlocked && a.canBuild;
    const bCanBuild = b.isUnlocked && b.canBuild;
    
    if (aCanBuild && !bCanBuild) return -1;
    if (!aCanBuild && bCanBuild) return 1;
    
    // Segundo: máquinas desbloqueadas pero sin recursos
    const aUnlockedOnly = a.isUnlocked && !a.canBuild;
    const bUnlockedOnly = b.isUnlocked && !b.canBuild;
    
    if (aUnlockedOnly && !bUnlockedOnly) return -1;
    if (!aUnlockedOnly && bUnlockedOnly) return 1;
    
    // Tercero: máquinas bloqueadas (al final)
    const aLocked = !a.isUnlocked;
    const bLocked = !b.isUnlocked;
    
    if (!aLocked && bLocked) return -1;
    if (aLocked && !bLocked) return 1;
    
    // Finalmente: orden alfabético dentro del mismo grupo
    return a.name.localeCompare(b.name);
  });

  const handleBuild = (itemId) => {
    const itemToBuild = allBuildableItems.find((item) => item.id === itemId);
    if (!itemToBuild?.isUnlocked) {
      Alert.alert(
        "Machine Locked", 
        `Complete the "${itemToBuild?.requiredMilestone?.title || 'required milestone'}" to unlock this machine.`
      );
      return;
    }
    const success = buildItem(itemId);
  };

  // Select first machine by default
  React.useEffect(() => {
    if (allBuildableItems.length > 0 && !selectedMachine) {
      setSelectedMachine(allBuildableItems[0]);
    }
  }, [allBuildableItems, selectedMachine]);

  const renderMachineSlot = (item, index) => {
    const machineColor = getMachineColor(item.id);
    const isLocked = !item.isUnlocked;
    const canBuild = item.isUnlocked && item.canBuild;
    const isSelected = selectedMachine?.id === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          retroStyles.machineSlot,
          isSelected && retroStyles.machineSlotSelected,
          isLocked && retroStyles.machineSlotLocked,
          canBuild && retroStyles.machineSlotAvailable,
        ]}
        onPress={() => setSelectedMachine(item)}
      >
        {/* Machine Icon/Letter */}
        <View style={[
          retroStyles.machineIcon,
          { backgroundColor: isLocked ? '#444' : machineColor + '40' }
        ]}>
          <Text style={[
            retroStyles.machineIconText,
            { color: isLocked ? '#666' : machineColor }
          ]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Status Indicators */}
        {canBuild && (
          <View style={retroStyles.readyIndicator}>
            <Text style={retroStyles.readyIndicatorText}>✓</Text>
          </View>
        )}
        
        {isLocked && (
          <View style={retroStyles.lockedIndicator}>
            <Text style={retroStyles.lockedIndicatorText}>🔒</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={retroStyles.container}>
      {/* Header */}
      <View style={retroStyles.header}>
        <Text style={retroStyles.headerTitle}>Building</Text>
      </View>

      {/* Machine Grid */}
      <View style={retroStyles.machineGrid}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={retroStyles.machineGridContent}
        >
          {allBuildableItems.map((item, index) => renderMachineSlot(item, index))}
        </ScrollView>
      </View>

      {/* Details Panel */}
      <View style={retroStyles.detailsPanel}>
        {selectedMachine ? (
          <>
            {/* Machine Info */}
            <View style={retroStyles.machineInfo}>
              <Text style={retroStyles.machineName}>{selectedMachine.name}</Text>
              <Text style={retroStyles.machineDescription}>
                {selectedMachine.description}
              </Text>
            </View>

            {/* Requirements Section */}
            <View style={retroStyles.requirementsSection}>
              {!selectedMachine.isUnlocked ? (
                <View style={retroStyles.lockedMessage}>
                  <Text style={retroStyles.lockedMessageText}>
                    🔒 Complete "{selectedMachine.requiredMilestone?.name || 'milestone'}" to unlock
                  </Text>
                </View>
              ) : (
                <>
                  {Object.keys(selectedMachine.inputs || {}).length > 0 ? (
                    Object.entries(selectedMachine.inputs || {}).map(([inputId, requiredAmount]) => {
                      const currentAmount = Math.floor(inventory[inputId]?.currentAmount || 0);
                      const hasEnough = currentAmount >= requiredAmount;
                      
                      return (
                        <View key={inputId} style={retroStyles.requirementItem}>
                          <View style={[
                            retroStyles.requirementIcon,
                            { backgroundColor: hasEnough ? Colors.accentGreen + '30' : Colors.backgroundWarning + '30' }
                          ]}>
                            <Text style={retroStyles.requirementIconText}>
                              {inventory[inputId]?.name?.charAt(0) || inputId.charAt(0)}
                            </Text>
                          </View>
                          <View style={retroStyles.requirementInfo}>
                            <Text style={retroStyles.requirementName}>
                              {inventory[inputId]?.name || inputId}
                            </Text>
                            <Text style={[
                              retroStyles.requirementAmount,
                              { color: hasEnough ? Colors.accentGreen : Colors.backgroundWarning }
                            ]}>
                              ({currentAmount}/{requiredAmount})
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={retroStyles.noRequirements}>No resources required!</Text>
                  )}
                </>
              )}
            </View>

            {/* Build Button */}
            <TouchableOpacity
              style={[
                retroStyles.buildButton,
                {
                  backgroundColor: !selectedMachine.isUnlocked
                    ? '#444'
                    : selectedMachine.canBuild
                      ? getMachineColor(selectedMachine.id)
                      : '#666'
                }
              ]}
              onPress={() => handleBuild(selectedMachine.id)}
              disabled={!selectedMachine.canBuild && selectedMachine.isUnlocked}
            >
              <Text style={retroStyles.buildButtonText}>
                {!selectedMachine.isUnlocked
                  ? "Locked"
                  : selectedMachine.canBuild
                    ? `Build ${selectedMachine.name}`
                    : "Not Enough Resources"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={retroStyles.noSelection}>
            <Text style={retroStyles.noSelectionText}>Select a machine to view details</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const retroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },

  // Machine Grid (Top Section)
  machineGrid: {
    backgroundColor: Colors.backgroundPanel,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    paddingVertical: 16,
    minHeight: 120,
  },

  machineGridContent: {
    paddingHorizontal: 16,
    gap: 12,
  },

  machineSlot: {
    width: 80,
    height: 80,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  machineSlotSelected: {
    borderColor: Colors.textAccent,
    backgroundColor: Colors.textAccent + '20',
    borderWidth: 3,
  },

  machineSlotLocked: {
    borderColor: '#666',
    backgroundColor: '#2a2a2a',
  },

  machineSlotAvailable: {
    borderColor: Colors.accentGreen,
    backgroundColor: Colors.accentGreen + '10',
  },

  machineIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  machineIconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Status Indicators
  readyIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: Colors.accentGreen,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundPanel,
  },

  readyIndicatorText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },

  lockedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#666',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundPanel,
  },

  lockedIndicatorText: {
    fontSize: 8,
  },

  // Details Panel (Bottom Section)
  detailsPanel: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
    padding: 20,
  },

  // Machine Info
  machineInfo: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '50',
  },

  machineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },

  machineDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Requirements Section
  requirementsSection: {
    flex: 1,
    marginBottom: 20,
  },

  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundPanel,
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  requirementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  requirementIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },

  requirementInfo: {
    flex: 1,
  },

  requirementName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },

  requirementAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  noRequirements: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },

  // Locked Message
  lockedMessage: {
    backgroundColor: Colors.backgroundWarning + '20',
    borderWidth: 2,
    borderColor: Colors.backgroundWarning,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  lockedMessageText: {
    fontSize: 16,
    color: Colors.backgroundWarning,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Build Button
  buildButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    marginTop: 'auto',
  },

  buildButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },

  // No Selection State
  noSelection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noSelectionText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

export default BuildScreen;
