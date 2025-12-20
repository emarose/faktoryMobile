import { StyleSheet } from "react-native";
import Colors from "../../../../../constants/Colors";

export default StyleSheet.create({
  resourceErrorBadge: {
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Colors.error,
    alignSelf: "flex-start",
  },
  resourceErrorBadgeText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
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
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emptyText: {
    color: Colors.textMuted,
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
    flex: 1,
  },
  resourceName: {
    color: Colors.textPrimary,
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
    color: Colors.error,
    fontSize: 12,
    marginLeft: 4,
  },

  // Estilos para el output
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  outputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  outputInfoContainer: {
    flex: 1,
  },
  outputAmount: {
    color: Colors.success,
    fontSize: 16,
    fontWeight: "bold",
  },
  outputDescription: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  outputBadge: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Colors.success,
    alignSelf: "flex-start",
  },
  outputBadgeText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: "bold",
  },
});
