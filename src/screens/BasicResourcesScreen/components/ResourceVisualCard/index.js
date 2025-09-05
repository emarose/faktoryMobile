import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import Colors from "../../../../constants/Colors";
import { Text } from "../../../../components";

const ResourceVisualCard = ({
  name,
  icon,
  amount,
  onPress,
  selected
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.amount}>{amount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    margin: 8,
    padding: 16,
    minWidth: 100,
    minHeight: 120,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.accentGold,
    borderWidth: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  name: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  amount: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});

export default ResourceVisualCard;
