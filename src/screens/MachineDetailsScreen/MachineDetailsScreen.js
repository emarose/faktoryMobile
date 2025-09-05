import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

const MachineDetailsScreen = ({ route }) => {
  // This screen is now a placeholder.
  // You can add generic machine details or stats here in the future.
  const { machine } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.detailsContent}>
        <Text style={styles.detailsTitle}>
          Details for {machine?.name || "Machine"}
        </Text>
        <View style={styles.card}>
          <Text style={{ color: "white" }}>
            This is a placeholder screen for machine details.
          </Text>
          <Text style={{ color: "white", marginTop: 10 }}>
            ID: {machine?.id}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MachineDetailsScreen;
