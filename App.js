import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Navigation from "./src/navigation";
import { useColorScheme } from "react-native";
import { GameProvider } from "./src/contexts/GameContext";

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="light" />
        <Navigation colorScheme={colorScheme} />
      </GameProvider>
    </SafeAreaProvider>
  );
}
