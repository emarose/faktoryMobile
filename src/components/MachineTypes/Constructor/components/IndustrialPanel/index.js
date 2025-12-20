import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../../../../components";

const IndustrialPanel = ({ title, children, style }) => {
  return (
    <View style={[styles.industrialPanel, style]}>
      {title && (
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>{title}</Text>
        </View>
      )}
      <View style={styles.panelContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  industrialPanel: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  
  panelHeader: {
    backgroundColor: "#3a4856",
    borderBottomWidth: 1,
    borderBottomColor: "#4a5866",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  panelTitle: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  
  panelContent: {
    padding: 12,
  },
});

export default IndustrialPanel;