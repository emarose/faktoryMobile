import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { useGame } from "../../contexts/GameContext";

export default function MilestonesScreen() {
  const { milestones } = useGame();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Milestones</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {milestones.map((milestone) => (
          <View
            key={milestone.id}
            style={[
              styles.milestoneCard,
              milestone.unlocked ? styles.milestoneUnlocked : styles.milestoneLocked,
            ]}
          >
            <Text style={styles.milestoneName}>{milestone.name}</Text>
            <Text style={styles.milestoneDescription}>{milestone.description}</Text>
            <Text style={styles.unlocksTitle}>Unlocks:</Text>
            {milestone.unlocks.map((unlock) => (
              <Text key={unlock} style={styles.unlockItem}>- {unlock}</Text>
            ))}
            {milestone.unlocked ? (
              <Text style={styles.unlockedText}>Unlocked</Text>
            ) : (
              <View>
                <Text style={styles.lockedText}>Requirements not met</Text>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                {Object.entries(milestone.requirements || {}).map(([req, val]) => (
                  <Text key={req} style={styles.requirementItem}>
                    {req === "discoveredNodes" ? `Discover ${val} node(s)` : `${req}: ${val}`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}