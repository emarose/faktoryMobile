import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/Colors";

import FactoryScreen from "../screens/FactoryScreen/FactoryScreen";
import { Text } from "../components";
import { GameAssets } from "../components/AppLoader";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const navigation = useNavigation();

  function TabBarIcon({ iconSource, label, size = 36, focused, onPress }) {
    const handlePress = () => {
      if (onPress) onPress();
    };

    if (focused) {
      return (
        <TouchableOpacity onPress={handlePress} style={{ alignItems: "center", gap: 6 }}>
          <LinearGradient
            colors={["#00ffff", "#ff00cc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 29,
              padding: 2,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                borderRadius: 27,
                padding: 13,
                justifyContent: "center",
                alignItems: "center",
                width: 62,
                height: 62,
              }}
            >
              <Image
                source={iconSource}
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
          <Text
            style={{
              color: "#00ffff",
              fontSize: 10,
              fontWeight: "700",
              textShadowColor: "rgba(0, 0, 0, 0.8)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
              textAlign: "center",
              maxWidth: 70,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={handlePress} style={{ alignItems: "center", gap: 6 }}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: 27,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.15)",
            padding: 13,
            justifyContent: "center",
            alignItems: "center",
            width: 62,
            height: 62,
          }}
        >
          <Image
            source={iconSource}
            style={{ width: size, height: size, opacity: 0.6 }}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 10,
            fontWeight: "700",
            textShadowColor: "rgba(0, 0, 0, 0.8)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
            textAlign: "center",
            maxWidth: 70,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <BottomTab.Navigator
      initialRouteName="Factory"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00ffff",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.4)",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 95,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.9)", "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="WorldMap"
        component={FactoryScreen}
        options={{
          title: "World Map",
          tabBarButton: () => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <TabBarIcon 
                iconSource={GameAssets.icons.tabMap} 
                label="Map" 
                focused={false}
                onPress={() => navigation.navigate('MapScreen')}
              />
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="Builder"
        component={FactoryScreen}
        options={{
          title: "Builder",
          tabBarButton: () => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <TabBarIcon 
                iconSource={GameAssets.icons.tabBuilder} 
                label="Builder" 
                focused={false}
                onPress={() => navigation.navigate('BuildScreen')}
              />
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="Factory"
        component={FactoryScreen}
        options={{
          title: "Factory",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconSource={GameAssets.icons.tabFactory} label="Factory" size={36} focused={focused} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Machines"
        component={FactoryScreen}
        options={{
          title: "Machines",
          tabBarButton: () => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <TabBarIcon 
                iconSource={GameAssets.icons.tabMachines} 
                label="Machines" 
                focused={false}
                onPress={() => navigation.navigate('DeployedMachinesScreen')}
              />
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="Options"
        component={FactoryScreen}
        options={{
          title: "Options",
          tabBarButton: () => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <TabBarIcon 
                iconSource={GameAssets.icons.tabSettings} 
                label="Options" 
                focused={false}
                onPress={() => navigation.navigate('OptionsScreen')}
              />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
