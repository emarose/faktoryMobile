import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import styles from "./styles";
import useMilestone from "../../hooks/useMilestone";
import { useGame } from "../../contexts/GameContext";

export default function MilestonesScreen() {
  const { inventory } = useGame();
  console.log(inventory);
  
  const {
    milestones,
    canCompleteCurrentMilestone,
    completeCurrentMilestone,
  } = useMilestone(inventory);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Milestones</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {milestones.map((milestone, idx) => (
          <View
            key={milestone.id}
            style={[styles.milestoneCard, milestone.unlocked ? styles.milestoneUnlocked : styles.milestoneLocked]}
          >
            <Text style={styles.milestoneName}>{milestone.name}</Text>
            <Text style={styles.milestoneDescription}>{milestone.description}</Text>
            <Text style={styles.unlocksTitle}>Unlocks:</Text>
            {milestone.unlocks.map((unlock) => (
              <Text key={unlock} style={styles.unlockItem}>- {unlock}</Text>
            ))}
            {milestone.unlocked ? (
              <Text style={styles.unlockedText}>Unlocked</Text>
            ) : canCompleteCurrentMilestone ? (
              <TouchableOpacity
                style={[styles.unlockButton, { marginTop: 8 }]}
                onPress={completeCurrentMilestone}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Complete Milestone</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.lockedText}>Requirements not met</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}