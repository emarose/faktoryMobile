const milestones = [
  {
    id: "milestone0",
    name: "Manual Mining & Exploration",
    description:
      "Begin your journey! Explore the world map and manually mine resources to gather your first materials. Discover new nodes to unlock further progress.",
    requirementsDescription: "Start exploring the world map and manually mining resource nodes!",
    unlocked: true,
    unlocks: [],
    requirements: {}, 
  },
  {
    id: "milestone1",
    name: "Starter Tech",
    description:
      "Reach your first milestone by discovering a resource node in the World Map. Unlocks mining and smelting, enabling basic automation of resource gathering and processing.",
    requirementsDescription: "Discover 1 resource node.",
    unlocked: false,
    unlocks: ["Smelter", "Miner"],
    requirements: { discoveredNodes: 1 },
  },
  {
    id: "milestone2",
    name: "Basic Automation",
    description:
      "Automate your production! Unlock the Constructor and essential recipes to start crafting iron components automatically. Collect enough Iron Ingots to advance.",
    requirementsDescription: "Collect 30 Iron Ingots.",
    unlocked: false,
    unlocks: ["Constructor", "Iron Ingot", "Iron Plate", "Iron Rod"],
    requirements: { ironIngot: 30 },
  },
  {
    id: "milestone3",
    name: "Advanced Materials",
    description:
      "Expand your factory's capabilities with advanced machines and recipes. Produce Wire and Cable in bulk to unlock the Assembler and new crafting options.",
    requirementsDescription: "Produce 50 Wire and 20 Cable.",
    unlocked: false,
    unlocks: ["Assembler", "Copper Ingot", "Wire", "Cable"],
    requirements: { wire: 50, cable: 20 },
  },
  {
    id: "milestone4",
    name: "Power & Logistics",
    description:
      "Power up your factory! Unlock Biomass Burners for energy and Conveyor Belts for efficient logistics. Gather Biomass to fuel your growing production lines.",
    requirementsDescription: "Gather 1000 Biomass.",
    unlocked: false,
    unlocks: ["Biomass Burner", "Conveyor Belt", "Splitter"],
    requirements: { Biomass: 1000 },
  },
];

export default milestones;
