import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  controlButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  pauseResumeButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pauseResumeActive: {
    backgroundColor: "#FF9800",
  },
  pauseResumeIdle: {
    backgroundColor: "#4CAF50",
  },
  pauseResumeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  detachButton: {
    backgroundColor: "#35354a",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detachText: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default styles;
