import { StyleSheet } from "react-native";

export default StyleSheet.create({
  resourceErrorBadge: {
    backgroundColor: "#3a2323",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    alignSelf: "flex-start",
  },
  resourceErrorBadgeText: {
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#23233a",
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#35354a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },

  // Contenedores de sección
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#23233a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444455",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    marginLeft: 8,
  },

  // Estilos para la lista de recursos
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
  resourceMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  resourceMetaText: {
    fontSize: 12,
  },
  resourceWarningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  resourceWarningText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginLeft: 4,
  },

  // Estilos para el output
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    backgroundColor: "#253625",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#395239",
  },
  outputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a261a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  outputInfoContainer: {
    flex: 1,
  },
  outputAmount: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  outputDescription: {
    color: "#a5d6a7",
    fontSize: 12,
    marginTop: 2,
  },
  outputBadge: {
    backgroundColor: "#23233a",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    alignSelf: "flex-start",
  },
  outputBadgeText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
});
