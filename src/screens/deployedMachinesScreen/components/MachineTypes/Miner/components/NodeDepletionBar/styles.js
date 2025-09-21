import { StyleSheet } from "react-native";
import Colors from "../../../../../../constants/Colors";

const styles = StyleSheet.create({
  depletionSection: {
    marginTop: 12,
    gap: 8,
  },
  nodeDepletedText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
});

export default styles;
