import { View, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, CustomHeader } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { useNavigation } from "@react-navigation/native";
import { MinerCard, ExtractorCard, SmelterCard, ConstructorCard, DefaultMachineCard, FoundryCard, AssemblerCard, RefineryCard, ManufacturerCard } from "./components/MachineCards";
import MachineGroup from "./components/MachineGroup";
import { GameAssets } from "../../components/AppLoader";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Map machine types to their dedicated card components
const machineCardComponents = {
  miner: MinerCard,
  smelter: SmelterCard,
  constructor: ConstructorCard,
  assembler: AssemblerCard,
  foundry: FoundryCard,
  manufacturer: ManufacturerCard,
  refinery: RefineryCard,
  extractor: ExtractorCard,
};

const DeployedMachinesScreen = () => {
  const {
    placedMachines,
    ownedMachines,
  } = useGame();
  const navigation = useNavigation();

  const allMachines = [
    ...((placedMachines || []).filter(Boolean)),
    ...((ownedMachines || []).filter((m) => !(placedMachines || []).filter(Boolean).some((p) => p.id === m.id))),
  ];

  // Group all machines by type
  const machinesByType = (allMachines || []).filter(Boolean).reduce((acc, machine) => {
    const typeName = items[machine.type]?.name || machine.type;
    if (!acc[typeName]) acc[typeName] = [];
    acc[typeName].push(machine);
    return acc;
  }, {});

  // Get available machine types (tabs)
  const availableMachineTypes = ["All", ...Object.keys(machinesByType)];
  const [activeTab, setActiveTab] = useState("All");

  // Get machines for current tab
  const currentTabMachines = activeTab === "All" 
    ? (allMachines || []).filter(Boolean)
    : (machinesByType[activeTab] || []).filter(Boolean);

  // Get machine type icon from GameAssets
  const getMachineTypeIcon = (typeName) => {
    if (typeName === "All") {
      return null;
    }
    
    const iconMap = {
      'Miner': 'miner',
      'Smelter': 'smelter', 
      'Constructor': 'constructor',
      'Assembler': 'assembler',
      'Foundry': 'foundry',
      'Manufacturer': 'manufacturer',
      'Refinery': 'refinery',
      'Extractor': 'extractor'
    };
    
    const iconKey = iconMap[typeName];
    if (iconKey && GameAssets.icons[iconKey]) {
      return (
        <Image 
          source={GameAssets.icons[iconKey]} 
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      );
    }
    
    return <MaterialCommunityIcons name="cog" size={24} color="#00ffff" />;
  };

  // Render the appropriate card component for each machine type
  const renderMachineCard = (machine) => {
    const CardComponent = machineCardComponents[machine.type] || DefaultMachineCard;
    return (
      <CardComponent
        key={machine.id}
        machine={machine}
        navigation={navigation}
      />
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader 
        title="Deployed Machines"
        rightIcon="plus-circle"
        onRightIconPress={() => navigation.navigate("BuildScreen")}
      />
      
      <ImageBackground
        source={require("../../../assets/images/backgrounds/background.png")}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        {/* Machine Type Tabs */}
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.6)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.filterTabsContainer}
        >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {availableMachineTypes.map((machineType) => {
            const icon = getMachineTypeIcon(machineType);
            const isActive = activeTab === machineType;
            
            return (
              <TouchableOpacity
                key={machineType}
                onPress={() => setActiveTab(machineType)}
              >
                {isActive ? (
                  <LinearGradient
                    colors={["#00ffff", "#ff00cc"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.machineTabGradient}
                  >
                    <View style={[styles.machineTab, styles.machineTabActive]}>
                      {icon && (
                        <View style={styles.machineTabIcon}>
                          {icon}
                        </View>
                      )}
                      <Text style={[styles.machineTabText, styles.machineTabTextActive]}>
                        {machineType}
                      </Text>
                      <Text style={[styles.machineTabCount, styles.machineTabCountActive]}>
                        ({machineType === "All" ? allMachines.length : (machinesByType[machineType]?.length || 0)})
                      </Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.machineTab}>
                    {icon && (
                      <View style={styles.machineTabIcon}>
                        {icon}
                      </View>
                    )}
                    <Text style={styles.machineTabText}>
                      {machineType}
                    </Text>
                    <Text style={styles.machineTabCount}>
                      ({machineType === "All" ? allMachines.length : (machinesByType[machineType]?.length || 0)})
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {currentTabMachines.length > 0 ? (
          <MachineGroup key={activeTab} typeName={activeTab}>
            {currentTabMachines.filter(Boolean).map((machine) => {
              if (!machine || !machine.id) return null;
              return renderMachineCard(machine);
            })}
          </MachineGroup>
        ) : (
          <Text style={styles.emptyStateText}>
            {activeTab === "All" 
              ? "No machines deployed or owned yet."
              : `No ${activeTab} machines found.`
            }
          </Text>
        )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default DeployedMachinesScreen;
