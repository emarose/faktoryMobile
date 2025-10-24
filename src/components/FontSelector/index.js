import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../Text';
import { useFontFamily } from '../AppLoader';
import Colors from '../../constants/Colors';

const FontSelector = () => {
  const { currentFont, setCurrentFont, fontFamilies } = useFontFamily();

  // Function to determine if a font family is currently selected
  const isFamilySelected = (familyFonts) => {
    return familyFonts.includes(currentFont);
  };

  const getDefaultFontForFamily = (fonts) => {
    return fonts[0];
  };

  const entries = Object.entries(fontFamilies);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Font Selector</Text>

      <View style={styles.listContent}>
        {entries.map(([familyName, fonts]) => (
          <View key={familyName}>
            <TouchableOpacity
              style={[
                styles.fontFamilyButton,
                isFamilySelected(fonts) && styles.selectedFontFamily,
              ]}
              onPress={() => setCurrentFont(getDefaultFontForFamily(fonts))}
            >
              <Text
                fontFamily={getDefaultFontForFamily(fonts)}
                style={[
                  styles.fontFamilyName,
                  isFamilySelected(fonts) && styles.selectedFontText,
                ]}
              >
                {familyName}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  fontOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  fontFamilyButton: {
    backgroundColor: Colors.buttonBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  selectedFontFamily: {
    backgroundColor: Colors.accentGreen,
  },
  fontFamilyName: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  selectedFontText: {
    color: Colors.background,
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 8,
  },
});

export default FontSelector;