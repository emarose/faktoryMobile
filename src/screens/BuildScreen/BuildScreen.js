import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGame } from "../../contexts/GameContext";
import { useMachineColors } from "../../hooks";
import styles from "./styles";

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Build Machines</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {allBuildableItems.length > 0 ? (
          allBuildableItems.map((item) => {
            const machineColor = getMachineColor(item.id);
            const machineColorBackground = getMachineColorWithOpacity(item.id, 0.15);
            const isLocked = !item.isUnlocked;
            const canActuallyBuild = item.isUnlocked && item.canBuild;
            
            return (
              <View 
                key={item.id} 
                style={[
                  styles.buildCard,
                  { 
                    borderLeftWidth: 4,
                    borderLeftColor: isLocked ? '#666' : machineColor,
                    backgroundColor: isLocked ? '#1a1a1a' : machineColorBackground,
                    opacity: isLocked ? 0.7 : 1
                  }
                ]}
              >
                {isLocked && (
                  <View style={styles.lockedBanner}>
                    <Text style={styles.lockedBannerText}>
                      🔒 Complete "{item.requiredMilestone?.title || 'milestone'}" to unlock
                    </Text>
                  </View>
                )}
                
                <View style={styles.itemHeader}>
                  {item.icon ? (
                    <Image source={item.icon} style={[styles.itemIcon, isLocked && { opacity: 0.5 }]} />
                  ) : (
                    <View 
                      style={[
                        styles.iconPlaceholder,
                        { backgroundColor: isLocked ? '#666' : machineColor }
                      ]}
                    >
                      <Text style={[styles.iconText, { color: '#FFFFFF' }]}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.itemName, { color: isLocked ? '#888' : machineColor }]}>
                    {item.name}
                  </Text>
                </View>
                <Text style={[styles.itemDescription, isLocked && { color: '#aaa' }]}>
                  {item.description}
                </Text>

                {!isLocked && (
                  <>
                    <Text style={styles.requirementsTitle}>Requires:</Text>
                    {Object.keys(item.inputs || {}).length > 0 ? (
                      Object.entries(item.inputs || {}).map(
                        ([inputId, requiredAmount]) => (
                          <Text key={inputId} style={styles.requirementText}>
                            - {inventory[inputId]?.name || inputId}: {requiredAmount}{" "}
                            <Text
                              style={{ color: item.missingResources[inputId] ?  "#ff6347" : "#a0d911" }}
                            >
                              ({Math.floor(inventory[inputId]?.currentAmount || 0)} /{" "}
                              {requiredAmount})
                            </Text>
                            {item.missingResources[inputId] ? (
                              <Text style={styles.missingText}>
                                {" "}
                                (Need {Math.ceil(item.missingResources[inputId])})
                              </Text>
                            ) : null}
                          </Text>
                        )
                      )
                    ) : (
                      <Text style={styles.requirementText}>
                        No resources required!
                      </Text>
                    )}
                  </>
                )}

                <TouchableOpacity
                  style={[
                    styles.buildButton,
                    { 
                      backgroundColor: isLocked 
                        ? '#444' 
                        : canActuallyBuild 
                          ? machineColor 
                          : styles.buildButtonDisabled.backgroundColor 
                    },
                    (!canActuallyBuild || isLocked) && styles.buildButtonDisabled,
                  ]}
                  onPress={() => handleBuild(item.id)}
                  disabled={!canActuallyBuild && !isLocked}
                >
                  <Text style={[styles.buildButtonText, isLocked && { color: '#bbb' }]}>
                    {isLocked
                      ? "Locked - Complete Milestone"
                      : canActuallyBuild
                        ? `Build ${item.name}`
                        : "Not Enough Resources"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Text style={styles.noItemsText}>
              No machines available.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BuildScreen;
