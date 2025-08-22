import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../../styles";

const QuantityStepper = ({ amount, setAmount, maxAmount }) => {
  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity
        onPress={() => setAmount(Math.max(1, amount - 1))}
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#2c2c44",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#444455",
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>−</Text>
      </TouchableOpacity>
      
      <TextInput
        style={{
          width: 60,
          height: 40,
          backgroundColor: "#23233a",
          borderRadius: 8,
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          borderWidth: 1,
          borderColor: "#444455",
        }}
        keyboardType="numeric"
        value={String(amount)}
        onChangeText={(val) => setAmount(val)}
      />
      
      <TouchableOpacity
        onPress={() => setAmount(Math.min(maxAmount, amount + 1))}
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#2c2c44",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#444455",
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantityStepper;