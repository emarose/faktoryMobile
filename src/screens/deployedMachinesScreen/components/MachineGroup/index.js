import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles";

const MachineGroup = ({ typeName, children }) => (
  <View style={styles.machineTypeSection}>
    <Text style={styles.groupTitle}>{typeName}s</Text>
    {children}
  </View>
);

export default MachineGroup;
