const milestones = [
  {
    id: "milestone0",
    name: "Manual Mining & Exploration",
    description:
      "Begin your journey! Explore the world map and manually mine resources to gather your first materials. Discover new nodes to unlock further progress.",
    unlocked: true,
    unlocks: [],
    requirements: {}, // No requirements for milestone0
  },
  {
    id: "milestone1",
    name: "Starter Tech",
    description:
      "Reach your first milestone by discovering a resource node. Unlocks the Smelter and Miner, enabling basic automation of resource gathering and processing.",
    unlocked: false,
    unlocks: ["Smelter", "Miner"],
    requirements: { discoveredNodes: 1 },
  },
  {
    id: "milestone2",
    name: "Basic Automation",
    description:
      "Automate your production! Unlock the Constructor and essential recipes to start crafting iron components automatically. Collect enough Iron Ingots to advance.",
    unlocked: false,
    unlocks: ["Constructor", "Iron Ingot", "Iron Plate", "Iron Rod"],
    requirements: { ironIngot: 30 },
  },
  {
    id: "milestone3",
    name: "Advanced Materials",
    description:
      "Expand your factory's capabilities with advanced machines and recipes. Produce Wire and Cable in bulk to unlock the Assembler and new crafting options.",
    unlocked: false,
    unlocks: ["Assembler", "Copper Ingot", "Wire", "Cable"],
    requirements: { wire: 50, cable: 20 },
  },
  {
    id: "milestone4",
    name: "Power & Logistics",
    description:
      "Power up your factory! Unlock Biomass Burners for energy and Conveyor Belts for efficient logistics. Gather Biomass to fuel your growing production lines.",
    unlocked: false,
    unlocks: ["Biomass Burner", "Conveyor Belt", "Splitter"],
    requirements: { Biomass: 1000 },
  },
];

export default milestones;
