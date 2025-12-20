import Colors from '../../../../../constants/Colors';
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
    backgroundColor: Colors.accentGold,
  },
  pauseResumeIdle: {
    backgroundColor: Colors.accentGreen,
  },
  pauseResumeText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  detachButton: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detachText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default styles;
