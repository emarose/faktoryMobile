import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { GameAssets } from "../AppLoader";

/**
 * A reusable component for displaying game icons with consistent styling
 *
 * @param {Object} props Component props
 * @param {string} props.iconId The ID of the icon to display from GameAssets.icons
 * @param {number} props.size Container size in pixels (default: 32)
 * @param {number} props.iconSize Size of the icon inside the container (default: 16)
 * @param {Object} props.style Additional styles to apply to the container
 * @param {Object} props.iconStyle Additional styles to apply to the icon
 * @param {Object} props.source Optional direct source for the image (overrides iconId)
 * @returns {React.Component} The icon container component
 */
const IconContainer = ({
  iconId,
  size = 32,
  iconSize = 16,
  style = {},
  iconStyle = {},
  source,
}) => {
  // Use provided source or get from GameAssets using iconId
  const iconSource =
    source ||
    (iconId
      ? GameAssets.icons[iconId] || GameAssets.icons.default
      : GameAssets.icons.default);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={iconSource}
        style={[{ width: iconSize, height: iconSize }, iconStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cyan,
  },
});

export default IconContainer;
