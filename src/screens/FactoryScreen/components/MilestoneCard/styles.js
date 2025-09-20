import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

export default styles = StyleSheet.create({
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
  
  // Milestone specific styles
  milestoneCard: {
    alignItems: "stretch",
    paddingVertical: 16,
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  milestoneInfo: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  milestoneDescription: {
    color: Colors.textAccent,
    fontSize: 12,
    lineHeight: 18,
  },
  completedText: {
    color: Colors.textMuted,
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
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#3a3a5e",
    alignItems: "center",
  },
  overallProgressText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "flex-end",
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