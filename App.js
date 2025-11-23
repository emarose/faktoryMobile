import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import { useColorScheme } from "react-native";
import { GameProvider, GameContext } from "./src/contexts/GameContext";
import { ToastProvider, useToastContext } from "./src/contexts/ToastContext";
import { AudioProvider } from "./src/contexts/AudioContext";
import Toast from "./src/components/Toast";
import React, { useState, useContext } from "react";

import AppLoader from "./src/components/AppLoader";

function AppContent() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const { loadGameData } = useContext(GameContext);
  const { visible, message, duration, hideToast } = useToastContext();
  
  return (
    <SafeAreaProvider>
      <AppLoader 
        onLoaded={() => setAppReady(true)} 
        loadGameData={loadGameData}
      >
        <StatusBar style="light" />
        <Navigation colorScheme={colorScheme} />
        <Toast
          visible={visible}
          message={message}
          duration={duration}
          onHide={hideToast}
        />
      </AppLoader>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <ToastProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </ToastProvider>
    </AudioProvider>
  );
}
