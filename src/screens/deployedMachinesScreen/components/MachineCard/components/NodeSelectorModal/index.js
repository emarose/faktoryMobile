import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const resourceTypeLabels = {
  ironOre_node: "Iron Ore",
  copperOre_node: "Copper Ore",
  coal_node: "Coal",
  limestone_node: "Limestone",
  quartz_node: "Quartz Crystal",
  crudeOil_node: "Crude Oil",
  cateriumOre_node: "Caterium Ore",
};

const NodeSelectorModal = ({
  visible,
  onClose,
  groupedNodes,
  selectedResourceType,
  setSelectedResourceType,
  searchQuery,
  setSearchQuery,
  filteredNodes,
  handleAssignNode,
  getResourceIcon,
  getResourceColor,
  calculateDistance,
}) => {
  const resourceTypes = Object.keys(groupedNodes);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.fullScreenContainer}>
        {/* Header */}
        <View style={styles.fullHeader}>
          <Text style={styles.fullTitle}>Select Resource Node</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#bbb" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContent}
          >
            {resourceTypes.map((type) => {
              const isActive = selectedResourceType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.chromeTab, isActive && styles.chromeTabActive]}
                  onPress={() => {
                    setSelectedResourceType(type);
                    setSearchQuery("");
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={getResourceIcon(type)}
                    size={18}
                    color={isActive ? "#fff" : "#bbb"}
                  />
                  <Text
                    style={[
                      styles.chromeTabLabel,
                      isActive
                        ? styles.chromeTabLabelActive
                        : styles.chromeTabLabelInactive,
                    ]}
                  >
                    {resourceTypeLabels[type] || type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Search */}
        {/*   <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={18} color="#bbb" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search node name or coords"
            placeholderTextColor="#9a9a9a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View> */}

        {/* Node List */}
        <FlatList
          data={filteredNodes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
          renderItem={({ item: n }) => (
            <TouchableOpacity
              style={styles.nodeItem}
              onPress={() => {
                handleAssignNode(n.id);
                onClose();
              }}
            >
              <View
                style={[
                  styles.nodeIcon,
                  { backgroundColor: getResourceColor(n.type) },
                ]}
              >
                <MaterialCommunityIcons
                  name={getResourceIcon(n.type)}
                  size={20}
                  color="#fff"
                />
              </View>
              <View style={styles.nodeInfo}>
                <Text style={styles.nodeName}>{n.name}</Text>
                <Text style={styles.nodeLocation}>
                  ({n.x},{n.y}) • {calculateDistance({ x: 0, y: 0 }, n)}m
                </Text>
              </View>
              <Text style={styles.nodePct}>
                {Math.round(((n.currentAmount || 0) / (n.capacity || 1)) * 100)}
                %
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No nodes for "${searchQuery}"`
                : `No ${
                    resourceTypeLabels[selectedResourceType] ||
                    selectedResourceType
                  } nodes available`}
            </Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

export default NodeSelectorModal;
