import { StyleSheet } from "react-native";

const machineCardStyles = StyleSheet.create({
  machineCard: {
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
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
  },
  rowAlignCenterGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderColor: "#444",
    borderRadius: 8,
    backgroundColor: "#1e1e2a",
  },
  nodeDepletedText: {
    color: "#c00",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  rowGap8MarginTop8: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  pauseResumeButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  pauseResumeIdle: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
  },
  pauseResumeActive: {
    backgroundColor: "#ff9800",
    shadowColor: "#ff9800",
  },
  pauseResumeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  detachButton: {
    backgroundColor: "#23233a",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    shadowColor: "#23233a",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  detachText: {
    color: "#bbb",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default machineCardStyles;
