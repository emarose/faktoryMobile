import React, { useCallback } from "react";
import { View, TouchableOpacity, Text as RNText } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';

const QuantitySlider = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 100,
  accentColor = "#ff9800",
  disabled = false 
}) => {
  const safeMax = Math.max(min, max);
  const safeMin = min;
  const currentValue = Math.max(safeMin, Math.min(safeMax, parseInt(value) || safeMin));

  const handleValueChange = useCallback((newValue) => {
    const roundedValue = Math.round(newValue);
    onChange(String(roundedValue));
  }, [onChange]);

  const handleDecrement = useCallback(() => {
    if (disabled) return;
    const newValue = Math.max(safeMin, currentValue - 1);
    onChange(String(newValue));
  }, [disabled, currentValue, safeMin, onChange]);

  const handleIncrement = useCallback(() => {
    if (disabled) return;
    const newValue = Math.min(safeMax, currentValue + 1);
    onChange(String(newValue));
  }, [disabled, currentValue, safeMax, onChange]);

  return (
    <View style={{ marginVertical: 16, alignItems: "center", opacity: disabled ? 0.5 : 1 }}>
      {/* Value Display with +/- Buttons */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={disabled || currentValue <= safeMin}
          style={{
            backgroundColor: "#2c2c2c",
            width: 36,
            height: 36,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: accentColor,
            opacity: (disabled || currentValue <= safeMin) ? 0.4 : 1,
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons name="remove" size={20} color="#e8f4fd" />
        </TouchableOpacity>

        <View style={{ marginHorizontal: 32, alignItems: "center" }}>
          <RNText style={{ color: "#e8f4fd", fontWeight: "bold", fontSize: 18 }}>
            {currentValue}
          </RNText>
          <RNText style={{ color: "#6b7885", fontSize: 11, marginTop: 2 }}>
            of {safeMax}
          </RNText>
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          disabled={disabled || currentValue >= safeMax}
          style={{
            backgroundColor: "#2c2c2c",
            width: 36,
            height: 36,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: accentColor,
            opacity: (disabled || currentValue >= safeMax) ? 0.4 : 1,
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons name="add" size={20} color="#e8f4fd" />
        </TouchableOpacity>
      </View>

      {/* Slider */}
      <View style={{ width: 250 }}>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={safeMin}
          maximumValue={safeMax}
          value={currentValue}
          onValueChange={handleValueChange}
          minimumTrackTintColor={accentColor}
          maximumTrackTintColor="#3a3a3a"
          thumbTintColor={accentColor}
          step={1}
          disabled={disabled}
        />
      </View>

      {/* Min/Max Labels */}
      <View
        style={{
          flexDirection: "row",
          width: 250,
          justifyContent: "space-between",
          marginTop: -8,
        }}
      >
        <RNText style={{ color: "#6b7885", fontSize: 11 }}>{safeMin}</RNText>
        <RNText style={{ color: "#6b7885", fontSize: 11 }}>{safeMax}</RNText>
      </View>
    </View>
  );
};

export default QuantitySlider;
