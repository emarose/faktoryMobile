import { StyleSheet } from "react-native";
import Colors from "../../../../../constants/Colors";

export default StyleSheet.create({
  progressContainer: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  progressBarBackground: {
    width: '100%',
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 8,
  },
  progressText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: Colors.textDanger,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  cancelText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
