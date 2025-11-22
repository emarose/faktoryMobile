import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from "react-native-reanimated";
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

  // Animated value for chevron rotation
  const rotation = useSharedValue(expanded ? 180 : 0);
  // Animated value for content expansion
  const contentOpacity = useSharedValue(expanded ? 1 : 0);
  const contentTranslateY = useSharedValue(expanded ? 0 : -20);

  // Toggle function with animation
  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);

    // Animate chevron rotation
    rotation.value = withTiming(newExpanded ? 180 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    // Animate content expansion
    contentOpacity.value = withTiming(newExpanded ? 1 : 0, {
      duration: newExpanded ? 400 : 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    contentTranslateY.value = withTiming(newExpanded ? 0 : -20, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  };

  // Animated style for chevron
  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  // Animated style for progress section
  const progressSectionStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      height: contentOpacity.value === 0 ? 0 : undefined,
      overflow: 'hidden',
      transform: [
        {
          translateY: contentTranslateY.value,
        },
      ],
    };
  });

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
        <View style={styles.starContainer}>
          <LinearGradient
            colors={['#00ffff', '#ff00cc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.starGradientBorder}
          >
            <TouchableOpacity onPress={onPress} style={styles.starTouchable}>
              <Image
                source={GameAssets.icons.largeStar}
                style={{ width: 32, height: 32 }}
              />
            </TouchableOpacity>
          </LinearGradient>
          <Text style={styles.viewAllText}>View all</Text>
        </View>
        {currentMilestone && !currentMilestone.unlocked && (
          <TouchableOpacity onPress={toggleExpanded} style={styles.nameAndCaret}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.milestoneTitleHeader}>Current Milestone:</Text>
              <Text style={[styles.milestoneTitle]}>{currentMilestone.name}</Text>
            </View>
            <Animated.View style={chevronStyle}>
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color={Colors.textPrimary}
              />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      {expanded && currentMilestone &&
        !currentMilestone.unlocked &&
        milestoneProgress.length > 0 && (
          <Animated.View style={progressSectionStyle}>
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
          </Animated.View>
        )}
    </LinearGradient>
  );
};

export default MilestoneCard;
