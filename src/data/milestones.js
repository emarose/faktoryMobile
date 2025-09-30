const milestones = [
  {
    id: "milestone1",
    name: "Basic Resource Gathering",
    description:
      "Reach your first milestone by discovering 2 resource nodes. The materials you gather will help you build your first machines.",
    requirementsDescription: "Discover 2 resource nodes and gather basic materials: 10 Iron Ore, 10 Copper Ore and 5 Coal",
    unlocked: false,
    unlocks: ["Smelter", "Miner"],
    requirements: { discoveredNodes: 2, ironOre: 10, copperOre: 10, coal: 5 },
  },
  {
    id: "milestone2",
    name: "Basic Manufacturing",
    description:
      "Master basic smelting by producing iron ingots and concrete. These materials will be used to construct your first Constructor.",
    requirementsDescription:
      "Produce 20 Iron Ingots and 5 Concrete",
    unlocked: false,
    unlocks: ["Constructor","Foundry"],
    requirements: { ironIngot: 20, concrete: 5 },
  },
  {
    id: "milestone3",
    name: "Component Production",
    description:
      "Use your Constructor to create basic building components. These parts will prepare you for more advanced manufacturing.",
    requirementsDescription:
      "Produce 15 Iron Rods, 10 Iron Plates, and 20 Screws",
    unlocked: false,
    unlocks: [],
    requirements: { ironRods: 15, ironPlates: 10, screws: 20 },
  },
  {
    id: "milestone4",
    name: "Copper Technology",
    description:
      "Expand into copper processing to create electrical components. Master copper ingots and basic wiring systems.",
    requirementsDescription:
      "Produce 15 Copper Ingots and 25 Wires",
    unlocked: false,
    unlocks: ["Assembler"],
    requirements: { copperIngot: 15, wires: 25 },
  },
  {
    id: "milestone5",
    name: "Advanced Parts Assembly",
    description:
      "Unlock the Assembler to create complex multi-component items. Produce reinforced materials and mechanical components.",
    requirementsDescription:
      "Produce 10 Reinforced Iron Plates and 5 Rotors",
    unlocked: false,
    unlocks: [],
    requirements: { reinforcedIronPlates: 10, rotors: 5 },
  },
  {
    id: "milestone6",
    name: "Steel Production Foundation",
    description:
      "Advance to steel production with the Foundry. Prepare the materials needed to build this advanced machine.",
    requirementsDescription: "Gather materials for Foundry: 10 Iron Rods, 20 Iron Plates, 15 Wires, 10 Screws",
    unlocked: false,
    unlocks: ["Foundry"],
    requirements: { ironRods: 10, ironPlates: 20, wires: 15, screws: 10 },
  },
  {
    id: "milestone7",
    name: "Steel Technology",
    description:
      "Master steel production and create structural components for heavy industry.",
    requirementsDescription:
      "Produce 10 Steel Ingots, 8 Steel Beams, and 6 Steel Pipes",
    unlocked: false,
    unlocks: [],
    requirements: { steelIngot: 10, steelBeams: 8, steelPipes: 6 },
  },
  {
    id: "milestone8",
    name: "Oil & Petroleum Industry",
    description:
      "Enter the petroleum age with oil extraction and refining. Gather materials to build Oil Extractors and Refineries.",
    requirementsDescription:
      "Discover 5 nodes total and prepare: 8 Steel Pipes, 6 Concrete, 10 Wires",
    unlocked: false,
    unlocks: ["oilExtractor", "Refinery"],
    requirements: { discoveredNodes: 5, steelPipes: 8, concrete: 6, wires: 10 },
  },
  {
    id: "milestone9",
    name: "Basic Petroleum Products",
    description:
      "Master basic oil refining by producing plastics, rubber, and fuel for advanced manufacturing.",
    requirementsDescription:
      "Produce 10 Plastic, 10 Rubber, and 8 Fuel",
    unlocked: false,
    unlocks: [],
    requirements: { plastic: 10, rubber: 8, fuel: 8 },
  },
  {
    id: "milestone10",
    name: "Electronics Foundation",
    description:
      "Begin electronics production. Prepare materials to build the Manufacturer for advanced components.",
    requirementsDescription:
      "Produce 5 Modular Frames, 3 Motors, and 5 Circuit Boards",
    unlocked: false,
    unlocks: ["Manufacturer"],
    requirements: { modularFrames: 5, motors: 3, circuitBoards: 5 },
  },
  {
    id: "milestone11",
    name: "Advanced Computing",
    description:
      "Master advanced electronics by producing your first computers and high-tech components.",
    requirementsDescription:
      "Produce 3 Computers and 10 Quickwire",
    unlocked: false,
    unlocks: [],
    requirements: { computers: 3, quickwire: 10 },
  },
  {
    id: "milestone12",
    name: "Rare Materials Processing",
    description:
      "Discover and process rare materials like Caterium and Quartz for specialized applications.",
    requirementsDescription:
      "Discover 7 nodes total and produce 5 Caterium Ingots, 6 Quartz Crystals",
    unlocked: false,
    unlocks: [],
    requirements: { discoveredNodes: 7, cateriumIngot: 5, quartzCrystals: 6 },
  },
  {
    id: "milestone13",
    name: "High-Tech Electronics",
    description:
      "Create advanced electronic systems with AI components and high-speed processing capabilities.",
    requirementsDescription:
      "Produce 2 AI Limiters, 2 High-Speed Connectors, and 1 Supercomputer",
    unlocked: false,
    unlocks: [],
    requirements: { aiLimiter: 2, highSpeedConnector: 2, supercomputers: 1 },
  },
  {
    id: "milestone14",
    name: "Aluminum Industry",
    description:
      "Establish aluminum production chain with bauxite processing for lightweight materials.",
    requirementsDescription:
      "Discover 8 nodes total and produce 3 Alumina Solution, 2 Aluminum Ingots",
    unlocked: false,
    unlocks: [],
    requirements: { discoveredNodes: 8, aluminaSolution: 3, aluminumIngot: 2 },
  },
  {
    id: "milestone15",
    name: "Industrial Automation",
    description:
      "Implement advanced automation systems with electromagnetic controls and smart wiring.",
    requirementsDescription:
      "Produce 2 Electromagnetic Control Rods, 3 Automated Wiring, and 1 Crystal Oscillator",
    unlocked: false,
    unlocks: [],
    requirements: {
      electromagneticControlRods: 2,
      automatedWiring: 3,
      crystalOscillator: 1,
    },
  },
  {
    id: "milestone16",
    name: "Heavy Industry",
    description:
      "Develop heavy industrial capabilities with reinforced structures and powerful machinery.",
    requirementsDescription:
      "Produce 1 Heavy Modular Frame, 1 Modular Engine, and 2 Encased Industrial Beams",
    unlocked: false,
    unlocks: [],
    requirements: {
      heavyModularFrames: 1,
      modularEngines: 1,
      encasedIndustrialBeams: 2,
    },
  },
  {
    id: "milestone17",
    name: "Nuclear Technology",
    description:
      "Enter the nuclear age with uranium processing and advanced power generation systems.",
    requirementsDescription:
      "Discover 9 nodes total and produce 2 Uranium Pellets, 1 Encased Uranium Cell",
    unlocked: false,
    unlocks: [],
    requirements: {
      discoveredNodes: 9,
      uraniumPellets: 2,
      encasedUraniumCell: 1,
    },
  },
  {
    id: "milestone18",
    name: "Advanced Power Systems",
    description:
      "Create sophisticated power and control systems with batteries and thermal management.",
    requirementsDescription:
      "Produce 2 Batteries and 2 Heat Sinks",
    unlocked: false,
    unlocks: [],
    requirements: { battery: 2, heatSink: 2 },
  },
  {
    id: "milestone19",
    name: "Space-Age Technology",
    description:
      "Achieve the highest level of technological advancement with adaptive systems and turbo motors.",
    requirementsDescription:
      "Produce 1 Adaptive Control Unit, 1 Radio Control Unit, and 1 Turbo Motor",
    unlocked: false,
    unlocks: [],
    requirements: {
      adaptiveControlUnits: 1,
      radioControlUnits: 1,
      turboMotors: 1,
    },
  },
  {
    id: "milestone20",
    name: "Nuclear Mastery",
    description:
      "Master nuclear technology with fuel rod production for ultimate power generation.",
    requirementsDescription: "Produce 1 Nuclear Fuel Rod and discover all 10 resource node types",
    unlocked: false,
    unlocks: ["Master Industrialist"],
    requirements: { nuclearFuelRods: 1, discoveredNodes: 10 },
  },
];

export default milestones;
