import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, IconContainer } from "../../../../components";
import { GameAssets } from "../../../../components/AppLoader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import milestones from "../../../../data/milestones";
import { items } from "../../../../data/items";
import styles from "./styles";
import Colors from "../../../../constants/Colors";

const MilestoneCard = ({
  currentMilestone,
  inventory,
  discoveredNodes,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(true);
  // Busca el milestone completo para acceder a requirementsDescription
  const milestoneFull = currentMilestone
    ? milestones.find((m) => m.id === currentMilestone.id)
    : null;

  // Helper function to get item display name
  const getItemDisplayName = (itemKey) => {
    // Handle special cases
    if (itemKey === "discoveredNodes") return "Resource Nodes discovered";

    // Find in items data
    const item = items[itemKey];
    if (item?.name) return item.name;

    // Convert camelCase to readable format
    return itemKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Get current inventory amount for a requirement
  const getCurrentAmount = (requirementKey) => {
    if (requirementKey === "discoveredNodes") {
      return Object.keys(discoveredNodes).filter(
        (nodeId) => discoveredNodes[nodeId]
      ).length;
    }

    return inventory[requirementKey]?.currentAmount || 0;
  };

  // Calculate milestone progress requirements
  const milestoneProgress = useMemo(() => {
    if (!milestoneFull?.requirements) return [];

    return Object.entries(milestoneFull.requirements).map(
      ([key, required]) => ({
        key,
        name: getItemDisplayName(key),
        current: getCurrentAmount(key),
        required,
        completed: getCurrentAmount(key) >= required,
        percentage: Math.min((getCurrentAmount(key) / required) * 100, 100),
      })
    );
  }, [milestoneFull, inventory, discoveredNodes]);

  // Check if milestone is fully completed
  const isMilestoneCompleted = milestoneProgress.every(
    (item) => item.completed
  );

  return (
    <LinearGradient
      colors={['#ff00cc', '#00ffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 10,
        padding: 2,
      }}
    >
      <View style={styles.milestoneHeader}>
        <TouchableOpacity onPress={onPress} style={styles.starTouchable}>  
          <Image
            source={GameAssets.icons.largeStar}
            style={{ width: 32, height: 32 }}
          />
        </TouchableOpacity>
        {currentMilestone && !currentMilestone.unlocked && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.nameAndCaret}>
            <Text style={[styles.milestoneTitle, { flex: 1, textAlign: 'center' }]}>{currentMilestone.name}</Text>
            <MaterialCommunityIcons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      {expanded && currentMilestone &&
        !currentMilestone.unlocked &&
        milestoneProgress.length > 0 && (
          <View style={styles.progressSection}>
            {milestoneProgress.map((requirement) => (
              <View key={requirement.key} style={styles.requirementRow}>
                <View style={styles.requirementHeader}>
                  <View style={styles.requirementNameWithIcon}>
                    {requirement.key !== "discoveredNodes" && (
                      <IconContainer
                        iconId={requirement.key}
                        size={24}
                        iconSize={16}
                        style={styles.requirementIconContainer}
                      />
                    )}
                    {requirement.key === "discoveredNodes" && (
                      <View style={styles.requirementIconContainer}>
                        <MaterialCommunityIcons
                          name="map-marker-multiple"
                          size={16}
                          color={Colors.accentGold}
                        />
                      </View>
                    )}
                    <Text style={styles.requirementName}>{requirement.name}</Text>
                  </View>
                  <Text
                    style={[
                      styles.requirementCount,
                      requirement.completed && styles.requirementCompleted,
                    ]}
                  >
                    {requirement.current}/{requirement.required}
                  </Text>
                </View>
                <View style={styles.miniProgressBar}>
                  <View
                    style={[
                      styles.miniProgressFill,
                      {
                        width: `${requirement.percentage}%`,
                        backgroundColor: requirement.completed
                          ? "#4CAF50"
                          : "#ffd700",
                      },
                    ]}
                  />
                </View>
              </View>
            ))}

            <View style={styles.overallProgress}>
              <Text style={styles.overallProgressText}>
                {milestoneProgress.filter((r) => r.completed).length}/
                {milestoneProgress.length} completed
              </Text>
              {isMilestoneCompleted && (
                <Text style={styles.readyToComplete}>
                  Ready to complete! 🎉
                </Text>
              )}
            </View>
          </View>
        )}
    </LinearGradient>
  );
};

export default MilestoneCard;
