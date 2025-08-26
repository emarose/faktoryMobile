import { View, Text } from "react-native";
import { items } from "../../../../data/items";
import styles from "./styles";
import RequiredResources from "./components/RequiredResources/RequiredResources";
import ExpectedOutput from "./components/ExpectedOutput/ExpectedOutput";

const ResourceList = ({ inputs, outputs, amount, inventory }) => {
  const input = Array.isArray(inputs) ? inputs : [];
  const output = Array.isArray(outputs) ? outputs[0] : null;

  // Helper to get appropriate icon based on resource type
  const getResourceIcon = (itemId) => {
    const item = items[itemId];
    if (!item) return "help-circle";

    if (item.type === "rawMaterial") return "laravel";
    if (item.type === "intermediateProduct")
      return "lightbulb-fluorescent-tube";

    return "cube";
  };

  // Helper to check if we have enough of a resource
  const hasEnoughResource = (itemId, requiredAmount) => {
    const available = inventory[itemId]?.currentAmount || 0;
    return available >= requiredAmount * amount;
  };

  return (
    <View style={styles.card}>
      {/* Required Resources */}
      <Text style={styles.sectionTitle}>Required Resources</Text>
      <RequiredResources
        input={input}
        amount={amount}
        inventory={inventory}
        getResourceIcon={getResourceIcon}
      />

      {/* Expected Output */}
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
        Expected Output
      </Text>
      <ExpectedOutput
        output={output}
        amount={amount}
        inventory={inventory}
        getResourceIcon={getResourceIcon}
      />
    </View>
  );
};

export default ResourceList;
