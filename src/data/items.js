export const items = {
  // --- Raw Material Nodes (The actual resource deposits on the map) ---
  ironOre_node: {
    id: "ironOre_node", // Added ID
    name: "Iron Ore Node",
    type: "rawMaterial",
    description: "A deposit of basic mineral. Can be mined manually.",
    // icon: require('../assets/icons/icon_ironOre.png'), // Corrected path
    manualMineable: true,
    output: { ironOre: 5 },
    processingTime: 1,
  },
  copperOre_node: {
    id: "copperOre_node", // Added ID
    name: "Copper Ore Node",
    type: "rawMaterial",
    description: "A deposit of copper. Can be mined manually.",
    // icon: require('../assets/icons/icon_copperOre.png'), // Corrected path
    manualMineable: true,
    output: { copperOre: 5 },
    processingTime: 1,
  },
  coal_node: {
    id: "coal_node", // Added ID
    name: "Coal Node",
    type: "rawMaterial",
    description: "A deposit of primary fuel source. Can be mined manually.",
    // icon: require('../assets/icons/icon_coal.png'), // Corrected path
    manualMineable: true,
    output: { coal: 10 },
    processingTime: 1,
  },
  limestone_node: {
    id: "limestone_node", // Added ID
    name: "Limestone Node",
    type: "rawMaterial",
    description: "A deposit of limestone. Can be mined manually.",
    // icon: require('../assets/icons/icon_limestone.png'), // Corrected path
    manualMineable: true,
    output: { limestone: 6 },
    processingTime: 1,
  },

  // --- Nodes that require machines (NOT manually mineable initially) ---
  cateriumOre_node: {
    id: "cateriumOre_node", // Added ID
    name: "Caterium Ore Node",
    type: "rawMaterial",
    description: "A deposit of versatile ore. Requires a Miner.",
    // icon: require('../assets/icons/icon_cateriumOre.png'), // Corrected path
    manualMineable: false,
    machineRequired: "miner",
    output: { cateriumOre: 3 },
    processingTime: 1,
  },
  rawQuartz_node: {
    id: "rawQuartz_node", // Added ID
    name: "Raw Quartz Node",
    type: "rawMaterial",
    description: "A deposit of quartz. Requires a Miner.",
    // icon: require('../assets/icons/icon_rawQuartz.png'), // Corrected path
    manualMineable: false,
    machineRequired: "miner",
    output: { rawQuartz: 4 },
    processingTime: 1,
  },
  sulfur_node: {
    id: "sulfur_node", // Added ID
    name: "Sulfur Node",
    type: "rawMaterial",
    description: "A deposit of hazardous sulfur. Requires a Miner.",
    // icon: require('../assets/icons/icon_sulfur.png'), // Corrected path
    manualMineable: false,
    machineRequired: "miner",
    output: { sulfur: 2 },
    processingTime: 1,
  },
  crudeOil_node: {
    id: "crudeOil_node", // Added ID
    name: "Crude Oil Node",
    type: "rawMaterial",
    description: "An oil deposit. Requires an Oil Extractor.",
    // icon: require('../assets/icons/icon_crudeOil.png'), // Corrected path
    manualMineable: false,
    machineRequired: "oilExtractor",
    output: { crudeOil: 10 },
    processingTime: 2,
  },
  bauxite_node: {
    id: "bauxite_node", // Added ID
    name: "Bauxite Node",
    type: "rawMaterial",
    description: "A deposit of bauxite. Requires a Miner.",
    // icon: require('../assets/icons/icon_bauxite.png'), // Corrected path
    manualMineable: false,
    machineRequired: "miner",
    output: { bauxite: 4 },
    processingTime: 1,
  },
  uranium_node: {
    id: "uranium_node", // Added ID
    name: "Uranium Node",
    type: "rawMaterial",
    description: "A deposit of highly radioactive uranium. Requires a Miner.",
    // icon: require('../assets/icons/icon_uranium.png'), // Corrected path
    manualMineable: false,
    machineRequired: "miner",
    output: { uranium: 1 },
    processingTime: 2,
  },

  // --- Actual Raw Materials (These are the items produced from nodes into inventory) ---
  ironOre: {
    id: "ironOre", // Added ID
    name: "Iron Ore",
    type: "rawMaterial",
    description: "Basic mineral used in smelting.",
    // icon: require('../assets/icons/icon_ironOre.png'), // Corrected path
    machine: "miner",
  },
  cateriumOre: {
    id: "cateriumOre", // Added ID
    name: "Caterium Ore",
    type: "rawMaterial",
    description: "A versatile ore, good for electronics.",
    // icon: require('../assets/icons/icon_cateriumOre.png'), // Corrected path
    machine: "miner",
  },
  copperOre: {
    id: "copperOre", // Added ID
    name: "Copper Ore",
    type: "rawMaterial",
    description: "Fundamental for wiring and sheets.",
    // icon: require('../assets/icons/icon_copperOre.png'), // Corrected path
    machine: "miner",
  },
  coal: {
    id: "coal", // Added ID
    name: "Coal",
    type: "rawMaterial",
    description: "A primary fuel source.",
    // icon: require('../assets/icons/icon_coal.png'), // Corrected path
    machine: "miner",
  },
  rawQuartz: {
    id: "rawQuartz", // Added ID
    name: "Raw Quartz",
    type: "rawMaterial",
    description: "Used in advanced electronics and glass.",
    // icon: require('../assets/icons/icon_rawQuartz.png'), // Corrected path
    machine: "miner",
  },
  limestone: {
    id: "limestone", // Added ID
    name: "Limestone",
    type: "rawMaterial",
    description: "Key ingredient for concrete.",
    // icon: require('../assets/icons/icon_limestone.png'), // Corrected path
    machine: "miner",
  },
  sulfur: {
    id: "sulfur", // Added ID
    name: "Sulfur",
    type: "rawMaterial",
    description: "Hazardous but essential for explosives and acids.",
    // icon: require('../assets/icons/icon_sulfur.png'), // Corrected path
    machine: "miner",
  },
  crudeOil: {
    id: "crudeOil", // Added ID
    name: "Crude Oil",
    type: "rawMaterial",
    description: "Black gold, refined into many valuable products.",
    // icon: require('../assets/icons/icon_crudeOil.png'), // Corrected path
    machine: "oilExtractor",
  },
  bauxite: {
    id: "bauxite", // Added ID
    name: "Bauxite",
    type: "rawMaterial",
    description: "Primary source of aluminum.",
    // icon: require('../assets/icons/icon_bauxite.png'), // Corrected path
    machine: "miner",
  },
  uranium: {
    id: "uranium", // Added ID
    name: "Uranium",
    type: "rawMaterial",
    description: "Highly radioactive, for advanced power.",
    // // icon: require('../assets/icons/icon_uranium.png'), // Corrected path
    machine: "miner",
  },

  // --- Intermediate Products (Produced by machines like Smelter, Constructor, Assembler, Refinery, Foundry, Manufacturer) ---
  // Ensure 'inputs' here refer to actual item IDs, not node IDs.
  ironIngot: {
    id: "ironIngot", // Added ID
    name: "Iron Ingot",
    type: "intermediateProduct",
    description: "Basic metal ingot.",
    // // icon: require('../assets/icons/icon_ironIngot.png'), // Corrected path
    machine: "smelter",
    inputs: { ironOre: 5 },
    output: { ironIngot: 1 },
    processingTime: 3,
    fuelConsumption: 1,
  },
  cateriumIngot: {
    id: "cateriumIngot", // Added ID
    name: "Caterium Ingot",
    type: "intermediateProduct",
    description: "Specialized ingot for electronics.",
    // icon: require('../assets/icons/icon_cateriumIngot.png'), // Corrected path
    machine: "smelter",
    inputs: { cateriumOre: 3 },
    output: { cateriumIngot: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  copperIngot: {
    id: "copperIngot", // Added ID
    name: "Copper Ingots",
    type: "intermediateProduct",
    description: "Essential for electrical components.",
    // icon: require('../assets/icons/icon_copperIngot.png'), // Corrected path
    machine: "smelter",
    inputs: { copperOre: 5 },
    output: { copperIngot: 1 },
    processingTime: 3,
    fuelConsumption: 1,
  },
  ironRods: {
    id: "ironRods", // Added ID
    name: "Iron Rods",
    type: "intermediateProduct",
    description: "Basic structural component.",
    // icon: require('../assets/icons/icon_ironRods.png'), // Corrected path
    machine: "constructor",
    inputs: { ironIngot: 1 },
    output: { ironRods: 4 },
    processingTime: 2,
    fuelConsumption: 0.5,
  },
  ironPlates: {
    id: "ironPlates", // Added ID
    name: "Iron Plates",
    type: "intermediateProduct",
    description: "Fundamental building material.",
    // icon: require('../assets/icons/icon_ironPlates.png'), // Corrected path
    machine: "constructor",
    inputs: { ironIngot: 3 },
    output: { ironPlates: 2 },
    processingTime: 3,
    fuelConsumption: 0.7,
  },
  steelBeams: {
    id: "steelBeams", // Added ID
    name: "Steel Beams",
    type: "intermediateProduct",
    description: "Heavy duty structural support.",
    // icon: require('../assets/icons/icon_steelBeams.png'), // Corrected path
    machine: "constructor",
    inputs: { steelIngot: 2 },
    output: { steelBeams: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  steelPipes: {
    id: "steelPipes", // Added ID
    name: "Steel Pipes",
    type: "intermediateProduct",
    description: "Used for fluid transport and structures.",
    // icon: require('../assets/icons/icon_steelPipes.png'), // Corrected path
    machine: "constructor",
    inputs: { steelIngot: 3 },
    output: { steelPipes: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  screws: {
    id: "screws", // Added ID
    name: "Screws",
    type: "intermediateProduct",
    description: "Small fasteners for assembly.",
    // icon: require('../assets/icons/icon_screws.png'), // Corrected path
    machine: "constructor",
    inputs: { ironRods: 1 },
    output: { screws: 10 },
    processingTime: 1,
    fuelConsumption: 0.2,
  },
  cannisters: {
    id: "cannisters", // Added ID
    name: "Cannisters",
    type: "intermediateProduct",
    description: "Empty containers for liquids.",
    // icon: require('../assets/icons/icon_cannisters.png'), // Corrected path
    machine: "constructor",
    inputs: { plastic: 4 },
    output: { cannisters: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  quartzCrystals: {
    id: "quartzCrystals", // Added ID
    name: "Quartz Crystals",
    type: "intermediateProduct",
    description: "Refined quartz for electronics.",
    // icon: require('../assets/icons/icon_quartzCrystals.png'), // Corrected path
    machine: "constructor",
    inputs: { rawQuartz: 4 },
    output: { quartzCrystals: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  concrete: {
    id: "concrete", // Added ID
    name: "Concrete",
    type: "intermediateProduct",
    description: "A sturdy building material.",
    // icon: require('../assets/icons/icon_concrete.png'), // Corrected path
    machine: "constructor",
    inputs: { limestone: 3 },
    output: { concrete: 1 },
    processingTime: 2,
    fuelConsumption: 0.5,
  },
  silica: {
    id: "silica", // Added ID
    name: "Silica",
    type: "intermediateProduct",
    description: "Pure silicon dioxide, used in electronics.",
    // icon: require('../assets/icons/icon_silica.png'), // Corrected path
    machine: "constructor",
    inputs: { aluminaSolution: 2, rawQuartz: 2 },
    output: { silica: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  quickwire: {
    id: "quickwire", // Added ID
    name: "Quickwire",
    type: "intermediateProduct",
    description: "High-conductivity wire.",
    // icon: require('../assets/icons/icon_quickwire.png'), // Corrected path
    machine: "constructor",
    inputs: { cateriumIngot: 4 },
    output: { quickwire: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  copperSheets: {
    id: "copperSheets", // Added ID
    name: "Copper Sheets",
    type: "intermediateProduct",
    description: "Flat copper material for circuits.",
    // icon: require('../assets/icons/icon_copperSheets.png'), // Corrected path
    machine: "constructor",
    inputs: { copperIngot: 2 },
    output: { copperSheets: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  wires: {
    id: "wires", // Added ID
    name: "Wires",
    type: "intermediateProduct",
    description: "Basic electrical conductor.",
    // icon: require('../assets/icons/icon_wires.png'), // Corrected path
    machine: "constructor",
    inputs: { copperIngot: 1 },
    output: { wires: 6 },
    processingTime: 1,
    fuelConsumption: 0.2,
  },
  cables: {
    id: "cables", // Added ID
    name: "Cables",
    type: "intermediateProduct",
    description: "Insulated wires for power and data.",
    // icon: require('../assets/icons/icon_cables.png'), // Corrected path
    machine: "constructor",
    inputs: { rubber: 2, wires: 2 },
    output: { cables: 1 },
    processingTime: 4,
    fuelConsumption: 1,
  },
  aluminumScrap: {
    id: "aluminumScrap", // Added ID
    name: "Aluminum Scrap",
    type: "intermediateProduct",
    description: "Waste product, but valuable for recycling.",
    // icon: require('../assets/icons/icon_aluminumScrap.png'), // Corrected path
    machine: "refinery",
    inputs: { aluminaSolution: 6 },
    output: { aluminumScrap: 2, water: 3 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  heavyOilResidue: {
    id: "heavyOilResidue", // Added ID
    name: "Heavy Oil Residue",
    type: "intermediateProduct",
    description: "A byproduct of oil processing, useful for fuel.",
    // icon: require('../assets/icons/icon_heavyOilResidue.png'), // Corrected path
    machine: "refinery",
    inputs: {},
    output: {},
    processingTime: 0,
    fuelConsumption: 0,
  },
  sulfuricAcid: {
    id: "sulfuricAcid", // Added ID
    name: "Sulfuric Acid",
    type: "intermediateProduct",
    description: "Corrosive liquid, used in chemical processes.",
    // icon: require('../assets/icons/icon_sulfuricAcid.png'), // Corrected path
    machine: "refinery",
    inputs: { sulfur: 3 },
    output: { sulfuricAcid: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  fuel: {
    id: "fuel", // Added ID
    name: "Fuel",
    type: "consumable",
    description: "Refined crude oil, powers many machines.",
    // icon: require('../assets/icons/icon_fuel.png'), // Corrected path
    machine: "refinery",
    inputs: { crudeOil: 3 },
    output: { fuel: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  rubber: {
    id: "rubber", // Added ID
    name: "Rubber",
    type: "intermediateProduct",
    description: "Flexible polymer for various applications.",
    // icon: require('../assets/icons/icon_rubber.png'), // Corrected path
    machine: "refinery",
    inputs: { crudeOil: 5 },
    output: { rubber: 1, heavyOilResidue: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  plastic: {
    id: "plastic", // Added ID
    name: "Plastic",
    type: "intermediateProduct",
    description: "Polymer for various components.",
    // icon: require('../assets/icons/icon_plastic.png'), // Corrected path
    machine: "refinery",
    inputs: { crudeOil: 5 },
    output: { plastic: 1, heavyOilResidue: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  plasticAndHOR: {
    id: "plasticAndHOR", // Added ID
    name: "Plastic + HOR",
    type: "recipe",
    description: "Refining crude oil into plastic and heavy oil residue.",
    // icon: require('../assets/icons/icon_plasticAndHOR.png'), // Corrected path
    machine: "refinery",
    inputs: { crudeOil: 5 },
    output: { plastic: 1, heavyOilResidue: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  rubberAndHOR: {
    id: "rubberAndHOR", // Added ID
    name: "Rubber + HOR",
    type: "recipe",
    description: "Refining crude oil into rubber and heavy oil residue.",
    // icon: require('../assets/icons/icon_rubberAndHOR.png'), // Corrected path
    machine: "refinery",
    inputs: { crudeOil: 5 },
    output: { rubber: 1, heavyOilResidue: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  aluminaSolution: {
    id: "aluminaSolution", // Added ID
    name: "Alumina Solution",
    type: "intermediateProduct",
    description: "Precursor for aluminum production.",
    // icon: require('../assets/icons/icon_aluminaSolution.png'), // Corrected path
    machine: "refinery",
    inputs: { bauxite: 3 },
    output: { aluminaSolution: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  turbofuel: {
    id: "turbofuel", // Added ID
    name: "Turbofuel",
    type: "consumable",
    description: "High-octane fuel for advanced power generation.",
    // icon: require('../assets/icons/icon_turbofuel.png'), // Corrected path
    machine: "refinery",
    inputs: { fuel: 2, compactedCoal: 3 },
    output: { turbofuel: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  uraniumPellets: {
    id: "uraniumPellets", // Added ID
    name: "Uranium Pellets",
    type: "intermediateProduct",
    description: "Processed uranium, ready for encapsulation.",
    // icon: require('../assets/icons/icon_uraniumPellets.png'), // Corrected path
    machine: "refinery",
    inputs: { sulfuricAcid: 2, uranium: 3 },
    output: { uraniumPellets: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  packagedTurbofuel: {
    id: "packagedTurbofuel", // Added ID
    name: "Packaged Turbofuel",
    type: "consumable",
    description: "Turbofuel in a convenient package.",
    // icon: require('../assets/icons/icon_packagedTurbofuel.png'), // Corrected path
    machine: "refinery",
    inputs: { turbofuel: 2, cannisters: 1 },
    output: { packagedTurbofuel: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },
  petroleumCoke: {
    id: "petroleumCoke", // Added ID
    name: "Petroleum Coke",
    type: "consumable",
    description: "Solid fuel from heavy oil residue.",
    // icon: require('../assets/icons/icon_petroleumCoke.png'), // Corrected path
    machine: "refinery",
    inputs: { heavyOilResidue: 5 },
    output: { petroleumCoke: 1 },
    processingTime: 6,
    fuelConsumption: 2,
  },

  // BUILDABLE ITEMS (Machines that can be built by the player)
  miner: {
    id: "miner", // Added ID
    name: "Miner",
    description: "Automates the extraction of raw resources from resource nodes.",
    type: "buildable", // Changed type to 'buildable' for the BuildScreen
    // icon: require('../assets/icons/icon_miner.png'), // Corrected path
    inputs: { // Resources needed to build a Miner
      ironOre: 20,
      coal: 5,
    },
    output: { // When built, it adds 1 Miner to inventory
      miner: 1
    },
  },
  smelter: {
    id: "smelter", // Added ID
    name: "Smelter",
    description: "Processes raw ore into ingots.",
    type: "buildable", // Changed type to 'buildable'
    // icon: require('../assets/icons/icon_smelter.png'), // Corrected path
    inputs: {
      limestone: 10,
      ironOre: 10,
      coal: 15,
    },
    output: {
      smelter: 1
    },
  },
  constructor: {
    id: "constructor", // Added ID
    name: "Constructor",
    description: "Manufactures simple parts from basic materials.",
    type: "buildable", // Changed type to 'buildable'
    // icon: require('../assets/icons/icon_constructor.png'), // Corrected path
    inputs: {
      ironPlates: 8,
      ironRods: 4,
    },
    output: {
      constructor: 1
    },
  },
  assembler: {
    id: "assembler", // Added ID
    name: "Assembler",
    description: "Combines two input parts into a more complex one.",
    type: "buildable", // Changed type to 'buildable'
    // icon: require('../assets/icons/icon_assembler.png'), // Corrected path
    inputs: {
      reinforcedIronPlates: 5,
      rotors: 2,
      wires: 20,
    },
    output: {
      assembler: 1
    },
  },
  manufacturer: {
    id: "manufacturer", // Added ID
    name: "Manufacturer",
    description: "Combines four input parts into highly complex products.",
    type: "buildable", // Changed type to 'buildable'
    // icon: require('../assets/icons/icon_manufacturer.png'), // Corrected path
    inputs: {
      heavyModularFrames: 3,
      computers: 1,
      motors: 2,
      rubber: 10,
    },
    output: {
      manufacturer: 1
    },
  },
  refinery: {
    id: "refinery", // Added ID
    name: "Refinery",
    description: "Processes liquids and gases into various products.",
    type: "buildable", // Changed type to 'buildable'
    // icon: require('../assets/icons/icon_refinery.png'), // Corrected path
    inputs: {
      steelBeams: 5,
      steelPipes: 10,
      motors: 1,
    },
    output: {
      refinery: 1
    },
  },
  foundry: {
    id: "foundry", // Added ID
    name: "Foundry",
    description: "Combines two ingots into a third, more advanced ingot type (e.g., Steel).",
    type: "buildable", // Changed type to 'buildable'
    // icon: require('../assets/icons/icon_foundry.png'), // Corrected path
    inputs: {
      ironIngot: 10,
      coal: 10,
      ironPlates: 10,
    },
    output: {
      foundry: 1
    },
  },
  oilExtractor: {
    id: "oilExtractor", // Added ID
    name: "Oil Extractor",
    description: "Extracts crude oil from oil nodes.",
    type: "buildable", // Changed type to 'buildable'
    // icon: require('../assets/icons/icon_oilExtractor.png'), // Corrected path
    inputs: {
      steelBeams: 8,
      steelPipes: 15,
      motors: 2,
    },
    output: {
      oilExtractor: 1
    },
  },

  // ASSEMBLER Recipes (These are items produced by the Assembler)
  compactedCoal: {
    id: "compactedCoal", // Added ID
    name: "Compacted Coal",
    type: "intermediateProduct",
    description: "Denser coal for better fuel efficiency.",
    // icon: require('../assets/icons/icon_compactedCoal.png'), // Corrected path
    machine: "assembler",
    inputs: { coal: 2, sulfur: 1 },
    output: { compactedCoal: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  blackPowder: {
    id: "blackPowder", // Added ID
    name: "Black Powder",
    type: "intermediateProduct",
    description: "Explosive compound.",
    // icon: require('../assets/icons/icon_blackPowder.png'), // Corrected path
    machine: "assembler",
    inputs: { sulfur: 2, coal: 3 },
    output: { blackPowder: 1 }, // Corrected typo: blackPowwer -> blackPowder
    processingTime: 8,
    fuelConsumption: 2,
  },
  filters: {
    id: "filters", // Added ID
    name: "Filters",
    type: "intermediateProduct",
    description: "Used in gas masks and other air purifiers.",
    // icon: require('../assets/icons/icon_filters.png'), // Corrected path
    machine: "assembler",
    inputs: { coal: 2, rubber: 2 },
    output: { filters: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  rotors: {
    id: "rotors", // Added ID
    name: "Rotors",
    type: "intermediateProduct",
    description: "Spinning part of a motor.",
    // icon: require('../assets/icons/icon_rotors.png'), // Corrected path
    machine: "assembler",
    inputs: { ironRods: 2, screws: 3 },
    output: { rotors: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  reinforcedIronPlates: {
    id: "reinforcedIronPlates", // Added ID
    name: "Reinforced Iron Plates",
    type: "intermediateProduct",
    description: "Stronger iron plates for critical structures.",
    // icon: require('../assets/icons/icon_reinforcedIronPlates.png'), // Corrected path
    machine: "assembler",
    inputs: { screws: 3, ironPlates: 3 },
    output: { reinforcedIronPlates: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  encasedIndustrialBeams: {
    id: "encasedIndustrialBeams", // Added ID
    name: "Encased Industrial Beams",
    type: "intermediateProduct",
    description: "Structural beams with concrete reinforcement.",
    // icon: require('../assets/icons/icon_encasedIndustrialBeams.png'), // Corrected path
    machine: "assembler",
    inputs: { steelBeams: 4, concrete: 2 },
    output: { encasedIndustrialBeams: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  encasedUraniumCell: {
    id: "encasedUraniumCell", // Added ID
    name: "Encased Uranium Cell",
    type: "intermediateProduct",
    description: "Safe uranium cell for reactors.",
    // icon: require('../assets/icons/icon_encasedUraniumCell.png'), // Corrected path
    machine: "assembler",
    inputs: { uraniumPellets: 3, concrete: 4 },
    output: { encasedUraniumCell: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  stators: {
    id: "stators", // Added ID
    name: "Stators",
    type: "intermediateProduct",
    description: "Static part of a motor.",
    // icon: require('../assets/icons/icon_stators.png'), // Corrected path
    machine: "assembler",
    inputs: { steelPipes: 2, wires: 4 },
    output: { stators: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  circuitBoards: {
    id: "circuitBoards", // Added ID
    name: "Circuit Boards",
    type: "intermediateProduct",
    description: "Base for electronic components.",
    // icon: require('../assets/icons/icon_circuitBoards.png'), // Corrected path
    machine: "assembler",
    inputs: { plastic: 2, copperSheets: 4 },
    output: { circuitBoards: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  aiLimiter: {
    id: "aiLimiter", // Added ID
    name: "AI Limiter",
    type: "intermediateProduct",
    description: "Restricts AI functions to prevent uprisings.",
    // icon: require('../assets/icons/icon_aiLimiter.png'), // Corrected path
    machine: "assembler",
    inputs: { copperSheets: 2, quickwire: 3 },
    output: { aiLimiter: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  electromagneticControlRods: {
    id: "electromagneticControlRods", // Added ID
    name: "Electromagnetic Control Rods",
    type: "intermediateProduct",
    description: "Regulates nuclear reactions.",
    // icon: require('../assets/icons/icon_electromagneticControlRods.png'), // Corrected path
    machine: "assembler",
    inputs: { aiLimiter: 1, stators: 2 },
    output: { electromagneticControlRods: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  automatedWiring: {
    id: "automatedWiring", // Added ID
    name: "Automated Wiring",
    type: "intermediateProduct",
    description: "Complex wiring harness for automation.",
    // icon: require('../assets/icons/icon_automatedWiring.png'), // Corrected path
    machine: "assembler",
    inputs: { cables: 4, stators: 2 },
    output: { automatedWiring: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  modularFrames: {
    id: "modularFrames", // Added ID
    name: "Modular Frames",
    type: "intermediateProduct",
    description: "Versatile framework for modular construction.",
    // icon: require('../assets/icons/icon_modularFrames.png'), // Corrected path
    machine: "assembler",
    inputs: { ironRods: 4, reinforcedIronPlates: 2 },
    output: { modularFrames: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  smartPlatings: {
    id: "smartPlatings", // Added ID
    name: "Smart Platings",
    type: "intermediateProduct",
    description: "Advanced plating with embedded circuitry.",
    // icon: require('../assets/icons/icon_smartPlatings.png'), // Corrected path
    machine: "assembler",
    inputs: { rotors: 2, reinforcedIronPlates: 2 },
    output: { smartPlatings: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  motors: {
    id: "motors", // Added ID
    name: "Motors",
    type: "intermediateProduct",
    description: "Converts electrical energy into mechanical force.",
    // icon: require('../assets/icons/icon_motors.png'), // Corrected path
    machine: "assembler",
    inputs: { stators: 2, rotors: 2 },
    output: { motors: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  versatileFrameworks: {
    id: "versatileFrameworks", // Added ID
    name: "Versatile Frameworks",
    type: "intermediateProduct",
    description: "Highly adaptable construction frames.",
    // icon: require('../assets/icons/icon_versatileFrameworks.png'), // Corrected path
    machine: "assembler",
    inputs: { steelBeams: 4, modularFrames: 2 },
    output: { versatileFrameworks: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  aluminumSheets: {
    id: "aluminumSheets", // Added ID
    name: "Aluminum Sheets",
    type: "intermediateProduct",
    description: "Thin, lightweight aluminum panels.",
    // icon: require('../assets/icons/icon_aluminumSheets.png'), // Corrected path
    machine: "assembler",
    inputs: { aluminumIngot: 4, copperIngot: 2 }, // Assuming aluminumIngot exists
    output: { aluminumSheets: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },
  heatSink: {
    id: "heatSink", // Added ID
    name: "Heat Sink",
    type: "intermediateProduct",
    description: "Dissipates heat from electronic components.",
    // icon: require('../assets/icons/icon_heatSink.png'), // Corrected path
    machine: "assembler",
    inputs: { aluminumSheets: 5, copperSheets: 5 },
    output: { heatSink: 1 },
    processingTime: 8,
    fuelConsumption: 2,
  },

  // MANUFACTURER Recipes (These are items produced by the Manufacturer)
  iodineFilter: {
    id: "iodineFilter", // Added ID
    name: "Iodine Filter",
    type: "finalProduct",
    description: "Protects against hazardous gases.",
    // icon: require('../assets/icons/icon_iodineFilter.png'), // Corrected path
    machine: "manufacturer",
    inputs: { filters: 2, rubber: 2 },
    output: { iodineFilter: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  computers: {
    id: "computers", // Added ID
    name: "Computers",
    type: "finalProduct",
    description: "Programmable logic units for advanced automation.",
    // icon: require('../assets/icons/icon_computers.png'), // Corrected path
    machine: "manufacturer",
    inputs: { screws: 2, cables: 2, circuitBoards: 1 },
    output: { computers: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  highSpeedConnector: {
    id: "highSpeedConnector", // Added ID
    name: "High-Speed Connector",
    type: "intermediateProduct",
    description: "For rapid data transfer.",
    // icon: require('../assets/icons/icon_highSpeedConnector.png'), // Corrected path
    machine: "manufacturer",
    inputs: { quickwire: 2, cables: 2, circuitBoards: 2 },
    output: { highSpeedConnector: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  supercomputers: {
    id: "supercomputers", // Added ID
    name: "Supercomputers",
    type: "finalProduct",
    description: "The pinnacle of processing power.",
    // icon: require('../assets/icons/icon_supercomputers.png'), // Corrected path
    machine: "manufacturer",
    inputs: { aiLimiter: 1, highSpeedConnector: 2, computers: 1, screws: 4 },
    output: { supercomputers: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  crystalOscillator: {
    id: "crystalOscillator", // Added ID
    name: "Crystal Oscillator",
    type: "intermediateProduct",
    description: "Provides stable clock signals for electronics.",
    // icon: require('../assets/icons/icon_crystalOscillator.png'), // Corrected path
    machine: "manufacturer",
    inputs: { cables: 4, quartzCrystals: 2, reinforcedIronPlates: 2 },
    output: { crystalOscillator: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  nuclearFuelRods: {
    id: "nuclearFuelRods", // Added ID
    name: "Nuclear Fuel Rods",
    type: "consumable",
    description: "High-energy fuel for nuclear power plants.",
    // icon: require('../assets/icons/icon_nuclearFuelRods.png'), // Corrected path
    machine: "manufacturer",
    inputs: {
      encasedIndustrialBeams: 2,
      encasedUraniumCell: 1,
      electromagneticControlRods: 1,
    },
    output: { nuclearFuelRods: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  heavyModularFrames: {
    id: "heavyModularFrames", // Added ID
    name: "Heavy Modular Frames",
    type: "intermediateProduct",
    description: "Robust frames for heavy-duty construction.",
    // icon: require('../assets/icons/icon_heavyModularFrames.png'), // Corrected path
    machine: "manufacturer",
    inputs: { screws: 4, encasedIndustrialBeams: 2, steelPipes: 4 },
    output: { heavyModularFrames: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  modularEngines: {
    id: "modularEngines", // Added ID
    name: "Modular Engines",
    type: "intermediateProduct",
    description: "Powerful and adaptable engines.",
    // icon: require('../assets/icons/icon_modularEngines.png'), // Corrected path
    machine: "manufacturer",
    inputs: { smartPlatings: 5, motors: 1, rubber: 4 },
    output: { modularEngines: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  adaptiveControlUnits: {
    id: "adaptiveControlUnits", // Added ID
    name: "Adaptive Control Units",
    type: "finalProduct",
    description: "Advanced control systems for dynamic operations.",
    // icon: require('../assets/icons/icon_adaptiveControlUnits.png'), // Corrected path
    machine: "manufacturer",
    inputs: {
      heavyModularFrames: 1,
      circuitBoards: 4,
      automatedWiring: 1,
      computers: 1,
    },
    output: { adaptiveControlUnits: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  battery: {
    id: "battery", // Added ID
    name: "Battery",
    type: "consumable",
    description: "Stores electrical energy for portable devices.",
    // icon: require('../assets/icons/icon_battery.png'), // Corrected path
    machine: "manufacturer",
    inputs: { aluminumSheets: 4, wires: 2, sulfuricAcid: 4 },
    output: { battery: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  radioControlUnits: {
    id: "radioControlUnits", // Added ID
    name: "Radio Control Units",
    type: "intermediateProduct",
    description: "For wireless communication and control.",
    // icon: require('../assets/icons/icon_radioControlUnits.png'), // Corrected path
    machine: "manufacturer",
    inputs: { heatSink: 5, crystalOscillator: 2, supercomputers: 1 },
    output: { radioControlUnits: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
  turboMotors: {
    id: "turboMotors", // Added ID
    name: "Turbo Motors",
    type: "finalProduct",
    description: "Extremely powerful motors for high-performance applications.",
    // icon: require('../assets/icons/icon_turboMotors.png'), // Corrected path
    machine: "manufacturer",
    inputs: { heatSink: 5, rubber: 3, motors: 3, radioControlUnits: 2 },
    output: { turboMotors: 1 },
    processingTime: 16,
    fuelConsumption: 4,
  },
};