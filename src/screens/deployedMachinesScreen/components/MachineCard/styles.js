import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const machineCardStyles = StyleSheet.create({
  machineCard: {
    backgroundColor: Colors.background,
    marginBottom: 8,
    /*    paddingVertical: 8, */
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
    // Enhanced shadow for machine cards
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  machineName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpaceBetween: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  rowAlignCenterGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  machineIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  marginVertical10: {
    marginVertical: 10,
  },
  assignNodeButton: {
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  assignNodeText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  noNodesText: {
    color: Colors.accentGold,
    fontSize: 13,
    marginTop: 4,
  },
  flatListMaxHeight: {
    maxHeight: 320,
  },
  nodeInfoContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  extraInfoContainer: {
    paddingVertical: 4,
    backgroundColor: Colors.backgroundPanel,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  selectedNodePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedNodePillText: {
    color: Colors.fallback,
    fontWeight: "600",
    fontSize: 14,
  },
  machineStatus: {
    color: Colors.textMuted, // Un gris suave para el estado
    fontSize: 13,
    fontStyle: "italic",
  },
  depletionSection: {
    marginBottom: 16,
  },
  nodeDepletedText: {
    color: Colors.textDanger, // Un rojo más estándar para errores
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  controlButtonsContainer: {
    flexDirection: "row",
    gap: 12, // Espacio entre los botones
    marginTop: 8,
    justifyContent: "center", // Centra los botones
  },
  pauseResumeButton: {
    flex: 1, // Permite que los botones ocupen el espacio disponible
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  pauseResumeIdle: {
    backgroundColor: Colors.backgroundAccent,
  },
  pauseResumeActive: {
    backgroundColor: Colors.accentGold,
  },
  pauseResumeText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },
  detachButton: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel, // Un gris oscuro para el botón de "desconectar"
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detachText: {
    color: Colors.textSecondary,
    fontWeight: "bold",
    fontSize: 14,
  },
  depletionTime: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
    textAlign: "center",
  },
  // Crafting Controls
  craftingControlsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    justifyContent: "center",
  },
  craftingControlButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pauseButton: {
    backgroundColor: Colors.accentBlue,
  },
  resumeButton: {
    backgroundColor: Colors.accentGreen,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  craftingControlText: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: 12,
  },
});

export default machineCardStyles;
