import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import BuildScreen from "../screens/BuildScreen/BuildScreen";
import MapScreen from "../screens/MapScreen/MapScreen";
import InventoryScreen from "../screens/InventoryScreen/InventoryScreen";
import ProductAssemblyScreen from "../screens/ProductAssemblyScreen/ProductAssemblyScreen";
import DeployedMachinesScreen from "../screens/DeployedMachinesScreen/DeployedMachinesScreen";
import BasicResourcesScreen from "../screens/BasicResourcesScreen/BasicResourcesScreen";
import MilestonesScreen from "../screens/MilestonesScreen/MilestonesScreen";
import Colors from "../constants/Colors";

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: Colors.backgroundPanel,
        },
        headerTintColor: Colors.textPrimary,
      }}
    >
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BasicResourcesScreen"
        component={BasicResourcesScreen}
        options={{ title: "Basic Resources" }}
      />
      <Stack.Screen
        name="BuildScreen"
        component={BuildScreen}
        options={{ title: "Build Machines" }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: "World Map" }}
      />
      <Stack.Screen
        name="InventoryScreen"
        component={InventoryScreen}
        options={{ title: "Inventory" }}
      />
      <Stack.Screen
        name="ProductAssemblyScreen"
        component={ProductAssemblyScreen}
        options={{ title: "Product Assembly" }}
      />
      <Stack.Screen
        name="DeployedMachinesScreen"
        component={DeployedMachinesScreen}
        options={{ title: "Deployed Machines" }}
      />
      <Stack.Screen
        name="MilestonesScreen"
        component={MilestonesScreen}
        options={{ title: "Milestones" }}
      />
    </Stack.Navigator>
  );
}
