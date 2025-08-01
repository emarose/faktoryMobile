// screens/InventoryScreen/styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2a", // Dark background for the whole screen
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    paddingVertical: 20,
    marginTop: 10, // Adjust for SafeAreaView
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20, // Ensure content isn't cut off at the bottom
  },
  inventoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Align items to the start of the row
    // You might want 'center' or 'space-around' depending on desired spacing
  },
  gridItem: {
    width: "30%", // Roughly 3 items per row, adjust as needed (e.g., '23%' for 4 items)
    aspectRatio: 1, // Makes the item square
    margin: "1.66%", // Creates space between items for 3 items per row (100 / 3 = 33.33% - 30% = 3.33% / 2 margins = 1.66%)
    backgroundColor: "#2a2a3a", // Darker background for each item card
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444455",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    position: "relative", // Needed for absolute positioning of amount overlay
  },
  iconContainer: {
    width: "80%", // Make icon placeholder take up most of the square
    height: "80%",
    backgroundColor: "#5a5a7e", // Placeholder color for the icon area
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensures icon/text doesn't spill if it's too big
  },
  // If you use actual Image components for icons:
  // itemIcon: {
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'contain', // Or 'cover'
  // },
  iconText: {
    color: "#e0e0e0", // Light text for placeholder initial
    fontSize: 28, // Adjust size for visibility
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 12, // Smaller font for item name below icon
    color: "#ffffff",
    marginTop: 5,
    textAlign: "center",
    position: "absolute", // Position name below icon in a fixed spot
    bottom: 5,
    width: "100%",
  },
  amountOverlay: {
    position: "absolute",
    bottom: 0, // Position at bottom
    right: 0, // Position at right
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent dark background for amount
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 25, // Ensure minimum width for single digits
    alignItems: "center",
    justifyContent: "center",
    // Border to make it pop more
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 8,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#a0d911", // Green for resource amounts, or '#fff' for white
  },
  emptyInventoryText: {
    color: "#b0b0b0",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default styles;
