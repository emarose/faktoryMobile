import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Colors from "../constants/Colors";

import FactoryScreen from "../screens/FactoryScreen/FactoryScreen";
import MapScreen from "../screens/MapScreen/MapScreen";
import DeployedMachinesScreen from "../screens/DeployedMachinesScreen/DeployedMachinesScreen";
import BuildScreen from "../screens/BuildScreen/BuildScreen";
import OptionsScreen from "../screens/OptionsScreen/OptionsScreen";
import { Text } from "../components";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  function TabBarIcon({ name, color, size = 30 }) {
    return (
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color}
        style={{ marginBottom: -3 }}
      />
    );
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
          height: 78,
        },
        tabBarLabelStyle: { fontSize: 12, paddingBottom: 8 },
      }}
    >
      {/* Order chosen so Factory is in the center */}
      <BottomTab.Screen
        name="WorldMap"
        component={MapScreen}
        options={{
          title: "World Map",
          tabBarLabel: () => (
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: 12,
                paddingBottom: 8,
              }}
            >
              Map
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map-outline" color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Builder"
        component={BuildScreen}
        options={{
          title: "Builder",
          tabBarLabel: () => (
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: 12,
                paddingBottom: 8,
              }}
            >
              Builder
            </Text>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="hammer" color={color} />,
        }}
      />

      <BottomTab.Screen
        name="Factory"
        component={FactoryScreen}
        options={{
          title: "Factory",
          tabBarLabel: () => (
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: 12,
                paddingBottom: 8,
              }}
            >
              Factory
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            // Factory gets a slightly larger icon when focused (center emphasis)
            <TabBarIcon name="factory" color={color} size={focused ? 40 : 34} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Machines"
        component={DeployedMachinesScreen}
        options={{
          title: "Machines",
          tabBarLabel: () => (
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: 12,
                paddingBottom: 8,
              }}
            >
              Machines
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="robot-industrial" color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Options"
        component={OptionsScreen}
        options={{
          title: "Options",
          tabBarLabel: () => (
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: 12,
                paddingBottom: 8,
              }}
            >
              Options
            </Text>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
