import React, { useMemo, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../../../components";
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
  const [expanded, setExpanded] = useState(false);
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
    <View style={[styles.gridItem, styles.milestoneCard]}>
      <View style={styles.milestoneHeader}>
        <TouchableOpacity onPress={onPress}>
          <MaterialCommunityIcons
            name={"star"}
            size={30}
            color={Colors.accentGold}
          />
        </TouchableOpacity>
        {currentMilestone && !currentMilestone.unlocked && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.nameAndCaret}>
            <Text style={[styles.milestoneTitle, {flex: 1, textAlign: 'center'}]}>{currentMilestone.name}</Text>
            <MaterialCommunityIcons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Overall completion indicator in non-expanded state */}
      {currentMilestone && !currentMilestone.unlocked && !expanded && (
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
      )}

      {/* Progress bars for each requirement */}
      {expanded && currentMilestone &&
        !currentMilestone.unlocked &&
        milestoneProgress.length > 0 && (
          <View style={styles.progressSection}>
            {milestoneProgress.map((requirement) => (
              <View key={requirement.key} style={styles.requirementRow}>
                <View style={styles.requirementHeader}>
                  <Text style={styles.requirementName}>{requirement.name}</Text>
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

            {/* Overall completion indicator */}
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
    </View>
  );
};

export default MilestoneCard;
