import React, { useState, useMemo } from "react";
import { View, ScrollView, ImageBackground, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, CustomHeader, IconContainer } from "../../components";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import styles from "./styles";
import { useGame } from "../../contexts/GameContext";
import useBasicResources from "../../hooks/useBasicResources";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const BasicResourcesScreen = () => {
  const basicResources = useBasicResources();
  const { placedMachines, discoveredNodes, allResourceNodes } = useGame();

  // Calculate resource statistics
  const resourceStats = useMemo(() => {
    return basicResources.map((res) => {
      // Node type is like "ironOre_node", resource id is like "ironOre"
      const nodeTypeId = `${res.id}_node`;
      
      // Count miners assigned to this resource type
      const minersCount = placedMachines.filter((m) => {
        if (m.type !== "miner" && m.type !== "extractor") return false;
        const node = allResourceNodes.find((n) => n.id === m.assignedNodeId);
        return node && node.type === nodeTypeId;
      }).length;

      // Count discovered nodes of this type
      const nodesCount = allResourceNodes.filter(
        (node) => node.type === nodeTypeId && discoveredNodes[node.id]
      ).length;

      return {
        ...res,
        minersCount,
        nodesCount,
      };
    });
  }, [basicResources, placedMachines, discoveredNodes, allResourceNodes]);

  // Bar chart data for resource inventory amounts
  const inventoryChartData = useMemo(() => {
    return {
      labels: resourceStats.map((r) => r.name.split(" ")[0]),
      datasets: [
        {
          data: resourceStats.map((r) => Math.max(r.currentAmount, 0.1)), // Avoid 0 for chart display
        },
      ],
    };
  }, [resourceStats]);

  // Bar chart data for miners per resource
  const minersChartData = useMemo(() => {
    return {
      labels: resourceStats.map((r) => r.name.split(" ")[0]),
      datasets: [
        {
          data: resourceStats.map((r) => r.minersCount),
        },
      ],
    };
  }, [resourceStats]);

  // Bar chart data for discovered nodes
  const nodesChartData = useMemo(() => {
    return {
      labels: resourceStats.map((r) => r.name.split(" ")[0]),
      datasets: [
        {
          data: resourceStats.map((r) => r.nodesCount),
        },
      ],
    };
  }, [resourceStats]);

  const chartConfig = {
    backgroundColor: Colors.backgroundPanel,
    backgroundGradientFrom: Colors.background,
    backgroundGradientTo: Colors.backgroundSecondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Basic Resources"
        rightIcon="chart-line"
        onRightIconPress={() => console.log("Basic resources tools pressed")}
      />

      <ImageBackground
        source={require("../../../assets/images/backgrounds/background.png")}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Resource Summary Cards */}
          <View style={styles.summaryContainer}>
            {resourceStats.map((res, idx) => (
              <LinearGradient
                key={res.id}
                colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.resourceCard}
              >
                <View style={styles.resourceCardHeader}>
                  <IconContainer iconId={res.id} size={40} iconSize={32} />
                  <View style={styles.resourceCardInfo}>
                    <Text style={styles.resourceName}>{res.name}</Text>
                    <Text style={styles.resourceAmount}>
                      {Math.floor(res.currentAmount).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.resourceStats}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="pickaxe"
                      size={16}
                      color={Colors.accentGold}
                    />
                    <Text style={styles.statText}>{res.minersCount} Miners</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={16}
                      color={Colors.accentBlue}
                    />
                    <Text style={styles.statText}>{res.nodesCount} Nodes</Text>
                  </View>
                </View>
              </LinearGradient>
            ))}
          </View>

          {/* Resource Inventory Bar Chart */}
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.chartContainer}
          >
            <Text style={styles.chartTitle}>
              <MaterialCommunityIcons name="database" size={18} color={Colors.accentGold} />{" "}
              Current Inventory
            </Text>
            <BarChart
              data={inventoryChartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
              showValuesOnTopOfBars
              fromZero
            />
          </LinearGradient>

          {/* Miners per Resource Bar Chart */}
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.chartContainer}
          >
            <Text style={styles.chartTitle}>
              <MaterialCommunityIcons name="pickaxe" size={18} color={Colors.accentGold} />{" "}
              Active Miners
            </Text>
            <BarChart
              data={minersChartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
              showValuesOnTopOfBars
              fromZero
            />
          </LinearGradient>

          {/* Discovered Nodes Bar Chart */}
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.chartContainer}
          >
            <Text style={styles.chartTitle}>
              <MaterialCommunityIcons
                name="map-marker-multiple"
                size={18}
                color={Colors.accentGold}
              />{" "}
              Discovered Nodes
            </Text>
            <BarChart
              data={nodesChartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
              showValuesOnTopOfBars
              fromZero
            />
          </LinearGradient>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BasicResourcesScreen;
