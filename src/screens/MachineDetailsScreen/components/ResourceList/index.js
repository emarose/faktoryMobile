import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles";
import { items } from "../../../../data/items";

const ResourceList = ({ inputs, outputs, amount, inventory }) => {
  const input = Array.isArray(inputs) ? inputs : [];
  const output = Array.isArray(outputs) ? outputs[0] : null;

  return (
    <View>
      <Text style={styles.sectionTitle}>
        Required Resources
      </Text>
      {input.length === 0 ? (
        <Text style={styles.subText}>None</Text>
      ) : (
        input.map((input) => (
          <Text key={input.item} style={styles.resourceText}>
            {input.amount * amount} x{" "}
            {items[input.item]?.name || input.item}
            <Text style={styles.inventoryText}>
              (You have:{" "}
              {inventory[input.item]?.currentAmount || 0})
            </Text>
          </Text>
        ))
      )}

      <Text style={styles.sectionTitle}>Expected Output</Text>
      <Text style={styles.outputText}>
        {output ? output.amount * amount : 0} x{" "}
        {output
          ? items[output.item]?.name || output.item
          : ""}
      </Text>
    </View>
  );
};

export default ResourceList;