import { Text, TouchableOpacity } from "react-native";

export default  CraftButton = ({ label, onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{
      flex: 1,
      backgroundColor: disabled ? '#aaa' : '#27ae60',
      borderRadius: 8,
      paddingVertical: 16,
      marginHorizontal: 4,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    }}
  >
    <Text style={{
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 0.5,
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);
