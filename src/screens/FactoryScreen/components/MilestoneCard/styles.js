import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  gridItem: {
    width: "100%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  // Milestone specific styles
  milestoneCard: {
    alignItems: "stretch",
    paddingVertical: 16,
    opacity: 0.8,
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  milestoneInfo: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  nameAndCaret: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  starTouchable: {
    borderWidth: 1,
    borderColor: Colors.accentGold,
    elevation: 5,
    borderRadius: 5,
    padding: 5,
  },
  milestoneDescription: {
    color: Colors.accentGreen,
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
    borderTopColor: Colors.border,
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
  requirementNameWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementIconContainer: {
    width: 20,
    height: 20,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  requirementName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "500",
  },
  requirementCount: {
    color: Colors.accentGold,
    fontSize: 12,
    fontWeight: "600",
  },
  requirementCompleted: {
    color: Colors.backgroundAccent,
  },
  overallProgress: {
    alignItems: "center",
  },
  overallProgressText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "flex-end",
  },
  readyToComplete: {
    color: Colors.backgroundAccent,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  
  // Mini progress bar styles
  miniProgressBar: {
    height: 6,
    backgroundColor: Colors.background,
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

export default styles;