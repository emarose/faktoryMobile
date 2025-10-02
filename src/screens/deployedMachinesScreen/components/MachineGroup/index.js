import React from "react";
import { View } from "react-native";
import styles from "../../styles";
import { Text } from "../../../../components";

const MachineGroup = ({ typeName, children }) => (
  <View style={styles.machineTypeSection}>
    {typeName !== "All" && <Text style={styles.groupTitle}>{typeName}s</Text>}
    {children}
  </View>
);

export default MachineGroup;
