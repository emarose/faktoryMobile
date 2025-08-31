import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles';
import { useGame } from '../../../../contexts/GameContext';
import { getNodeTypeDefinition } from '../../../../data/nodeTypes';
import ProgressBar from '../../../../components/ProgressBar';
import NodeSelectorModal from '../components/NodeSelectorModal';

// Helpers para iconos y colores de recursos
function getResourceIcon(type) {
  if (!type) return 'cube-outline';
  const t = type.toLowerCase();
  if (t.includes('iron')) return 'circle-slice-8';
  if (t.includes('copper')) return 'hexagon-multiple';
  if (t.includes('coal')) return 'fire';
  if (t.includes('oil')) return 'oil';
  if (t.includes('limestone')) return 'square-outline';
  if (t.includes('uranium')) return 'radioactive';
  return 'cube-outline';
}

function getResourceColor(type) {
  if (!type) return '#4CAF50';
  const t = type.toLowerCase();
  if (t.includes('iron')) return '#8B4513';
  if (t.includes('copper')) return '#CD7F32';
  if (t.includes('coal')) return '#2F2F2F';
  if (t.includes('oil')) return '#6a4c93';
  if (t.includes('limestone')) return '#bfbfbf';
  if (t.includes('uranium')) return '#00c853';
  return '#4CAF50';
}

// Icono de la máquina (solo miner aquí)
function getMachineIcon() {
  return (
    <MaterialCommunityIcons
      name="robot-industrial"
      size={28}
      color="#4CAF50"
    />
  );
}

const Miner = ({ machine, node, onPress }) => {
  const { allResourceNodes = [], discoveredNodes = {}, placedMachines, setPlacedMachines } = useGame();
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Abrir/cerrar selector animado
  const openNodeSelector = () => {
    setShowNodeSelector(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };
  const closeNodeSelector = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.exp),
      useNativeDriver: true,
    }).start(() => setShowNodeSelector(false));
  };

  // Representa el estado actual de la máquina en el tablero
  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;
  const isIdle = liveMachine.isIdle;

  // Filtrar nodos descubiertos y no agotados
  const discoveredNodeOptions = useMemo(
    () =>
      allResourceNodes.filter(
        (n) =>
          discoveredNodes[n.id] &&
          (typeof n.currentAmount !== 'number' || n.currentAmount > 0)
      ),
    [allResourceNodes, discoveredNodes]
  );

  // Estado del selector avanzado
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Agrupar por tipo y ordenar por porcentaje restante
  const groupedNodes = useMemo(() => {
    const groups = {};
    discoveredNodeOptions.forEach((n) => {
      const key = n.type || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    Object.keys(groups).forEach((k) => {
      groups[k].sort(
        (a, b) =>
          (b.currentAmount || 0) / (b.capacity || 1) -
          (a.currentAmount || 0) / (a.capacity || 1)
      );
    });
    return groups;
  }, [discoveredNodeOptions]);

  // Seleccionar por defecto el primer tipo
  useEffect(() => {
    if (!selectedResourceType) {
      const keys = Object.keys(groupedNodes);
      if (keys.length) setSelectedResourceType(keys[0]);
    }
  }, [groupedNodes, selectedResourceType]);

  // Filtrar según búsqueda y tipo
  const filteredNodes = useMemo(() => {
    if (!selectedResourceType) return [];
    const list = groupedNodes[selectedResourceType] || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (n) =>
        (n.name || '').toLowerCase().includes(q) ||
        `${n.x},${n.y}`.includes(q)
    );
  }, [groupedNodes, selectedResourceType, searchQuery]);

  // Distancia euclidiana redondeada
  const calculateDistance = (pos) => {
    const px = placedMachines.find((m) => m.id === machine.id)?.x || 0;
    const py = placedMachines.find((m) => m.id === machine.id)?.y || 0;
    const dx = (pos.x || 0) - px;
    const dy = (pos.y || 0) - py;
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  };

  // Valores para barra de progresión
  const nodeCapacity =
    node && typeof node.capacity === 'number' ? node.capacity : 1000;
  const nodeDepletionAmount =
    node && typeof node.currentAmount === 'number'
      ? node.currentAmount
      : nodeCapacity;

  // Asignar nodo seleccionado
  const handleAssignNode = (nodeId) => {
    const target = allResourceNodes.find((n) => n.id === nodeId);
    if (!target || !discoveredNodes[nodeId] || target.currentAmount <= 0) {
      return;
    }
    // reubicar temporal para disparar re-render
    setPlacedMachines((prev) =>
      prev.filter((m) => m.id !== liveMachine.id)
    );
    setTimeout(() => {
      setPlacedMachines((prev) => [
        ...prev,
        { ...liveMachine, assignedNodeId: nodeId },
      ]);
    }, 0);
  };

  // Pausar / reanudar minería
  const handlePauseResume = () => {
    setPlacedMachines((prev) =>
      prev.map((m) =>
        m.id === liveMachine.id ? { ...m, isIdle: !m.isIdle } : m
      )
    );
  };

  return (
    <View style={styles.cardContent}>
      {/* Cabecera: icono, nombre y lupa */}
      <View style={styles.rowSpaceBetween}>
        <View style={styles.rowAlignCenterGap}>
          <View style={styles.machineIconContainer}>
            {getMachineIcon()}
          </View>
          <Text style={[styles.machineName, { color: '#4CAF50' }]}>
            {machine.displayName || machine.name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onPress}
          style={styles.loupeButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="loupe" size={32} color="#bbb" />
        </TouchableOpacity>
      </View>

      {/* Botón de asignar nodo */}
      <View style={styles.marginVertical10}>
        <TouchableOpacity
          style={styles.assignNodeButton}
          onPress={openNodeSelector}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="select-marker"
            size={28}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.assignNodeText}>
            {liveMachine.assignedNodeId
              ? 'Change resource node'
              : 'Assign resource node'}
          </Text>
        </TouchableOpacity>

        {!liveMachine.assignedNodeId && filteredNodes.length === 0 && (
          <Text style={styles.noNodesText}>
            No discovered, non-depleted nodes available.
          </Text>
        )}
      </View>

      {/* Modal selector de nodo */}
      {showNodeSelector && (
        <NodeSelectorModal
          visible={showNodeSelector}
          slideAnim={slideAnim}
          onClose={closeNodeSelector}
          groupedNodes={groupedNodes}
          selectedResourceType={selectedResourceType}
          setSelectedResourceType={setSelectedResourceType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredNodes={filteredNodes}
          handleAssignNode={handleAssignNode}
          getResourceIcon={getResourceIcon}
          getResourceColor={getResourceColor}
          calculateDistance={calculateDistance}
        />
      )}

      {/* Información del nodo y controles */}
      {node && (
        <View style={styles.nodeInfoContainer}>
          <View style={styles.headerRow}>
            {/* Pill de tipo de recurso */}
            <View
              style={[
                styles.selectedNodePill,
                {
                  backgroundColor:
                    getNodeTypeDefinition(node.type)?.color || '#333',
                },
              ]}
            >
              <Text style={styles.selectedNodePillText}>
                {node.name}
              </Text>
            </View>
            <Text style={styles.machineStatus}>
              {isIdle ? 'Miner is on hold' : machine.statusText}
            </Text>
          </View>

          {/* Barra de progreso de agotamiento */}
          <View style={styles.depletionSection}>
            <ProgressBar
              value={nodeDepletionAmount}
              max={nodeCapacity}
              label="Node Depletion"
            />
            {nodeDepletionAmount <= 0 && (
              <Text style={styles.nodeDepletedText}>
                Node Depleted
              </Text>
            )}
          </View>

          {/* Botones de pausar/reanudar y desenganchar */}
          <View style={styles.controlButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.pauseResumeButton,
                isIdle
                  ? styles.pauseResumeIdle
                  : styles.pauseResumeActive,
              ]}
              onPress={handlePauseResume}
              activeOpacity={0.85}
            >
              <MaterialIcons
                name={isIdle ? 'play-arrow' : 'pause'}
                size={18}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.pauseResumeText}>
                {isIdle ? 'Resume Mining' : 'Pause Miner'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detachButton}
              onPress={() => {
                setPlacedMachines((prev) =>
                  prev.map((m) =>
                    m.id === liveMachine.id
                      ? { ...m, isIdle: true, assignedNodeId: undefined }
                      : m
                  )
                );
              }}
              activeOpacity={0.85}
            >
              <MaterialIcons
                name="link-off"
                size={16}
                color="#bbb"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.detachText}>Detach Miner</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Miner;