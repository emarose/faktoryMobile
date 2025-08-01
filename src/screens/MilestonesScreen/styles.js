import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#181825" },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", margin: 16 },
    scrollViewContent: { padding: 16 },
    milestoneCard: { backgroundColor: "#23233a", borderRadius: 12, padding: 16, marginBottom: 16 },
    milestoneUnlocked: { borderColor: "#27ae60", borderWidth: 2 },
    milestoneLocked: { borderColor: "#e53935", borderWidth: 2 },
    milestoneName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
    milestoneDescription: { fontSize: 16, color: "#bbb", marginVertical: 8 },
    unlocksTitle: { fontWeight: "bold", color: "#fff", marginTop: 8 },
    unlockItem: { color: "#a0d911", marginLeft: 8 },
    unlockedText: { color: "#27ae60", fontWeight: "bold", marginTop: 8 },
    lockedText: { color: "#e53935", fontWeight: "bold", marginTop: 8 },
    unlockButton: { backgroundColor: '#27ae60', borderRadius: 6, padding: 10, alignItems: 'center' },
});

export default styles;