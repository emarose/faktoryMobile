import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Navigation from "./src/navigation";
import { useColorScheme } from "react-native";
import { GameProvider } from "./src/contexts/GameContext";

import { useToast } from "./src/hooks/useToastMessage";
import Toast from "./src/components/Toast";

function AppContent() {
  const colorScheme = useColorScheme();
  const { visible, message, duration, hideToast } = useToast();

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
  return <AppContent />;
}
