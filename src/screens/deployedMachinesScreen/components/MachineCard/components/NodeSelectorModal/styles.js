
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,20,30,0.85)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeSelectorModal: {
    backgroundColor: "#23233a",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    maxWidth: '95%',
    width: '95%',
    maxHeight: '80%',
    alignSelf: 'center',
    flexShrink: 1,
    flexGrow: 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  modalTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181828",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 18,
    height: 38,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 18,
  },
  resourceTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#23233a",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#444455",
  },
  activeTab: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  tabText: {
    color: "#bbb",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6,
  },
  activeTabText: {
    color: "#fff",
  },
  flatListMaxHeight: {
    maxHeight: 260,
    flexGrow: 1,
  },
  nodeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181828",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#23233a",
  },
  nodeIconContainer: {
    backgroundColor: "#23233a",
    borderRadius: 16,
    padding: 6,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  nodeLocation: {
    color: "#bbb",
    fontSize: 12,
    marginTop: 2,
  },
  nodeProgress: {
    marginTop: 4,
    marginBottom: 2,
  },
  nodeStats: {
    alignItems: "center",
    marginLeft: 10,
  },
  nodeCapacity: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
  },
  emptyText: {
    color: "#bbb",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});

export default styles;
