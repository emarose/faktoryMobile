import { StyleSheet } from "react-native";
import Colors from "../../../../../../../constants/Colors";

export default StyleSheet.create({
  resourceListContainer: {
    marginTop: 2,
  },
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 2,
  },
  resourceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  resourceInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resourceName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  resourceErrorBadge: {
    backgroundColor: Colors.textDanger,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: Colors.textDanger,
    alignSelf: "flex-start",
  },
  resourceErrorBadgeText: {
    color: Colors.textDanger,
    fontSize: 12,
  },
});
