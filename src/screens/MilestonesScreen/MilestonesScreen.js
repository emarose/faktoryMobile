import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, CustomHeader } from "../../components";
import { GameAssets } from "../../components/AppLoader";
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
      <ImageBackground
        source={require('../../../assets/images/backgrounds/background.png')}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.4)", "rgba(58, 2, 66, 0.6)", "rgba(0, 0, 0, 0.5)"]}
          style={styles.gradientOverlay}
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
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
                  borderColor: '#00ffff',
                  borderWidth: 2,
                  shadowColor: '#00ffff',
                  shadowOpacity: 0.4,
                },
                {
                  minHeight: 60,
                  maxHeight: expanded ? 320 : 70,
                  marginBottom: 10,
                  overflow: "hidden",
                  elevation: expanded ? 6 : 2,
                  shadowOpacity: expanded ? 0.25 : 0.15,
                  shadowRadius: expanded ? 12 : 6,
                  borderWidth: expanded ? 2 : 1.5,
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
                  <Image
                    source={GameAssets.icons.largeStar}
                    style={{ width: 20, height: 20, marginRight: 6 }}
                  />
                )}
                <Text style={[styles.milestoneName, { fontSize: 18 }]}>
                  {milestone.name}
                </Text>
              </View>
              <Text
                style={{
                  color: milestone.unlocked ? Colors.accentGreen : Colors.accentGold,
                  fontSize: 14,
                  marginBottom: 2,
                }}
              >
                {milestone.unlocked ? "Unlocked" : "Locked"}
              </Text>
              {expanded && (
                <>
                  <Text
                    style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 8, marginTop: 4 }}
                  >
                    {milestone.requirementsDescription}
                  </Text>
                  
                  {milestone.requirements && (
                    <View style={{ marginTop: 4, marginBottom: 8 }}>
                      <Text style={{ color: '#00ffff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>
                        Requirements:
                      </Text>
                      {Object.entries(milestone.requirements).map(([key, value]) => {
                        const icon = GameAssets.icons[key];
                        return (
                          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            {icon && (
                              <Image
                                source={icon}
                                style={{ width: 20, height: 20, marginRight: 8 }}
                                resizeMode="contain"
                              />
                            )}
                            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13 }}>
                              {key === 'discoveredNodes' ? `Discover ${value} nodes` : `${value}x ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

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
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}
