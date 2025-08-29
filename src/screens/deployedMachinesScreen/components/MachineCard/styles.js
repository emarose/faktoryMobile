import { StyleSheet } from "react-native";

const machineCardStyles = StyleSheet.create({
  machineCard: {
    backgroundColor: "#23233a",
    marginBottom: 8,
    /*    paddingVertical: 8, */
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  machineName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  machineInfo: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
  },
  emptyText: {
    color: "#bbb",
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
    backgroundColor: "#2c2c44",
    padding: 8,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#444455",
  },
  loupeButton: {
    padding: 8,
    alignSelf: "flex-start",
  },
  marginVertical10: {
    marginVertical: 10,
  },
  assignNodeButton: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    backgroundColor: "#2c2c44",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  assignNodeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noNodesText: {
    color: "#ff9800",
    fontSize: 13,
    marginTop: 4,
  },
  flatListMaxHeight: {
    maxHeight: 320,
  },
  nodeInfoContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A50",
    marginBottom:16
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
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  machineStatus: {
    color: "#9CA3AF", // Un gris suave para el estado
    fontSize: 13,
    fontStyle: "italic",
  },
  depletionSection: {
    marginBottom: 16,
  },
  nodeDepletedText: {
    color: "#EF4444", // Un rojo más estándar para errores
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
    backgroundColor: "#4CAF50",
  },
  pauseResumeActive: {
    backgroundColor: "#ff9800",
  },
  pauseResumeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  detachButton: {
    flex: 1,
    backgroundColor: "#2D3748", // Un gris oscuro para el botón de "desconectar"
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4A5568",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detachText: {
    color: "#CBD5E0",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default machineCardStyles;
