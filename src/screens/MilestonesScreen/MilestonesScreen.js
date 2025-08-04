import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import styles from "./styles";
import { useGame } from "../../contexts/GameContext";

export default function MilestonesScreen() {
  const { milestones, activeMilestone, currentMilestone, unlockedMachineNames } = useGame();

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
                <Text style={styles.unlocksTitle}>Requirements:</Text>
                {Object.entries(milestone.requirements || {}).map(([req, val]) => (
                  <Text key={req} style={styles.unlockItem}>
                    {req === "discoveredNodes" ? `Discover ${val} node(s)` : `${req}: ${val}`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Active Milestone:</Text>
          <Text style={{ color: '#27ae60', fontSize: 15 }}>{activeMilestone}</Text>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>Unlocked Machines:</Text>
          {unlockedMachineNames.length > 0 ? (
            unlockedMachineNames.map((name) => (
              <Text key={name} style={{ color: '#a0d911', marginLeft: 8 }}>- {name}</Text>
            ))
          ) : (
            <Text style={{ color: '#bbb', marginLeft: 8 }}>None yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}