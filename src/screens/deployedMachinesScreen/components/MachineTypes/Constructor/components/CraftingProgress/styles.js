import { StyleSheet } from "react-native";
import Colors from "../../../../../../../constants/Colors";

export default StyleSheet.create({
  progressContainer: {
    width: '100%',
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressBarBackground: {
    width: '100%',
    height: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentGreen,
    borderRadius: 4,
  },
  progressText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  cancelButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: Colors.error,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  queueText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
