import React, { useState } from "react";
import { View, TouchableOpacity, Dimensions, Modal, FlatList, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, IconContainer } from "../../../../components";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { items } from "../../../../data/items";
import Colors from "../../../../constants/Colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = 400;

const InventoryBottomSheet = ({
  isVisible,
  inventory,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const [selectedFilter, setSelectedFilter] = useState('all');

  React.useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT - insets.bottom, {
        damping: 20,
        stiffness: 300,
      });
      backdropOpacity.value = withTiming(0.5, { duration: 300 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible]);

  const handleClose = () => {
    onClose();
  };

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Convert inventory object to array with item data, filter out machines, sort by type
  const inventoryItems = Object.entries(inventory || {})
    .map(([itemId, itemObject]) => {
      const itemData = items[itemId] || {};
      const count = itemObject?.currentAmount || 0;
      return {
        id: itemId,
        name: itemData.name || itemId,
        count,
        type: itemData.type || 'unknown',
        color: itemData.color || Colors.textMuted,
        ...itemData
      };
    })
    .filter(item => item.count > 0 && item.type !== 'machine') // Filter out machines
    .sort((a, b) => {
      // Sort by type priority (rawMaterial first), then by name
      const typeOrder = { 'rawMaterial': 1, 'intermediateProduct': 2, 'component': 3, 'product': 4 };
      const aOrder = typeOrder[a.type] || 99;
      const bOrder = typeOrder[b.type] || 99;
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.name.localeCompare(b.name);
    });

  // Get available types for filter
  const availableTypes = ['all', ...new Set(inventoryItems.map(item => item.type))];
  
  // Filter items based on selected filter
  const filteredItems = selectedFilter === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.type === selectedFilter);

  // Format type names for display
  const formatTypeName = (type) => {
    if (type === 'all') return 'All Materials';
    return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Render function for FlatList items
  const renderInventoryItem = ({ item }) => (
    <View
      style={{
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        flex: 1,
        margin: 3,
        minHeight: 80,
        position: 'relative',
      }}
    >
      {/* Quantity Badge */}
      <View style={{
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: Colors.accentGold,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.backgroundPanel,
        zIndex: 1,
      }}>
        <Text style={{
          fontSize: 10,
          color: Colors.background,
          fontWeight: 'bold',
        }}>
          {item.count >= 1000 ? `${(item.count/1000).toFixed(1)}k` : item.count}
        </Text>
      </View>

      {/* Icon */}
      <IconContainer
        iconId={item.id}
        size={40}
        iconSize={30}
        style={{
          backgroundColor: 'transparent',
          borderWidth: 0,
          marginBottom: 6,
        }}
      />
      
      {/* Item Name */}
      <Text style={{
        fontSize: 11,
        color: Colors.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
        numberOfLines: 2,
        lineHeight: 14,
      }}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <Modal transparent visible={isVisible} animationType="none">
      {/* Backdrop */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
          },
          animatedBackdropStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            height: BOTTOM_SHEET_HEIGHT + insets.bottom,
            backgroundColor: Colors.backgroundPanel,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom,
          },
          animatedSheetStyle,
        ]}
      >
        {/* Handle */}
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: Colors.borderLight,
            borderRadius: 2,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="bag-personal"
                size={24}
                color={Colors.accentGold}
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.textPrimary }}>
                Inventory
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 8, marginLeft:8 }}>
              {filteredItems.length} materials available
            </Text>
          </View>

          <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
            <Icon name="close" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Compact Filter Badges */}
        {inventoryItems.length > 0 && availableTypes.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ 
              marginBottom: 8,
              maxHeight: 32,
              flexGrow: 0,
            }}
            contentContainerStyle={{ 
              paddingHorizontal: 2,
              alignItems: 'center',
              minHeight: 32,
            }}
          >
            {availableTypes.map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedFilter(type)}
                style={[
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 14,
                    borderWidth: 1,
                    marginRight: 6,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  selectedFilter === type ? {
                    backgroundColor: Colors.accentGold,
                    borderColor: Colors.accentGold,
                  } : {
                    backgroundColor: 'transparent',
                    borderColor: Colors.borderLight,
                  }
                ]}
              >
                <Text style={{
                  fontSize: 11,
                  fontWeight: selectedFilter === type ? "700" : "500",
                  color: selectedFilter === type ? Colors.background : Colors.textSecondary,
                  textAlign: 'center',
                  includeFontPadding: false,
                }}>
                  {formatTypeName(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Inventory List */}
        {filteredItems.length === 0 && inventoryItems.length > 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 40 }}>
            <Icon name="filter-variant" size={48} color={Colors.textMuted} style={{ opacity: 0.5, marginBottom: 12 }} />
            <Text style={{ fontSize: 16, color: Colors.textMuted, textAlign: "center" }}>
              No {formatTypeName(selectedFilter).toLowerCase()}
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textMuted, textAlign: "center", marginTop: 4 }}>
              Try selecting a different filter
            </Text>
          </View>
        ) : inventoryItems.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 }}>
            <Icon name="package-variant" size={48} color={Colors.textMuted} style={{ opacity: 0.5, marginBottom: 12 }} />
            <Text style={{ fontSize: 16, color: Colors.textMuted, textAlign: "center" }}>
              Your inventory is empty
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textMuted, textAlign: "center", marginTop: 4 }}>
              Mine some resources to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            key="inventory-grid-3-columns"
            data={filteredItems}
            renderItem={renderInventoryItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{
              paddingBottom: 16,
              paddingTop: 4,
            }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          />
        )}
      </Animated.View>
    </Modal>
  );
};

export default InventoryBottomSheet;