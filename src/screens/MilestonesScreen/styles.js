import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    title: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary, margin: 16 },
    scrollViewContent: { padding: 16 },
    milestoneCard: {
        backgroundColor: Colors.backgroundPanel,
        borderRadius: 14,
        padding: 14,
        marginBottom: 0,
        marginTop: 8,
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1.5,
        borderColor: Colors.borderLight,
        minHeight: 90,
        maxHeight: 320,
        overflow: 'hidden',
        justifyContent: 'flex-start',
    },
    milestoneUnlocked: { borderColor: Colors.accentGreen },
    milestoneLocked: { borderColor: Colors.textDanger },
    milestoneName: { fontSize: 18, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 2 },
    milestoneDescription: { fontSize: 14, color: Colors.textMuted, marginVertical: 6 },
    unlocksTitle: { fontWeight: "bold", color: Colors.textPrimary, marginTop: 8 },
    unlockItem: { color: Colors.textAccent, marginLeft: 0, fontSize: 13, marginBottom: 2 },
    unlockedText: { color: Colors.accentGreen, fontWeight: "bold", marginTop: 8 },
    lockedText: { color: Colors.textDanger, fontWeight: "bold", marginTop: 8 },
    unlockButton: { backgroundColor: Colors.accentGreen, borderRadius: 6, padding: 10, alignItems: 'center' },
});

export default styles;