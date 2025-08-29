import { StyleSheet } from "react-native";
import Colors from "../../../../../../constants/Colors";

export default StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  fullHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  fullTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    height: 48,           // altura fija de la barra
    backgroundColor: Colors.background,
  },
  tabContent: {
    alignItems: "flex-end",
    paddingLeft: 12,
    paddingRight: 12,
  },

  // Cada “pestaña”
  chromeTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 46,            // altura fija de la pestaña
    marginBottom: -1,      // sube 1px sobre la barra
    backgroundColor: Colors.background,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderBottomWidth: 0,  // elimina borde inferior
    marginRight: 8,
    zIndex: 0,
  },
  chromeTabActive: {
    borderColor: Colors.backgroundAccent,
    zIndex: 1,             // aparece por encima de las demás
  },

  // Texto de la pestaña
  chromeTabLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  chromeTabLabelActive: {
    color: Colors.textPrimary,
  },
  chromeTabLabelInactive: {
    color: Colors.textMuted,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  nodeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  nodeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
  nodeLocation: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  nodePct: {
    color: Colors.backgroundAccent,
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});