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
      setLoadingStep('Loading fonts...');
      await Font.loadAsync({
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font,
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
          fontSize: 16 
        }}>
          {loadingStep}
        </Text>
      </View>
    );
  }

  return children;
};

export default AppLoader;