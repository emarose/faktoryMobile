import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000' 
    },
    backgroundImageContainer: {
        flex: 1,
    },
    gradientOverlay: {
        flex: 1,
    },
    scrollViewContent: { 
        padding: 16,
        paddingBottom: 100,
    },
    milestoneCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 0,
        marginTop: 8,
        shadowColor: '#00ffff',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1.5,
        borderColor: 'rgba(0, 255, 255, 0.3)',
        minHeight: 90,
        maxHeight: 320,
        overflow: 'hidden',
        justifyContent: 'flex-start',
    },
    milestoneUnlocked: { 
        borderColor: '#00ff88',
        shadowColor: '#00ff88',
    },
    milestoneLocked: { 
        borderColor: 'rgba(255, 0, 204, 0.4)',
        shadowColor: '#ff00cc',
    },
    milestoneName: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: '#00ffff', 
        marginBottom: 2,
        textShadowColor: 'rgba(0, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    milestoneDescription: { 
        fontSize: 14, 
        color: 'rgba(255, 255, 255, 0.7)', 
        marginVertical: 6 
    },
    unlocksTitle: { 
        fontWeight: "bold", 
        color: Colors.textPrimary, 
        marginTop: 8 
    },
    unlockItem: { 
        color: '#00ff88', 
        marginLeft: 0, 
        fontSize: 13, 
        marginBottom: 2 
    },
    unlockedText: { 
        color: '#00ff88', 
        fontWeight: "bold", 
        marginTop: 8 
    },
    lockedText: { 
        color: '#ff00cc', 
        fontWeight: "bold", 
        marginTop: 8 
    },
    unlockButton: { 
        backgroundColor: Colors.accentGreen, 
        borderRadius: 6, 
        padding: 10, 
        alignItems: 'center' 
    },
});

export default styles;