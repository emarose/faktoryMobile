import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 30,
    alignSelf: "center",
    backgroundColor: Colors.backgroundPanel,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.accentBlue,
    overflow: "hidden",
  },

  toastOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
  },

  text: {
    color: Colors.accentBlue, // Color de success directo
    fontWeight: "500",
    fontSize: 13,
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  closeBtn: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    minWidth: 30,
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  closeBtnPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ scale: 0.95 }],
  },
});

export default styles;
