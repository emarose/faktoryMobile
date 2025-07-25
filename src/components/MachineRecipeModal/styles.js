import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay, consistent with general theme
  },
  modalView: {
    margin: 20,
    backgroundColor: "#2a2a4a", // Matching buildCard background
    borderRadius: 8, // Matching buildCard borderRadius
    padding: 25, // Consistent padding
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2 // Subtle shadow, similar to buildCard implicit shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
    borderColor: '#4a4a6e', // Matching buildCard borderColor
    borderWidth: 1, // Matching buildCard borderWidth
  },
  modalTitle: {
    marginBottom: 20, // Consistent with title marginBottom
    textAlign: "center",
    fontSize: 28, // Matching title fontSize
    fontWeight: "bold", // Matching title fontWeight
    color: "#e0e0e0", // Matching title color
    // Removed textShadow as it's not present in the new styles
  },
  scrollView: {
    width: '100%',
    maxHeight: '70%',
    paddingVertical: 10, // Keep padding for content
  },
  noRecipesText: {
    color: '#aaaaaa', // Matching noItemsText color
    fontSize: 16, // Matching noItemsText fontSize
    textAlign: 'center',
    padding: 20,
    fontStyle: 'normal', // Removed italic as it's not in the new style
  },
  closeButton: {
    backgroundColor: '#007bff', // Matching buildButton backgroundColor
    paddingVertical: 12, // Matching buildButton paddingVertical
    paddingHorizontal: 20, // Matching buildButton paddingHorizontal
    borderRadius: 5, // Matching buildButton borderRadius
    marginTop: 25, // Adjusted for consistent spacing
    alignItems: 'center', // Ensures text is centered
    // Shadow properties from buildButton (elevation 3)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textStyle: {
    color: '#ffffff', // Matching buildButtonText color
    fontWeight: "bold", // Matching buildButtonText fontWeight
    textAlign: "center",
    fontSize: 16, // Matching buildButtonText fontSize
  }
});

export default modalStyles;