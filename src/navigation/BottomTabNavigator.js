import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";

import Colors from "../constants/Colors";

import FactoryScreen from "../screens/FactoryScreen/FactoryScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Factory"
      screenOptions={{ tabBarActiveTintColor: Colors.background}}
    >
      <BottomTab.Screen
        name="Production"
        component={FactoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="analytics" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Factory"
        component={FactoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Machinery"
        component={FactoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cog" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const TabOneStack = createStackNavigator();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Production"
        component={FactoryScreen}
        options={{ headerTitle: "Production" }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="Machinery"
        component={FactoryScreen}
        options={{ headerTitle: "Machinery" }}
      />
    </TabTwoStack.Navigator>
  );
}
