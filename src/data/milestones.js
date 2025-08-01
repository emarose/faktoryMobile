const milestones = [
    {
        id: "milestone0",
        name: "Manual Mining & Exploration",
        description: "Explore the world map and manually mine resources to begin progression.",
        unlocked: true,
        unlocks: [],
        requirements: {}, // No requirements for milestone0
    },
    {
        id: "milestone1",
        name: "Starter Tech",
        description: "Unlocks Smelter and Miner.",
        unlocked: false,
        unlocks: ["Smelter", "Miner"],
        requirements: { discoveredNodes: 1 }, // TODO: Implement discovered nodes tracking
    },
    {
        id: "milestone2",
        name: "Basic Automation",
        description: "Unlocks Constructor and basic recipes.",
        unlocked: false,
        unlocks: ["Constructor", "Iron Ingot", "Iron Plate", "Iron Rod"],
        requirements: { "Iron Ingot": 30 },
    },
    {
        id: "milestone3",
        name: "Advanced Materials",
        description: "Unlocks advanced machines and recipes.",
        unlocked: false,
        unlocks: ["Assembler", "Copper Ingot", "Wire", "Cable"],
        requirements: { "Wire": 50, "Cable": 20 },
    },
    {
        id: "milestone4",
        name: "Power & Logistics",
        description: "Unlocks power generation and conveyor belts.",
        unlocked: false,
        unlocks: ["Biomass Burner", "Conveyor Belt", "Splitter"],
        requirements: { "Biomass": 100 },
    },
];

export default milestones;
