import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, CustomHeader } from "../../components";
import styles from "./styles";
import Colors from "../../constants/Colors";
import { useGame } from "../../contexts/GameContext";

export default function MilestonesScreen() {
  const { milestones, activeMilestone, unlockedMachineNames } = useGame();
  // Encuentra el primer milestone no desbloqueado
  const nextMilestone = milestones.find((m) => !m.unlocked);
  const [expandedId, setExpandedId] = useState(
    nextMilestone ? nextMilestone.id : null
  );

  useEffect(() => {
    // Si cambia el milestone activo, expande el siguiente milestone no desbloqueado
    if (nextMilestone && expandedId !== nextMilestone.id) {
      setExpandedId(nextMilestone.id);
    }
  }, [nextMilestone && nextMilestone.id]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader 
        title="Milestones"
        rightIcon="trophy"
        onRightIconPress={() => console.log("Milestones tools pressed")}
      />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
      >
        {milestones.map((milestone) => {
          const expanded = expandedId === milestone.id;
          const isNext = nextMilestone && milestone.id === nextMilestone.id;
          return (
            <TouchableOpacity
              key={milestone.id}
              activeOpacity={0.92}
              onPress={() => setExpandedId(expanded ? null : milestone.id)}
              style={[
                styles.milestoneCard,
                milestone.unlocked
                  ? styles.milestoneUnlocked
                  : styles.milestoneLocked,
                isNext && {
                  borderColor: Colors.accentGold,
                  borderWidth: 3,
                  shadowColor: Colors.accentGold,
                  shadowOpacity: 0.25,
                },
                {
                  minHeight: 60,
                  maxHeight: expanded ? 320 : 70,
                  marginBottom: 10,
                  overflow: "hidden",
                  elevation: expanded ? 6 : 2,
                  shadowOpacity: expanded ? 0.18 : 0.08,
                  shadowRadius: expanded ? 12 : 4,
                  borderWidth: expanded ? 2.5 : 1.5,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                {isNext && (
                  <Text
                    style={{ fontSize: 18, color: Colors.accentGold, marginRight: 6 }}
                  >
                    ★
                  </Text>
                )}
                <Text style={[styles.milestoneName, { fontSize: 18 }]}>
                  {milestone.name}
                </Text>
              </View>
              <Text
                style={{
                  color: milestone.unlocked ? Colors.success : Colors.accentGold,
                  fontSize: 14,
                  marginBottom: 2,
                }}
              >
                {milestone.unlocked ? "Unlocked" : "Locked"}
              </Text>
              {expanded && (
                <>
                  <Text
                    style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 2 }}
                  >
                    {milestone.requirementsDescription}
                  </Text>
                  <Text
                    style={{
                      color: Colors.textPrimary,
                      fontSize: 14,
                      marginTop: 6,
                      marginBottom: 2,
                    }}
                  >
                    {milestone.description}
                  </Text>
                  {milestone.unlocks && milestone.unlocks.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={{ color: Colors.accentGreen, fontSize: 15 }}>
                        Unlocks:
                      </Text>
                      <Text style={{ color: Colors.textPrimary, fontSize: 14 }}>
                        {milestone.unlocks.join(", ")}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/*  <View style={{ marginTop: 10, paddingHorizontal: 18 }}>
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
      </View> */}
    </SafeAreaView>
  );
}
