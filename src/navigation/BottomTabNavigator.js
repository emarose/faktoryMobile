import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Colors from "../constants/Colors";

import FactoryScreen from "../screens/FactoryScreen/FactoryScreen";
import MapScreen from "../screens/MapScreen/MapScreen";
import DeployedMachinesScreen from "../screens/DeployedMachinesScreen/DeployedMachinesScreen";
import BuildScreen from "../screens/BuildScreen/BuildScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  function TabBarIcon(props) {
    return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
  }

  return (
    <BottomTab.Navigator
      initialRouteName="Factory"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accentGreen,
        tabBarInactiveTintColor: Colors.textPrimary,
        tabBarStyle: {
          backgroundColor: Colors.backgroundPanel,
          paddingVertical: 10,
          height: 70,
        },
        tabBarLabelStyle: { fontSize: 12, paddingBottom: 8 },
      }}
    >
      <BottomTab.Screen
        name="WorldMap"
        component={MapScreen}
        options={{
          title: "World Map",
          tabBarLabel: "World",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map-outline" color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Factory"
        component={FactoryScreen}
        options={{
          title: "Factory",
          tabBarLabel: "Factory",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="factory" color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Builder"
        component={BuildScreen}
        options={{
          title: "Builder",
          tabBarLabel: "Builder",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="hammer" color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Machines"
        component={DeployedMachinesScreen}
        options={{
          title: "Machines",
          tabBarLabel: "Machines",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="robot-industrial" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
