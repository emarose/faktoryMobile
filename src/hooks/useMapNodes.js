import { useMemo } from "react";
import { NODE_TYPES_MAP } from "../data/nodeTypes";

export function useMapNodes() {
  const allResourceNodes = useMemo(
    () => [
      {
        id: "ironNode1",
        name: "Iron Ore Node",
        type: "ironOre_node",
        x: 8,
        y: 8,
        capacity: 50,
      },
      {
        id: "copperNode1",
        name: "Copper Ore Node",
        type: "copperOre_node",
        x: 10,
        y: 15,
        capacity: 50,
      },
      {
        id: "limestoneNode1",
        name: "Limestone Node",
        type: "limestone_node",
        x: 2,
        y: 7,
        capacity: 50,
      },
      {
        id: "coalNode1",
        name: "Coal Node",
        type: "coal_node",
        x: 3,
        y: 7,
        capacity: 50,
      },
      {
        id: "cateriumNode1",
        name: "Caterium Ore Node",
        type: "cateriumOre_node",
        x: 400,
        y: 100,
        capacity: 50,
      },
      {
        id: "rawQuartzNode1",
        name: "Raw Quartz Node",
        type: "rawQuartz_node",
        x: 500,
        y: 200,
        capacity: 50,
      },
      {
        id: "sulfurNode1",
        name: "Sulfur Node",
        type: "sulfur_node",
        x: 250,
        y: 300,
        capacity: 50,
      },
      {
        id: "crudeOilNode1",
        name: "Crude Oil Node",
        type: "crudeOil_node",
        x: 350,
        y: 400,
        capacity: 50,
      },
      {
        id: "bauxiteNode1",
        name: "Bauxite Node",
        type: "bauxite_node",
        x: 100,
        y: 450,
        capacity: 50,
      },
      {
        id: "uraniumNode1",
        name: "Uranium Node",
        type: "uranium_node",
        x: 550,
        y: 350,
        capacity: 50,
      },
    ],
    []
  );
  return { allResourceNodes, NODE_TYPES_MAP };
}
