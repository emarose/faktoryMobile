const milestones = [
  {
    id: "milestone0",
    name: "Manual Mining & Exploration",
    description:
      "Begin your journey! Explore the world map and manually mine resources to gather your first materials. Discover new nodes to unlock further progress.",
    requirementsDescription: null,
    unlocked: true,
    unlocks: [],
    requirements: {},
  },
  {
    id: "milestone1",
    name: "Basic Automation - Smelting",
    description:
      "Reach your first milestone by discovering resource nodes and establishing basic ore processing. Unlocks mining and smelting operations.",
    requirementsDescription: "Discover 2 resource nodes and produce 25 Iron Ingots",
    unlocked: false,
    unlocks: ["Smelter", "Miner"],
    requirements: { discoveredNodes: 2, ironIngot: 25 },
  },
  {
    id: "milestone2",
    name: "Basic Manufacturing",
    description:
      "Establish basic part manufacturing with the Constructor. Create essential building components and simple materials.",
    requirementsDescription: "Produce 30 Iron Rods, 20 Iron Plates, and 10 Concrete",
    unlocked: false,
    unlocks: ["Constructor"],
    requirements: { ironRods: 30, ironPlates: 20, concrete: 10 },
  },
  {
    id: "milestone3",
    name: "Copper Technology",
    description:
      "Expand into copper processing and electrical components. Begin working with basic electrical infrastructure.",
    requirementsDescription: "Produce 25 Copper Ingots, 40 Wires, and 15 Copper Sheets",
    unlocked: false,
    unlocks: [],
    requirements: { copperIngot: 25, wires: 40, copperSheets: 15 },
  },
  {
    id: "milestone4",
    name: "Advanced Parts Assembly",
    description:
      "Unlock the Assembler to create complex multi-component items. Begin producing reinforced materials and mechanical components.",
    requirementsDescription: "Produce 50 Screws, 20 Reinforced Iron Plates, and 10 Rotors",
    unlocked: false,
    unlocks: ["Assembler"],
    requirements: { screws: 50, reinforcedIronPlates: 20, rotors: 10 },
  },
  {
    id: "milestone5",
    name: "Steel Production",
    description:
      "Advance to steel production with the Foundry. Create stronger materials for more demanding applications.",
    requirementsDescription: "Produce 15 Steel Ingots, 10 Steel Beams, and 8 Steel Pipes",
    unlocked: false,
    unlocks: ["Foundry"],
    requirements: { steelIngot: 15, steelBeams: 10, steelPipes: 8 },
  },
  {
    id: "milestone6",
    name: "Electrical Systems",
    description:
      "Develop electrical infrastructure with advanced wiring and components. Create the foundation for smart automation.",
    requirementsDescription: "Produce 10 Stators, 5 Motors, and 8 Cables",
    unlocked: false,
    unlocks: [],
    requirements: { stators: 10, motors: 5, cables: 8 },
  },
  {
    id: "milestone7",
    name: "Modular Construction",
    description:
      "Create modular building systems and smart components for scalable factory design.",
    requirementsDescription: "Produce 5 Modular Frames, 3 Smart Platings, and 4 Versatile Frameworks",
    unlocked: false,
    unlocks: [],
    requirements: { modularFrames: 5, smartPlatings: 3, versatileFrameworks: 4 },
  },
  {
    id: "milestone8",
    name: "Oil & Petroleum Industry",
    description:
      "Enter the petroleum age with oil extraction and refining. Unlock plastics, rubber, and fuel production.",
    requirementsDescription: "Discover 1 Oil Node and produce 20 Crude Oil, 10 Plastic, and 10 Rubber",
    unlocked: false,
    unlocks: ["oilExtractor", "Refinery"],
    requirements: { discoveredNodes: 5, crudeOil: 20, plastic: 10, rubber: 10 },
  },
  {
    id: "milestone9",
    name: "Advanced Chemicals",
    description:
      "Develop chemical processing capabilities with sulfur and advanced petroleum products.",
    requirementsDescription: "Produce 8 Sulfuric Acid, 15 Fuel, and 5 Heavy Oil Residue",
    unlocked: false,
    unlocks: [],
    requirements: { sulfuricAcid: 8, fuel: 15, heavyOilResidue: 5 },
  },
  {
    id: "milestone10",
    name: "Electronics Foundation",
    description:
      "Begin electronics production with circuit boards and basic computing components.",
    requirementsDescription: "Produce 5 Circuit Boards, 3 Computers, and 10 Quickwire",
    unlocked: false,
    unlocks: ["Manufacturer"],
    requirements: { circuitBoards: 5, computers: 3, quickwire: 10 },
  },
  {
    id: "milestone11",
    name: "Rare Materials Processing",
    description:
      "Unlock advanced material processing with Caterium and Quartz for high-tech applications.",
    requirementsDescription: "Discover 7 nodes total and produce 5 Caterium Ingots, 8 Quartz Crystals",
    unlocked: false,
    unlocks: [],
    requirements: { discoveredNodes: 7, cateriumIngot: 5, quartzCrystals: 8 },
  },
  {
    id: "milestone12",
    name: "Aluminum Industry",
    description:
      "Establish aluminum production chain with bauxite processing and advanced lightweight materials.",
    requirementsDescription: "Produce 5 Alumina Solution, 3 Aluminum Ingots, and 5 Aluminum Sheets",
    unlocked: false,
    unlocks: [],
    requirements: { aluminaSolution: 5, aluminumIngot: 3, aluminumSheets: 5 },
  },
  {
    id: "milestone13",
    name: "High-Tech Electronics",
    description:
      "Create advanced electronic systems with AI components and high-speed data processing.",
    requirementsDescription: "Produce 3 AI Limiters, 2 High-Speed Connectors, and 1 Supercomputer",
    unlocked: false,
    unlocks: [],
    requirements: { aiLimiter: 3, highSpeedConnector: 2, supercomputers: 1 },
  },
  {
    id: "milestone14",
    name: "Industrial Automation",
    description:
      "Implement advanced automation systems with electromagnetic controls and automated wiring.",
    requirementsDescription: "Produce 3 Electromagnetic Control Rods, 5 Automated Wiring, and 2 Crystal Oscillators",
    unlocked: false,
    unlocks: [],
    requirements: { electromagneticControlRods: 3, automatedWiring: 5, crystalOscillator: 2 },
  },
  {
    id: "milestone15",
    name: "Heavy Industry",
    description:
      "Develop heavy industrial capabilities with reinforced structures and powerful machinery.",
    requirementsDescription: "Produce 2 Heavy Modular Frames, 1 Modular Engine, and 3 Encased Industrial Beams",
    unlocked: false,
    unlocks: [],
    requirements: { heavyModularFrames: 2, modularEngines: 1, encasedIndustrialBeams: 3 },
  },
  {
    id: "milestone16",
    name: "Nuclear Technology",
    description:
      "Enter the nuclear age with uranium processing and advanced power generation systems.",
    requirementsDescription: "Discover 9 nodes total and produce 2 Uranium Pellets, 1 Encased Uranium Cell",
    unlocked: false,
    unlocks: [],
    requirements: { discoveredNodes: 9, uraniumPellets: 2, encasedUraniumCell: 1 },
  },
  {
    id: "milestone17",
    name: "Advanced Power Systems",
    description:
      "Create sophisticated power and control systems with batteries and heat management.",
    requirementsDescription: "Produce 2 Batteries, 3 Heat Sinks, and 1 Turbofuel",
    unlocked: false,
    unlocks: [],
    requirements: { battery: 2, heatSink: 3, turbofuel: 1 },
  },
  {
    id: "milestone18",
    name: "Space-Age Technology",
    description:
      "Achieve the highest level of technological advancement with adaptive systems and turbo motors.",
    requirementsDescription: "Produce 1 Adaptive Control Unit, 1 Radio Control Unit, and 1 Turbo Motor",
    unlocked: false,
    unlocks: [],
    requirements: { adaptiveControlUnits: 1, radioControlUnits: 1, turboMotors: 1 },
  },
  {
    id: "milestone19",
    name: "Nuclear Power Generation",
    description:
      "Master nuclear technology with fuel rod production for ultimate power generation.",
    requirementsDescription: "Produce 1 Nuclear Fuel Rod",
    unlocked: false,
    unlocks: [],
    requirements: { nuclearFuelRods: 1 },
  },
  {
    id: "milestone20",
    name: "Planetary Industrialization",
    description:
      "Complete planetary industrialization by discovering all resource types and mastering all production chains.",
    requirementsDescription: "Discover all 10 resource node types",
    unlocked: false,
    unlocks: ["Master Industrialist"],
    requirements: { discoveredNodes: 10 },
  },
];

export default milestones;
