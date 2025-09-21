import { StyleSheet } from "react-native";
import Colors from "../../../../../../../../../constants/Colors";

export default StyleSheet.create({
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    backgroundColor: Colors.backgroundPill,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
  },
  outputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundPanel,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
  },
  outputInfoContainer: {
    flex: 1,
  },
  outputAmount: {
    color: Colors.backgroundAccent,
    fontSize: 16,
    fontWeight: "bold",
  },
  outputDescription: {
    color: Colors.textAccent,
    fontSize: 12,
    marginTop: 2,
  },
  outputBadge: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
    alignSelf: "flex-start",
  },
  outputBadgeText: {
    color: Colors.backgroundAccent,
    fontSize: 12,
    fontWeight: "bold",
  },
});
