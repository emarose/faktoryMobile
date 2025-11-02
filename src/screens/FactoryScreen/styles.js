import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { heightPercentageToDP } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a0242ff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundImageContainer: {
    flex: 1,
    width: "100%",
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: heightPercentageToDP(1),
    paddingVertical: 10,
    gap:12
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // marginBottom: 15,
  },
  rowSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //gap: 10,
    marginBottom: 15,
  },
  gridItem: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 16,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  halfItem: {
    width: "49%",
  },
  gradientCard: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
    width: "100%",
    opacity: 0.8,
  },
  gridItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  gridItemDescription: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
  },
});

export default styles;
