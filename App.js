import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import { useColorScheme } from "react-native";
import { GameProvider } from "./src/contexts/GameContext";
import { ToastProvider, useToastContext } from "./src/contexts/ToastContext";
import Toast from "./src/components/Toast";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";

function AppContent() {
  const colorScheme = useColorScheme();
  const { visible, message, duration, hideToast } = useToastContext();
  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="light" />
        <Navigation colorScheme={colorScheme} />
        <Toast
          visible={visible}
          message={message}
          duration={duration}
          onHide={hideToast}
        />
      </GameProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync({
      ...MaterialIcons.font,
      ...MaterialCommunityIcons.font,
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#23233a",
        }}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
