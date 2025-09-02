import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import { useColorScheme } from "react-native";
import { GameProvider } from "./src/contexts/GameContext";
import { ToastProvider, useToastContext } from "./src/contexts/ToastContext";
import Toast from "./src/components/Toast";
import React, { useState, useEffect } from "react";

import AppLoader from "./src/components/AppLoader";

function AppContent() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);

  const { visible, message, duration, hideToast } = useToastContext();
  return (
    <SafeAreaProvider>
      <AppLoader onLoaded={() => setAppReady(true)}>
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
      </AppLoader>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
