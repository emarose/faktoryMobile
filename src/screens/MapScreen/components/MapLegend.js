import { View, Text } from "react-native";
import styles from "../styles";
import { useMapNodes } from "../../../hooks/useMapNodes";

const MapLegend = () => {
// TODO make the nodes appear if the player has explored them
  const { NODE_TYPES_MAP } = useMapNodes();
  return (
    <View style={styles.mapLegend}>
      <Text style={styles.mapLegendTitle}>Node Types</Text>
      <View style={styles.mapLegendItems}>
        {NODE_TYPES_MAP.map((nodeType) => (
          <View key={nodeType.type} style={styles.mapLegendItem}>
            <View
              style={[
                styles.mapLegendColorBox,
                { backgroundColor: nodeType.color },
              ]}
            />
            <Text style={styles.mapLegendText}>{nodeType.name}</Text>
          </View>
        ))}
        <View style={styles.mapLegendItem}>
          <Text style={styles.machineIconLegend}>⚙️</Text>
          <Text style={styles.mapLegendText}>Machine Assigned</Text>
        </View>
      </View>
    </View>
  );
};

export default MapLegend;
