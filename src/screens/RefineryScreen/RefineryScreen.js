import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import useCrafting from "../../hooks/useCrafting";
import { GameAssets } from "../../components/AppLoader";

// Component imports
import CraftingProgress from "../DeployedMachinesScreen/components/MachineTypes/Constructor/components/CraftingProgress";
import ResourceList from "../DeployedMachinesScreen/components/MachineTypes/Constructor/components/ResourceList";
import CraftButton from "../DeployedMachinesScreen/components/MachineTypes/Constructor/components/CraftButton";
import MiniToast from "../DeployedMachinesScreen/components/MachineTypes/Constructor/components/MiniToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, CustomHeader, QuantitySlider } from "../../components";

// Helpers to normalize inputs/outputs to arrays of {item, amount}
function normalizeInputs(inputs) {
  if (!inputs) return [];
  if (Array.isArray(inputs)) return inputs;
  if (typeof inputs === "object") {
    return Object.entries(inputs).map(([item, amount]) => ({ item, amount }));
  }
  return [];
}
function normalizeOutputs(outputs) {
  if (!outputs) return [];
  if (Array.isArray(outputs)) return outputs;
  if (typeof outputs === "object") {
    return Object.entries(outputs).map(([item, amount]) => ({ item, amount }));
  }
  return [];
}

const RefineryScreen = ({ route, navigation }) => {
  // Get machine from route params (if passed from deployed machines)
  const machine = route?.params?.machine || null;
  const recipe = route?.params?.recipe || null;

  const {
    inventory,
    ownedMachines: contextOwnedMachines,
    addResource,
    removeResources,
    canAfford,
    addToCraftingQueue,
    craftingQueue,
  } = useGame();

  const ownedMachines = useMemo(
    () => (contextOwnedMachines || []).map((m) => m.type),
    [contextOwnedMachines]
  );

  const { craftItem } = useCrafting(
    inventory,
    ownedMachines,
    addResource,
    removeResources,
    canAfford
  );

  // Get refinery recipes
  const availableRecipes = useMemo(() => {
    return Object.values(items)
      .filter((item) => item.machine === "refinery")
      .map((item) => ({
        id: item.id,
        name: item.name,
        machine: item.machine,
        inputs: normalizeInputs(item.inputs),
        outputs: normalizeOutputs(item.output || item.outputs),
        processingTime: item.processingTime,
      }));
  }, []);

  const [selectedRecipeId, setSelectedRecipeId] = useState(
    recipe?.id || machine?.currentRecipeId || availableRecipes[0]?.id || null
  );

  const selectedRecipe = useMemo(() => {
    const found = availableRecipes.find((r) => r.id === selectedRecipeId);
    if (!found) return null;
    return {
      ...found,
      machine: found.machine,
      inputs: normalizeInputs(found.inputs),
      outputs: normalizeOutputs(found.outputs),
    };
  }, [availableRecipes, selectedRecipeId]);

  const [productAmount, setProductAmount] = useState("1");

  // Mini toast state
  const [miniToastVisible, setMiniToastVisible] = useState(false);
  const [miniToastMsg, setMiniToastMsg] = useState("");
  const miniToastTimeout = useRef(null);
  const showMiniToast = (msg) => {
    setMiniToastMsg(msg);
    setMiniToastVisible(true);
    if (miniToastTimeout.current) clearTimeout(miniToastTimeout.current);
    miniToastTimeout.current = setTimeout(
      () => setMiniToastVisible(false),
      700
    );
  };

  // UI state
  const [activeCraftButton, setActiveCraftButton] = useState("1");
  const [activeTab, setActiveTab] = useState("recipe");

  // Check for active crafting processes for this machine - memoized
  const machineProcesses = useMemo(() => {
    if (!machine) return [];
    return craftingQueue.filter(
      (proc) => proc.machineId === machine.id && proc.status === "pending"
    );
  }, [craftingQueue, machine]);

  const isProcessing = useMemo(() => machineProcesses.length > 0, [machineProcesses]);

  // Crafting logic using global craftingQueue
  const startCrafting = useCallback(async (amountToCraft, isMax = false) => {
    if (!selectedRecipe) return;
    const totalAmount = Number(amountToCraft) || 1;

    // Check if we can afford the inputs
    const canAffordAll = selectedRecipe.inputs.every((input) => {
      const available = inventory[input.item]?.currentAmount || 0;
      return available >= input.amount * totalAmount;
    });

    if (!canAffordAll) {
      showMiniToast("Insufficient resources!");
      return;
    }

    // Deduct resources immediately
    const deductionData = {};
    selectedRecipe.inputs.forEach((input) => {
      deductionData[input.item] = input.amount * totalAmount;
    });
    
    const success = removeResources(deductionData);
    if (!success) {
      showMiniToast("Failed to deduct resources!");
      return;
    }

    // Add to global crafting queue
    addToCraftingQueue({
      machineId: machine?.id || 'manual-refinery',
      recipeId: selectedRecipe.id,
      amount: totalAmount,
      processingTime: selectedRecipe.processingTime,
      itemName: selectedRecipe.name,
    });

    showMiniToast(`Added ${totalAmount}x ${selectedRecipe.name} to queue`);
    
    // Reset UI state
    if (activeCraftButton === "max") {
      setActiveCraftButton("1");
      setProductAmount("1");
    }

    // Navigate back if from a machine
    if (machine) {
      navigation.goBack();
    }
  }, [selectedRecipe, inventory, removeResources, addToCraftingQueue, machine, activeCraftButton, setActiveCraftButton, setProductAmount, navigation, showMiniToast]);

  // Memoize expensive calculations
  const maxCraftable = useMemo(() => {
    if (!selectedRecipe) return 0;
    let maxCraftable = Infinity;
    selectedRecipe.inputs.forEach((input) => {
      const inv = inventory[input.item]?.currentAmount || 0;
      const possible = input.amount > 0 ? Math.floor(inv / input.amount) : 0;
      if (possible < maxCraftable) maxCraftable = possible;
    });
    return maxCraftable === Infinity ? 0 : maxCraftable;
  }, [selectedRecipe, inventory]);

  const amount = useMemo(() => Math.max(1, parseInt(productAmount) || 1), [productAmount]);
  const canCraft = useMemo(() => amount > 0 && amount <= maxCraftable, [amount, maxCraftable]);
  const processingTime = useMemo(() => Number(selectedRecipe?.processingTime) || 1, [selectedRecipe]);

  useEffect(() => {
    setActiveCraftButton("1");
    setProductAmount("1");
  }, [selectedRecipeId]);

  const handleAssignRecipe = useCallback(() => {
    if (selectedRecipeId && machine) {
      // Here you would update the machine's recipe in your game state
      // onSelectRecipe(selectedRecipeId);
      navigation.goBack();
    }
  }, [selectedRecipeId, machine, navigation]);

  // Optimize tab handlers
  const handleRecipeTab = useCallback(() => setActiveTab("recipe"), []);
  const handleProductionTab = useCallback(() => setActiveTab("production"), []);

  // Optimize quantity button handlers
  const handleSet1 = useCallback(() => {
    setProductAmount("1");
    setActiveCraftButton("1");
  }, []);

  const handleSet5 = useCallback(() => {
    setProductAmount("5");
    setActiveCraftButton("5");
  }, []);

  const handleSetMax = useCallback(() => {
    setProductAmount(String(maxCraftable));
    setActiveCraftButton("max");
  }, [maxCraftable]);

  // Optimize start crafting handler
  const handleStartCrafting = useCallback(() => {
    startCrafting(amount);
  }, [startCrafting, amount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader 
        title="Refinery"
        rightIcon="flask"
        onRightIconPress={() => console.log("Refinery tools pressed")}
      />
      <View style={styles.container}>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "recipe" && styles.activeTabButton
            ]}
            onPress={handleRecipeTab}
          >
            <MaterialCommunityIcons
              name="book-open-variant"
              size={18}
              color={activeTab === "recipe" ? "#e8f4fd" : "#b8c7d1"}
            />
            <Text style={[
              styles.tabButtonText,
              activeTab === "recipe" && styles.activeTabButtonText
            ]}>
              Recipe
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "production" && styles.activeTabButton
            ]}
            onPress={handleProductionTab}
          >
            <MaterialCommunityIcons
              name="flask"
              size={18}
              color={activeTab === "production" ? "#e8f4fd" : "#b8c7d1"}
            />
            <Text style={[
              styles.tabButtonText,
              activeTab === "production" && styles.activeTabButtonText
            ]}>
              Production
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {activeTab === "recipe" ? (
            // RECIPE TAB - Simple FlatList
            <View style={styles.recipeTab}>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Available Recipes</Text>
              </View>
              <FlatList
                data={availableRecipes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                style={styles.recipeList}
                contentContainerStyle={styles.recipeListContent}
                renderItem={({ item: recipeItem }) => (
                  <TouchableOpacity
                    style={[
                      styles.recipeCard,
                      selectedRecipeId === recipeItem.id && styles.selectedRecipeCard,
                    ]}
                    onPress={() => setSelectedRecipeId(recipeItem.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.recipeCardHeader}>
                      <View style={styles.recipeIconContainer}>
                        {items[recipeItem.id] && items[recipeItem.id].iconName ? (
                          <Image 
                            source={GameAssets.icons[items[recipeItem.id].iconName]} 
                            style={styles.recipeItemIcon}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="flask"
                            size={24}
                            color={selectedRecipeId === recipeItem.id ? "#e8f4fd" : "#b8c7d1"}
                          />
                        )}
                      </View>
                      <View style={styles.recipeInfo}>
                        <Text style={[
                          styles.recipeCardTitle,
                          selectedRecipeId === recipeItem.id && styles.selectedRecipeCardTitle
                        ]}>
                          {recipeItem.name}
                        </Text>
                        <Text style={styles.recipeCardTime}>
                          {recipeItem.processingTime}s processing time
                        </Text>
                      </View>
                      {selectedRecipeId === recipeItem.id && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#4CAF50"
                        />
                      )}
                    </View>
                    
                    {/* Recipe Details */}
                    <View style={styles.recipeDetails}>
                      <View style={styles.recipeInputsOutputs}>
                        <View style={styles.recipeInputs}>
                          <Text style={styles.recipeDetailLabel}>Inputs:</Text>
                          {recipeItem.inputs.map((input, idx) => (
                            <Text key={idx} style={styles.recipeDetailText}>
                              {input.amount}x {items[input.item]?.name || input.item}
                            </Text>
                          ))}
                        </View>
                        <MaterialCommunityIcons
                          name="arrow-right"
                          size={16}
                          color="#6db4f0"
                          style={styles.arrowIcon}
                        />
                        <View style={styles.recipeOutputs}>
                          <Text style={styles.recipeDetailLabel}>Outputs:</Text>
                          {recipeItem.outputs.map((output, idx) => (
                            <Text key={idx} style={styles.recipeDetailText}>
                              {output.amount}x {items[output.item]?.name || output.item}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : (
            // PRODUCTION TAB
            <ScrollView 
              style={styles.productionTab} 
              showsVerticalScrollIndicator={false}
            >
              {/* Main Production Area */}
              <View style={styles.productionMainArea}>
                
                {/* Input/Output Flow Section */}
                {selectedRecipe && (
                  <View style={styles.flowSection}>
                    {/* Input Side */}
                    <View style={styles.inputSection}>
                      <View style={styles.flowLabel}>
                        <Text style={styles.flowLabelText}>INPUT</Text>
                      </View>
                      <View style={styles.inputSlots}>
                        {selectedRecipe.inputs.map((input, index) => {
                          const requiredAmount = input.amount * amount;
                          const currentAmount = inventory[input.item]?.currentAmount || 0;
                          const hasEnough = currentAmount >= requiredAmount;
                          const itemName = items[input.item]?.name || input.item;
                          
                          return (
                            <View key={input.item} style={styles.resourceSlot}>
                              <View style={[
                                styles.slotIcon,
                                { backgroundColor: hasEnough ? "rgba(74, 127, 167, 0.3)" : "rgba(167, 74, 74, 0.3)" }
                              ]}>
                                {items[input.item] && items[input.item].iconName ? (
                                  <Image 
                                    source={GameAssets.icons[items[input.item].iconName]} 
                                    style={styles.slotItemIcon}
                                  />
                                ) : (
                                  <MaterialCommunityIcons
                                    name="cube-outline"
                                    size={20}
                                    color="#e8f4fd"
                                  />
                                )}
                              </View>
                              <Text style={styles.slotAmount}>{requiredAmount}</Text>
                              <Text style={styles.slotName}>{itemName}</Text>
                              <Text style={[
                                styles.slotInventory,
                                { color: hasEnough ? "#4CAF50" : "#ff6b6b" }
                              ]}>
                                {currentAmount}/{requiredAmount}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    {/* Arrow */}
                    <View style={styles.arrowSection}>
                      <MaterialCommunityIcons
                        name="arrow-right"
                        size={32}
                        color="#6db4f0"
                      />
                    </View>

                    {/* Output Side */}
                    <View style={styles.outputSection}>
                      <View style={styles.flowLabel}>
                        <Text style={styles.flowLabelText}>OUTPUT</Text>
                      </View>
                      <View style={styles.outputSlots}>
                        {selectedRecipe.outputs.map((output, index) => {
                          const outputAmount = output.amount * amount;
                          const itemName = items[output.item]?.name || output.item;
                          const currentInventory = inventory[output.item]?.currentAmount || 0;
                          
                          return (
                            <View key={output.item} style={styles.resourceSlot}>
                              <View style={[
                                styles.slotIcon,
                                { backgroundColor: "rgba(74, 127, 167, 0.3)" }
                              ]}>
                                {items[output.item] && items[output.item].iconName ? (
                                  <Image 
                                    source={GameAssets.icons[items[output.item].iconName]} 
                                    style={styles.slotItemIcon}
                                  />
                                ) : (
                                  <MaterialCommunityIcons
                                    name="flask-outline"
                                    size={20}
                                    color="#e8f4fd"
                                  />
                                )}
                              </View>
                              <Text style={styles.slotAmount}>{outputAmount}</Text>
                              <Text style={styles.slotName}>{itemName}</Text>
                              <Text style={styles.slotInventory}>
                                Current: {currentInventory}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                )}

                {/* Machine Status & Recipe Info */}
                {selectedRecipe && (
                  <View style={styles.machineStatusSection}>
                    <View style={styles.machineInfoCard}>
                      <View style={styles.machineHeader}>
                        <View style={styles.machineIcon}>
                          {items[selectedRecipe.id] && items[selectedRecipe.id].iconName ? (
                            <Image 
                              source={GameAssets.icons[items[selectedRecipe.id].iconName]} 
                              style={styles.machineItemIcon}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="flask"
                              size={28}
                              color="#6db4f0"
                            />
                          )}
                        </View>
                        <View style={styles.machineInfo}>
                          <Text style={styles.machineTitle}>Refinery</Text>
                          <Text style={styles.recipeTitle}>{selectedRecipe.name}</Text>
                        </View>
                        <View style={styles.machineStatus}>
                          <View style={[
                            styles.statusIndicator,
                            { backgroundColor: isProcessing ? "#4CAF50" : "#6db4f0" }
                          ]} />
                          <Text style={styles.statusText}>
                            {isProcessing ? "Processing" : "Ready"}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.productionStats}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Processing Time</Text>
                          <Text style={styles.statValue}>{processingTime}s</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Max Craftable</Text>
                          <Text style={styles.statValue}>{maxCraftable}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Time</Text>
                          <Text style={styles.statValue}>{processingTime * amount}s</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {/* Progress Display */}
                {isProcessing && (
                  <View style={styles.progressSection}>
                    <CraftingProgress
                      isProcessing={isProcessing}
                      machineProcesses={machineProcesses}
                      maxCraftable={maxCraftable}
                    />
                  </View>
                )}

                {/* Production Controls */}
                {selectedRecipe && (
                  <View style={styles.controlsSection}>
                    <View style={styles.quantityControls}>
                      <Text style={styles.controlLabel}>Production Quantity</Text>
                      <QuantitySlider
                        value={productAmount}
                        onChange={setProductAmount}
                        min={1}
                        max={maxCraftable}
                        accentColor="#9C27B0"
                        disabled={isProcessing}
                      />
                      
                      <View style={styles.quickButtons}>
                        <CraftButton
                          isActive={activeCraftButton === "1"}
                          label="1x"
                          onPress={handleSet1}
                          disabled={!!isProcessing}
                        />
                        <CraftButton
                          isActive={activeCraftButton === "5"}
                          label="5x"
                          onPress={handleSet5}
                          disabled={!!isProcessing || maxCraftable < 5}
                        />
                        <CraftButton
                          isActive={activeCraftButton === "max"}
                          label={`Max (${maxCraftable})`}
                          onPress={handleSetMax}
                          disabled={!!isProcessing || maxCraftable <= 0}
                        />
                      </View>
                    </View>

                    {/* Start Production Button */}
                    <TouchableOpacity
                      style={[
                        styles.startProductionButton,
                        (!canCraft || !!isProcessing) && styles.startProductionButtonDisabled,
                      ]}
                      onPress={handleStartCrafting}
                      disabled={!canCraft || !!isProcessing}
                      activeOpacity={0.85}
                    >
                      <MaterialCommunityIcons
                        name={isProcessing ? "cog" : "play-circle"}
                        size={24}
                        color={canCraft && !isProcessing ? "#e8f4fd" : "#6b7885"}
                      />
                      <Text
                        style={[
                          styles.startProductionButtonText,
                          (!canCraft || !!isProcessing) && styles.startProductionButtonTextDisabled,
                        ]}
                      >
                        {isProcessing ? "Processing..." : `Start Refining (${amount}x)`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
        
        <MiniToast visible={miniToastVisible} message={miniToastMsg} />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(RefineryScreen);