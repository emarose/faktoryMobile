import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a0242ff",
  },
  backgroundImageContainer: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  summaryContainer: {
    gap: 12,
    marginBottom: 20,
  },
  resourceCard: {
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
  },
  resourceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  resourceCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  resourceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.accentGold,
  },
  resourceStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  capacityContainer: {
    marginTop: 12,
  },
  capacityLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  chartContainer: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  chart: {
    borderRadius: 8,
  },
});

export default styles;