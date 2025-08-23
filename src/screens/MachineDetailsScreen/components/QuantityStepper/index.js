import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import styles from "../../styles";

const QuantityStepper = ({ amount, setAmount, maxAmount }) => {
  return (
    <View style={[styles.stepperContainer, { alignItems: "center" }]}>
      <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 8 }}>
        Amount: {amount}
      </Text>
      <Slider
        style={{ width: 180, height: 40 }}
        minimumValue={1}
        maximumValue={Math.max(1, maxAmount)}
        step={1}
        value={amount}
        minimumTrackTintColor="#4caf50"
        maximumTrackTintColor="#444"
        thumbTintColor="#ffe082"
        onValueChange={setAmount}
      />
    </View>
  );
};

export default QuantityStepper;