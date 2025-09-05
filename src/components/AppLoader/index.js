// src/components/AppLoader/index.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Font from 'expo-font';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const AppLoader = ({ children, onLoaded }) => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('Initializing...');

  useEffect(() => {
    preloadAllAssets();
  }, []);

  const preloadAllAssets = async () => {
    try {
      setLoadingStep('Loading assets...');
      await Font.loadAsync({
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font,
        'SpaceMono-Regular': require('../../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf'),
        'SpaceMono-Bold': require('../../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf'),
        'SpaceMono-Italic': require('../../../assets/fonts/Space_Mono/SpaceMono-Italic.ttf'),
        'SpaceMono-BoldItalic': require('../../../assets/fonts/Space_Mono/SpaceMono-BoldItalic.ttf'),
      });



      setLoadingStep('Preparing game data...');
      // Precalcular datos que necesites
      await new Promise(resolve => setTimeout(resolve, 500));

      setLoadingStep('Ready!');
      await new Promise(resolve => setTimeout(resolve, 300));

      setLoading(false);
      onLoaded?.();
    } catch (error) {
      console.error('Error preloading assets:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e'
      }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{
          color: '#fff',
          marginTop: 20,
          fontSize: 16,
          fontFamily: 'SpaceMono-Regular'

        }}>
          {loadingStep}
        </Text>
      </View>
    );
  }

  return children;
};

export default AppLoader;