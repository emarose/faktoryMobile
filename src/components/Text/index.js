import { Text as RNText } from "react-native";
import { useFontFamily } from "../AppLoader";

const Text = ({ style, children, fontFamily: propFontFamily, ...props }) => {
  // Get font context
  const { currentFont, fontFamilies } = useFontFamily();

  // Determine font variant based on style
  const getFontFamily = (combinedStyle) => {
    // If a specific font is provided in props, use it
    if (propFontFamily) return propFontFamily;

    const flatStyle = Array.isArray(combinedStyle)
      ? Object.assign({}, ...combinedStyle)
      : combinedStyle || {};

    const isBold =
      flatStyle.fontWeight === "bold" ||
      flatStyle.fontWeight === "700" ||
      flatStyle.fontWeight === "600";
    const isItalic = flatStyle.fontStyle === "italic";

    // Get the current font family (Space Mono, Pixelify Sans, etc.)
    const currentFontFamily =
      Object.keys(fontFamilies).find((family) =>
        fontFamilies[family].includes(currentFont)
      ) || "Space Mono";

    // For Space Mono which has all variants
    if (currentFontFamily === "Space Mono") {
      if (isBold && isItalic) return "SpaceMono-BoldItalic";
      if (isBold) return "SpaceMono-Bold";
      if (isItalic) return "SpaceMono-Italic";
      return "SpaceMono-VT323-Regular";
    }

    // For Pixelify Sans
    else if (currentFontFamily === "Pixelify Sans") {
      if (isBold) return "PixelifySans-Medium";
      return "PixelifySans-Regular";
    }

    // For Press Start 2P (only has one variant)
    else if (currentFontFamily === "Press Start 2P") {
      return "PressStart2P";
    }

   

    // Default to current font if we can't determine variants
    return currentFont;
  };

  const combinedStyle = [style];
  const fontFamily = getFontFamily(combinedStyle);

  // Apply font-specific size adjustments
  const getFontSizeAdjustment = (fontFamily, originalStyle) => {
    const flatOriginalStyle = Array.isArray(originalStyle)
      ? Object.assign({}, ...originalStyle)
      : originalStyle || {};

    // Original font size specified in style or default to 16
    const originalFontSize = flatOriginalStyle.fontSize || 16;

    // Adjust font size for Press Start 2P (pixel font)
    if (fontFamily === "PressStart2P") {
      // Reduce font size by ~30% to compensate for the larger appearance
      return { fontSize: originalFontSize * 0.8 };
    }
    if (fontFamily.includes("PixelifySans")) {
      return { fontSize: originalFontSize * 1.2 };
    }
    if (fontFamily.includes("BitcountGridSingle")) {
      return { fontSize: originalFontSize * 1.15 };
    }

    // No adjustment for other fonts
    return {};
  };

  // Get font size adjustment based on the font family
  const fontSizeAdjustment = getFontSizeAdjustment(fontFamily, style);

  const finalStyle = [
    { fontFamily },
    style,
    fontSizeAdjustment, // Apply the font size adjustment
    { fontWeight: undefined },
  ];

  return (
    <RNText style={finalStyle} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
