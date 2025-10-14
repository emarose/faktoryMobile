import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, CustomHeader } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { useNavigation } from "@react-navigation/native";
import { MinerCard, SmelterCard, ConstructorCard, DefaultMachineCard, FoundryCard } from "./components/MachineCards";
import MachineGroup from "./components/MachineGroup";

// Map machine types to their dedicated card components
const machineCardComponents = {
  miner: MinerCard,
  smelter: SmelterCard,
  constructor: ConstructorCard,
  assembler: DefaultMachineCard, // Will use default until specific card is created
  foundry: FoundryCard,
  manufacturer: DefaultMachineCard,
  refinery: DefaultMachineCard,
  oilExtractor: MinerCard, // Oil extractor can use the same logic as miner
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

  // Machine type icons
  const getMachineTypeIcon = (typeName) => {
    if (typeName === "All") return '🏭';
    const icons = {
      'Miner': '⛏️',
      'Smelter': '🔥', 
      'Constructor': '🔧',
      'Assembler': '⚙️',
      'Foundry': '🏭',
      'Manufacturer': '🏗️',
      'Refinery': '⚗️',
      'Oil Extractor': '🛢️'
    };
    return icons[typeName] || '🔧';
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
      
      {/* Machine Type Tabs */}
      <View style={styles.filterTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {availableMachineTypes.map((machineType) => (
            <TouchableOpacity
              key={machineType}
              style={[
                styles.machineTab,
                activeTab === machineType && styles.machineTabActive
              ]}
              onPress={() => setActiveTab(machineType)}
            >
              <Text style={styles.machineTabIcon}>
                {getMachineTypeIcon(machineType)}
              </Text>
              <Text style={[
                styles.machineTabText,
                activeTab === machineType && styles.machineTabTextActive
              ]}>
                {machineType}
              </Text>
              <Text style={[
                styles.machineTabCount,
                activeTab === machineType && styles.machineTabCountActive
              ]}>
                ({machineType === "All" ? allMachines.length : (machinesByType[machineType]?.length || 0)})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
    </SafeAreaView>
  );
};

export default DeployedMachinesScreen;
