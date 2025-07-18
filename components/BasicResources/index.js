import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const BasicResources = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: 10,
        width: "100%",
      }}
    >
      <Text>🍕O</Text>
      <Text>🌭O</Text>
      <Text>🍟O</Text>
      <Text>🍔O</Text>
    </View>
  );
};

export default BasicResources;

const styles = StyleSheet.create({});
