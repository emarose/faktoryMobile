import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#181825" },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", margin: 16 },
    scrollViewContent: { padding: 16 },
    milestoneCard: {
        backgroundColor: "#23233a",
        borderRadius: 14,
        padding: 14,
        marginBottom: 0,
        marginTop: 8,
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1.5,
        borderColor: '#23233a',
        minHeight: 90,
        maxHeight: 320,
        overflow: 'hidden',
        justifyContent: 'flex-start',
    },
    milestoneUnlocked: { borderColor: "#27ae60" },
    milestoneLocked: { borderColor: "#e53935" },
    milestoneName: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 2 },
    milestoneDescription: { fontSize: 14, color: "#bbb", marginVertical: 6 },
    unlocksTitle: { fontWeight: "bold", color: "#fff", marginTop: 8 },
    unlockItem: { color: "#a0d911", marginLeft: 0, fontSize: 13, marginBottom: 2 },
    unlockedText: { color: "#27ae60", fontWeight: "bold", marginTop: 8 },
    lockedText: { color: "#e53935", fontWeight: "bold", marginTop: 8 },
    unlockButton: { backgroundColor: '#27ae60', borderRadius: 6, padding: 10, alignItems: 'center' },
});

export default styles;