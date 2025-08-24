// Centralized node type definitions for resource nodes

export const NODE_TYPES_MAP = [
  { type: "ironOre_node", name: "Iron Ore", color: "#d8dadbff" },
  { type: "copperOre_node", name: "Copper Ore", color: "#b88333ff" },
  { type: "limestone_node", name: "Limestone", color: "#f5d7c5ff" },
  { type: "coal_node", name: "Coal", color: "#424040ff" },
  { type: "cateriumOre_node", name: "Caterium Ore", color: "#DAA520" },
  { type: "rawQuartz_node", name: "Raw Quartz", color: "#ADD8E6" },
  { type: "sulfur_node", name: "Sulfur", color: "#FFFF00" },
  { type: "crudeOil_node", name: "Crude Oil", color: "#4B0082" },
  { type: "bauxite_node", name: "Bauxite", color: "#CD5C5C" },
  { type: "uranium_node", name: "Uranium", color: "#00FF00" },
];

export function getNodeTypeDefinition(nodeType) {
  return NODE_TYPES_MAP.find((item) => item.type === nodeType);
}

export function getNodeColor(nodeType) {
  const found = NODE_TYPES_MAP.find((item) => item.type === nodeType);
  return found ? found.color : "#808080";
}
