import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../index";
import styles from "./styles";

const CustomHeader = ({ 
  title, 
  showBackButton = true, 
  rightIcon = null, 
  onRightIconPress = null,
  rightIconColor = "#e8f4fd",
  backgroundColor = "#1f2935",
  borderColor = "#4a5866"
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor,
        borderBottomColor: borderColor
      }
    ]}>
      {/* Left Side - Back Button */}
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color="#e8f4fd" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Center - Title */}
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right Side - Optional Icon */}
      <View style={styles.rightContainer}>
        {rightIcon && onRightIconPress && (
          <TouchableOpacity 
            style={styles.rightButton}
            onPress={onRightIconPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={rightIcon} 
              size={24} 
              color={rightIconColor} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomHeader;