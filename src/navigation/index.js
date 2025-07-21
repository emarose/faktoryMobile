import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import BuildScreen from "../screens/build/BuildScreen";
import MapScreen from "../screens/map/MapScreen";
import BasicResourcesScreen from "../screens/basicResources/BasicResourcesScreen";
import InventoryScreen from "../screens/inventory/inventoryScreen";
import ProductAssemblyScreen from "../screens/assembly/ProductAssemblyScreen";

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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="BasicResourcesScreen"
        component={BasicResourcesScreen}
      />
      <Stack.Screen name="BuildScreen" component={BuildScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
      <Stack.Screen name="ProductAssemblyScreen" component={ProductAssemblyScreen} />
    </Stack.Navigator>
  );
}
