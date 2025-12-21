import Colors from "../constants/Colors";

/**
 * Hook that provides machine color mapping for consistent visual identity across all screens
 * @returns {Object} Object containing machine colors and utility functions
 */
export const useMachineColors = () => {
  // Machine color mapping for consistent visual identity
  const MACHINE_COLORS = {
    smelter: "#ff9800",
    constructor: "#50a553ff",
    foundry: "#C1446F",
    refinery: "#1E88E5",
    assembler: "#9C27B0",
    manufacturer: "#c8d41dff",
    miner: "#aaa8a4ff",
    extractor: "#614f4fff",
    // Default color for any missing machines
    default: "#90A4AE",
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
    const hexOpacity = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${hexOpacity}`;
  };

  return {
    MACHINE_COLORS,
    getMachineColor,
    getMachineColorWithOpacity,
  };
};

export default useMachineColors;
