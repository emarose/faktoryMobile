import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../index";
import styles from "./styles";
import Colors from "../../constants/Colors";

const CustomHeader = ({ 
  title, 
  showBackButton = true, 
  rightIcon = null, 
  onRightIconPress = null,
  rightIconColor = Colors.textPrimary,
  backgroundColor = Colors.background,
  borderColor = Colors.borderLight
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate("Factory");
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
          
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color={Colors.textPrimary} 
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