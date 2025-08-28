import { StyleSheet } from "react-native";

export default StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#23233a",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#444455",
    height: 48,           // altura fija de la barra
    backgroundColor: "#23233a",
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
    backgroundColor: "#23233a",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: "#444455",
    borderBottomWidth: 0,  // elimina borde inferior
    marginRight: 8,
    zIndex: 0,
  },
  chromeTabActive: {
    borderColor: "#4CAF50",
    zIndex: 1,             // aparece por encima de las demás
  },

  // Texto de la pestaña
  chromeTabLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  chromeTabLabelActive: {
    color: "#fff",
  },
  chromeTabLabelInactive: {
    color: "#bbb",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181828",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 14,
  },
  nodeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181828",
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
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  nodeLocation: {
    color: "#bbb",
    fontSize: 12,
    marginTop: 2,
  },
  nodePct: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
  emptyText: {
    color: "#bbb",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});