import Colors from "../constants/Colors";

/**
 * Hook that provides machine color mapping for consistent visual identity across all screens
 * @returns {Object} Object containing machine colors and utility functions
 */
export const useMachineColors = () => {
  // Machine color mapping for consistent visual identity
  const MACHINE_COLORS = {
    smelter: "#E57373", // Reddish
    constructor: "#64B5F6", // Light blue
    foundry: "#FFD54F", // Yellow
    refinery: "#AB47BC", // Purple
    assembler: "#26A69A", // Teal
    manufacturer: "#FF7043", // Orange
    miner: Colors.accentGreen, // Green from Colors
    oilExtractor: "#5D4037", // Brown
    // Default color for any missing machines
    default: "#90A4AE", // Grey blue
  };

  /**
   * Get color for a specific machine
   * @param {string} machineId - The machine identifier
   * @returns {string} The color for the machine
   */
  const getMachineColor = (machineId) => {
    return MACHINE_COLORS[machineId] || MACHINE_COLORS.default;
  };

  /**
   * Get color with opacity for backgrounds
   * @param {string} machineId - The machine identifier
   * @param {number} opacity - Opacity value between 0 and 1 (default: 0.2)
   * @returns {string} The color with opacity
   */
  const getMachineColorWithOpacity = (machineId, opacity = 0.2) => {
    const color = getMachineColor(machineId);
    const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${color}${hexOpacity}`;
  };

  return {
    MACHINE_COLORS,
    getMachineColor,
    getMachineColorWithOpacity
  };
};

export default useMachineColors;
