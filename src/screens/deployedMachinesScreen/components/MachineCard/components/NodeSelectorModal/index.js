import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import ProgressBar from "../../../../../../components/ProgressBar";

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.nodeSelectorModal}>
          <View style={styles.modalHeader}>
            <MaterialCommunityIcons
              name="select-group"
              size={22}
              color="#4CAF50"
            />
            <Text style={styles.modalTitle}>Select resource node</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={20} color="#bbb" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={18} color="#bbb" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search node name or coords"
              placeholderTextColor="#9a9a9a"
              style={styles.searchInput}
            />
          </View>
          {/* Vertical tabs and node list layout */}
          {/* Chrome-style horizontal tabs and node list layout */}
          <View style={{ flex: 1, minHeight: 260 }}>
            {/* Chrome-style Tabs */}
            <View style={[styles.tabContainer, { flexDirection: 'row', marginBottom: 18, marginTop: 2, overflow: 'visible' }]}> 
              {Object.entries(groupedNodes).map(([type, nodes], idx, arr) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.resourceTab,
                    selectedResourceType === type && styles.activeTab,
                    {
                      borderTopLeftRadius: idx === 0 ? 16 : 8,
                      borderTopRightRadius: idx === arr.length - 1 ? 16 : 8,
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      marginLeft: idx === 0 ? 0 : -12,
                      zIndex: selectedResourceType === type ? 2 : 1,
                      elevation: selectedResourceType === type ? 3 : 1,
                      backgroundColor: selectedResourceType === type ? '#fff' : '#23233a',
                      borderColor: selectedResourceType === type ? '#4CAF50' : '#444455',
                      top: selectedResourceType === type ? -8 : 0,
                      minWidth: 80,
                      paddingVertical: 10,
                      paddingHorizontal: 18,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: selectedResourceType === type ? '#000' : 'transparent',
                      shadowOpacity: selectedResourceType === type ? 0.12 : 0,
                      shadowRadius: selectedResourceType === type ? 6 : 0,
                      shadowOffset: selectedResourceType === type ? { width: 0, height: 2 } : undefined,
                    },
                  ]}
                  onPress={() => {
                    setSelectedResourceType(type);
                    setSearchQuery("");
                  }}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons
                    name={getResourceIcon(type)}
                    size={16}
                    color={selectedResourceType === type ? '#4CAF50' : '#bbb'}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      selectedResourceType === type && styles.activeTabText,
                      { color: selectedResourceType === type ? '#222' : '#bbb', marginLeft: 8, fontWeight: 'bold' },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {type} ({nodes.length})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Node List for selected tab */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <FlatList
                data={filteredNodes}
                keyExtractor={(item) => item.id}
                style={styles.flatListMaxHeight}
                renderItem={({ item: n }) => (
                  <TouchableOpacity
                    style={styles.nodeItem}
                    onPress={() => {
                      handleAssignNode(n.id);
                      onClose();
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.nodeIconContainer}>
                      <MaterialCommunityIcons
                        name={getResourceIcon(n.type)}
                        size={20}
                        color={getResourceColor(n.type)}
                      />
                    </View>
                    <View style={styles.nodeInfo}>
                      <Text style={styles.nodeName}>{n.name}</Text>
                      <Text style={styles.nodeLocation}>
                        ({n.x},{n.y}) • {calculateDistance({ x: 0, y: 0 }, n)}m
                      </Text>
                      <ProgressBar
                        value={n.currentAmount}
                        max={n.capacity}
                        style={styles.nodeProgress}
                      />
                    </View>
                    <View style={styles.nodeStats}>
                      <Text style={styles.nodeCapacity}>
                        {Math.round(
                          ((n.currentAmount || 0) / (n.capacity || 1)) * 100
                        )}
                        %
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={18}
                        color="#4CAF50"
                      />
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>
                    {searchQuery
                      ? `No nodes for "${searchQuery}"`
                      : `No ${selectedResourceType || "nodes"} available`}
                  </Text>
                )}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NodeSelectorModal;
