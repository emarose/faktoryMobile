import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2c2c2c",
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  valueDisplay: {
    marginHorizontal: 32,
    alignItems: "center",
  },
  valueText: {
    color: "#e8f4fd",
    fontWeight: "bold",
    fontSize: 18,
  },
  maxText: {
    color: "#6b7885",
    fontSize: 11,
    marginTop: 2,
  },
  sliderContainer: {
    height: 44,
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    backgroundColor: "#3a3a3a",
  },
  progressTrack: {
    position: "absolute",
  },
  thumb: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  thumbInner: {
    borderRadius: 4,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  labelText: {
    color: "#6b7885",
    fontSize: 11,
  },
});

export default styles;
