import { StyleSheet } from "react-native";

export default StyleSheet.create({
  progressContainer: {
    width: '100%',
    backgroundColor: '#23233a',
    borderRadius: 10,
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#35354a',
  },
  progressBarBackground: {
    width: '100%',
    height: 16,
    backgroundColor: '#292940',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
