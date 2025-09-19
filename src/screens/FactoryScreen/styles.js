import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textAccent,
    marginTop: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  gridItem: {
    width: "100%",
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4a4a6e",
  },
  gridItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 5,
  },
  gridItemDescription: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
  },
  
  // Milestone specific styles
  milestoneCard: {
    alignItems: "stretch",
    paddingVertical: 20,
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  milestoneInfo: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  milestoneDescription: {
    color: "#ffd700",
    fontSize: 13,
    lineHeight: 18,
  },
  completedText: {
    color: "#bfbfbf",
    fontSize: 16,
    fontStyle: "italic",
    marginLeft: 12,
  },
  
  // Progress section styles
  progressSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#4a4a6e",
  },
  progressTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  requirementRow: {
    marginBottom: 12,
  },
  requirementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  requirementName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  requirementCount: {
    color: "#ffd700",
    fontSize: 12,
    fontWeight: "600",
  },
  requirementCompleted: {
    color: "#4CAF50",
  },
  overallProgress: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#3a3a5e",
    alignItems: "center",
  },
  overallProgressText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  readyToComplete: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  
  // Mini progress bar styles
  miniProgressBar: {
    height: 6,
    backgroundColor: "#2a2a2a",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 2,
  },
  miniProgressFill: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.3s ease",
  },
});