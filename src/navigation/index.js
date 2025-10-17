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
import ConstructorScreen from "../screens/ConstructorScreen/ConstructorScreen";
import SmelterScreen from "../screens/SmelterScreen/SmelterScreen";
import NodeSelectorScreen from "../screens/NodeSelectorScreen/NodeSelectorScreen";
import Colors from "../constants/Colors";
import FoundryScreen from "../screens/FoundryScreen/FoundryScreen";
import AssemblerScreen from "../screens/AssemblerScreen/AssemblerScreen";
import RefineryScreen from "../screens/RefineryScreen/RefineryScreen";
import ManufacturerScreen from "../screens/ManufacturerScreen/ManufacturerScreen";
import OilExtractorScreen from "../screens/OilExtractorScreen/OilExtractorScreen";
import OptionsScreen from "../screens/OptionsScreen/OptionsScreen";

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
        headerShown: false, // Disable all headers to use CustomHeader instead
      }}
    >
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="BasicResourcesScreen"
        component={BasicResourcesScreen}
      />
      <Stack.Screen name="BuildScreen" component={BuildScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
      <Stack.Screen
        name="ProductAssemblyScreen"
        component={ProductAssemblyScreen}
      />
      <Stack.Screen
        name="DeployedMachinesScreen"
        component={DeployedMachinesScreen}
      />
      <Stack.Screen name="MilestonesScreen" component={MilestonesScreen} />
      <Stack.Screen name="ConstructorScreen" component={ConstructorScreen} />
      <Stack.Screen name="SmelterScreen" component={SmelterScreen} />
      <Stack.Screen name="NodeSelectorScreen" component={NodeSelectorScreen} />
      <Stack.Screen name="FoundryScreen" component={FoundryScreen} />
      <Stack.Screen name="AssemblerScreen" component={AssemblerScreen} />
      <Stack.Screen name="RefineryScreen" component={RefineryScreen} />
      <Stack.Screen name="ManufacturerScreen" component={ManufacturerScreen} />
      <Stack.Screen name="OilExtractorScreen" component={OilExtractorScreen} />
      <Stack.Screen name="OptionsScreen" component={OptionsScreen} />
    </Stack.Navigator>
  );
}
