import { StyleSheet } from "react-native";
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
  },
  // Machine Type Tabs
  filterTabsContainer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterTabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  machineTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  machineTabActive: {
    backgroundColor: Colors.textAccent,
    borderColor: Colors.textAccent,
  },
  machineTabIcon: {
    fontSize: 16,
  },
  machineTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    minWidth: 40,
    textAlign: 'center',
  },
  machineTabTextActive: {
    color: Colors.backgroundPrimary,
    fontWeight: '600',
  },
  machineTabCount: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
    marginLeft: 2,
  },
  machineTabCountActive: {
    color: Colors.backgroundPrimary,
    fontWeight: '600',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyStateText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  machineGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textAccent,
    marginBottom: 10,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 5,
  },
  machineCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  machineInfo: {
    flex: 1,
    marginRight: 10,
  },
  machineStatus: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginVertical: 8,
  },
  machineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  machineDescription: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 5,
  },
  machineDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  upgradeButton: {
    backgroundColor: Colors.accentBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  upgradeButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default styles;
