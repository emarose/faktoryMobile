import { StyleSheet } from "react-native";

export default StyleSheet.create({
  resourceListContainer: {
    marginTop: 2,
  },
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#292940",
    marginBottom: 2,
  },
  resourceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#444455",
  },
  resourceInfoContainer: {
    flex: 1,
  },
  resourceName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  resourceErrorBadge: {
    backgroundColor: '#3a2323',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    alignSelf: 'flex-start',
  },
  resourceErrorBadgeText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
