import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default CraftButton = ({ label, onPress, disabled, icon = "smog" }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
    style={{
      flex: 1,
      backgroundColor: disabled ? '#3a3a48' : '#2c2c44',
      borderRadius: 12,
      paddingVertical: 14,
      marginHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: disabled ? '#444455' : '#4CAF50',
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={disabled ? '#888' : '#4CAF50'}
      />
      <Text style={{
        color: disabled ? '#888' : '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
      }}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);