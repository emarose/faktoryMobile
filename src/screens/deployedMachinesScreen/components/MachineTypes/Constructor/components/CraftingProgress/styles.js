import { StyleSheet } from "react-native";

export default StyleSheet.create({
  progressContainer: {
    width: '100%',
    backgroundColor: '#1f2935',
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#4a5866',
  },
  progressBarBackground: {
    width: '100%',
    height: 16,
    backgroundColor: '#3a4856',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6db4f0',
    borderRadius: 4,
  },
  progressText: {
    color: '#e8f4fd',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  cancelButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#a74a4a',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d66b6b',
  },
  cancelText: {
    color: '#e8f4fd',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
