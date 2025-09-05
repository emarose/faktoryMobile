import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { Text } from "../../components";
import styles from "./styles";
import { useGame } from "../../contexts/GameContext";
import useBasicResources from "../../hooks/useBasicResources";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceVisualCard from "./components/ResourceVisualCard";
import ResourceAnalysisChart from "./components/ResourceAnalysisChart";
import RESOURCE_CAP from "../../constants/ResourceCap";
// TODO: Replace with actual icons for each resource
import { Image } from "react-native";
import { getNodeColor } from "../../data/nodeTypes";

const BasicResourcesScreen = () => {
  // Hook para obtener los recursos básicos reales del inventario
  const basicResources = useBasicResources();
  const resourceList = basicResources.map((res) => ({
    key: res.id,
    name: res.name,
    icon: res.icon,
    amount: res.currentAmount,
  }));

  // Selected resource state
  const [selectedResource, setSelectedResource] = useState(
    resourceList[0]?.key || null
  );

  // Simulated time-based data for chart (replace with real data if available)
  const chartData = useMemo(() => {
    if (!selectedResource) return [];
    // Example: last 10 ticks of resource amount (simulated)
    // El valor actual debe estar al final (derecha), el pasado al inicio (izquierda)
    const res = basicResources.find((r) => r.id === selectedResource);
    const base = res?.currentAmount || 0;
    const arr = Array.from({ length: 10 }, (_, i) => Math.max(0, base - (9 - i) * 5));
    return arr;
  }, [selectedResource, basicResources]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Basic Resources</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {resourceList.map((res) => (
          <ResourceVisualCard
            key={res.key}
            name={res.name}
            icon={res.icon}
            amount={res.amount}
            selected={selectedResource === res.key}
            onPress={() => setSelectedResource(res.key)}
          />
        ))}
      </View>
      <View style={{ marginTop: 24 }}>
        {selectedResource && (
          <ResourceAnalysisChart
            data={chartData}
            label={`Resource over time: ${selectedResource}`}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default BasicResourcesScreen;
