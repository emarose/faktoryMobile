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

  const getMachineIcon = (machineId) => {
    const icons = {
      'miner': '⛏️',
      'smelter': '🔥',
      'constructor': '🔧',
      'assembler': '⚙️',
      'foundry': '🏭',
      'manufacturer': '🏗️',
      'refinery': '⚗️',
      'oilExtractor': '🛢️'
    };
    return icons[machineId] || '🔧';
  };

  const renderMachineCard = (item) => {
    const machineColor = getMachineColor(item.id);
    const isLocked = !item.isUnlocked;
    const canBuild = item.isUnlocked && item.canBuild;

    return (
      <View key={item.id} style={[
        retroStyles.machineCard,
        isLocked && retroStyles.machineCardLocked,
        canBuild && retroStyles.machineCardAvailable,
      ]}>
        {/* Machine Header */}
        <View style={retroStyles.machineCardHeader}>
          <View style={[
            retroStyles.machineCardIcon,
            { backgroundColor: isLocked ? '#666' : machineColor + '40' }
          ]}>
            <Text style={retroStyles.machineCardIconText}>
              {getMachineIcon(item.id)}
            </Text>
          </View>
          
          <View style={retroStyles.machineCardInfo}>
            <Text style={retroStyles.machineCardName}>{item.name}</Text>
            <Text style={retroStyles.machineCardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          {/* Status Badge */}
          <View style={[
            retroStyles.statusBadge,
            {
              backgroundColor: isLocked ? '#666' : canBuild ? Colors.accentGreen : '#ff6b6b'
            }
          ]}>
            <Text style={retroStyles.statusBadgeText}>
              {isLocked ? 'LOCKED' : canBuild ? 'READY' : 'NEED RESOURCES'}
            </Text>
          </View>
        </View>

        {/* Requirements */}
        {!isLocked && (
          <View style={retroStyles.requirementsSection}>
            <Text style={retroStyles.requirementsSectionTitle}>Required Materials:</Text>
            {Object.keys(item.inputs || {}).length > 0 ? (
              <View style={retroStyles.requirementsList}>
                {Object.entries(item.inputs || {}).map(([inputId, requiredAmount]) => {
                  const currentAmount = Math.floor(inventory[inputId]?.currentAmount || 0);
                  const hasEnough = currentAmount >= requiredAmount;
                  
                  return (
                    <View key={inputId} style={retroStyles.requirementChip}>
                      <Text style={[
                        retroStyles.requirementChipText,
                        hasEnough ? retroStyles.requirementChipHave : retroStyles.requirementChipNeed
                      ]}>
                        {inventory[inputId]?.name || inputId}: {currentAmount}/{requiredAmount}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={retroStyles.noRequirementsText}>No materials required</Text>
            )}
          </View>
        )}

        {/* Locked Message */}
        {isLocked && (
          <View style={retroStyles.lockedSection}>
            <Text style={retroStyles.lockedSectionText}>
              🔒 Complete "{item.requiredMilestone?.name || 'milestone'}" to unlock
            </Text>
          </View>
        )}

        {/* Build Button */}
        <TouchableOpacity
          style={[
            retroStyles.buildButton,
            {
              backgroundColor: isLocked ? '#444' : canBuild ? machineColor : '#666'
            }
          ]}
          onPress={() => handleBuild(item.id)}
          disabled={!canBuild && !isLocked}
        >
          <Text style={retroStyles.buildButtonText}>
            {isLocked ? "Locked" : canBuild ? `Build ${item.name}` : "Not Enough Resources"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={retroStyles.container}>
      {/* Header */}
      <View style={retroStyles.header}>
        <Text style={retroStyles.headerTitle}>Building</Text>
      </View>

      {/* Machine Cards List */}
      <ScrollView style={retroStyles.cardsList} showsVerticalScrollIndicator={false}>
        <View style={retroStyles.cardsContainer}>
          {allBuildableItems.map(item => renderMachineCard(item))}
        </View>
      </ScrollView>
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

  // Cards List
  cardsList: {
    flex: 1,
  },

  cardsContainer: {
    padding: 16,
    gap: 16,
  },

  // Machine Card
  machineCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },

  machineCardLocked: {
    borderColor: '#666',
    backgroundColor: '#2a2a2a',
    opacity: 0.7,
  },

  machineCardAvailable: {
    borderColor: Colors.accentGreen,
    backgroundColor: Colors.accentGreen + '05',
  },

  // Machine Card Header
  machineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  machineCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },

  machineCardIconText: {
    fontSize: 24,
  },

  machineCardInfo: {
    flex: 1,
  },

  machineCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },

  machineCardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },

  // Requirements Section
  requirementsSection: {
    marginBottom: 16,
  },

  requirementsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  requirementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  requirementChip: {
    backgroundColor: Colors.backgroundPanel,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  requirementChipText: {
    fontSize: 12,
    fontWeight: '500',
  },

  requirementChipHave: {
    color: Colors.accentGreen,
    borderColor: Colors.accentGreen,
    backgroundColor: Colors.accentGreen + '10',
  },

  requirementChipNeed: {
    color: '#ff6b6b',
    borderColor: '#ff6b6b',
    backgroundColor: '#ff6b6b10',
  },

  noRequirementsText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // Locked Section
  lockedSection: {
    backgroundColor: Colors.backgroundWarning + '20',
    borderWidth: 1,
    borderColor: Colors.backgroundWarning,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  lockedSectionText: {
    fontSize: 14,
    color: Colors.backgroundWarning,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Build Button
  buildButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },

  buildButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});

export default BuildScreen;
