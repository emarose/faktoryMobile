import React, { useContext, useRef, useCallback, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, CustomHeader, GameWorldEngine } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import Colors from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceOverviewHeader from "./components/ResourceOverviewHeader/ResourceOverviewHeader";
import MilestoneCard from "./components/MilestoneCard";
import DeployedMachinesCard from "./components/DeployedMachinesCard";

export default function FactoryScreen() {
  const navigation = useNavigation();
  const [showGameEngine, setShowGameEngine] = useState(false);
  const {
    currentMilestone,
    inventory,
    discoveredNodes,
    placedMachines,
    ownedMachines,
    craftingQueue,
    allResourceNodes,
  } = useContext(GameContext);

  const scrollRef = useRef(null);

  // Scroll to top whenever the screen receives focus
  useFocusEffect(
    useCallback(() => {
      if (scrollRef.current) {
        try {
          scrollRef.current.scrollTo({ y: 0, animated: true });
        } catch (e) {}
      }
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/backgrounds/background.png")}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          ref={scrollRef}
          contentContainerStyle={styles.scrollViewContent}
        >
          <ResourceOverviewHeader />
          <View style={styles.cardsContainer}>
            <MilestoneCard
              currentMilestone={currentMilestone}
              inventory={inventory}
              discoveredNodes={discoveredNodes}
              onPress={() => navigation.navigate("MilestonesScreen")}
            />
            <View style={styles.rowSplit}>
              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("MapScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientCard}
                >
                  <Text style={styles.gridItemTitle}>World Map</Text>
                  <Image
                    source={require("../../../assets/images/UI/cardBg/worldMap.png")}
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    resizeMode="cover"
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("BuildScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientCard}
                >
                  <Text numberOfLines={2} style={styles.gridItemTitle}>
                  Machine Builder
                  </Text>
                  <Image
                    source={require("../../../assets/images/UI/cardBg/buildMachines.png")}
                    style={{
                      width: 130,
                      height: 100,
                    }}
                    resizeMode="cover"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <DeployedMachinesCard
              placedMachines={placedMachines}
              ownedMachines={ownedMachines}
              craftingQueue={craftingQueue}
              allResourceNodes={allResourceNodes}
              onPress={() => navigation.navigate("DeployedMachinesScreen")}
            />

            <View style={styles.rowSplit}>
              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("InventoryScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientCard}
                >
                  <Text style={styles.gridItemTitle}>Inventory</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("ProductAssemblyScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientCard}
                >
                  <Text style={styles.gridItemTitle}>Product Assembly</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Game Engine Test Card */}
            <TouchableOpacity
              style={styles.fullWidthItem}
              onPress={() => setShowGameEngine(true)}
            >
              <LinearGradient
                colors={["rgba(34, 139, 34, 0.9)", "rgba(46, 125, 50, 0.5)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientCard}
              >
                <Text style={styles.gridItemTitle}>🎮 Game Engine Test</Text>
                <MaterialCommunityIcons
                  name="gamepad-variant"
                  size={50}
                  color="white"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Game Engine Modal */}
        <Modal
          visible={showGameEngine}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowGameEngine(false)}
        >
          <GameWorldEngine />
          <TouchableOpacity
            onPress={() => setShowGameEngine(false)}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}
