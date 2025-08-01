import { useState, useEffect } from "react";
import useWorldMapExploration from "./useWorldMapExploration";


// Initial milestone data
const initialMilestones = [
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
        requirements: { discoveredNodes: 1 }, // Must discover at least 1 node
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

export function useMilestone(inventory) {
    const [milestones, setMilestones] = useState(initialMilestones);
    const [activeMilestone, setActiveMilestone] = useState(initialMilestones[0].id);
    const discoveredNodesObj = useWorldMapExploration();
    const discoveredNodesCount = discoveredNodesObj?.discoveredNodes ? Object.keys(discoveredNodesObj.discoveredNodes).length : 0;

    // Find the current milestone (first locked one)
    const currentMilestone = milestones.find(m => !m.unlocked);
    const unlockedMachineNames = milestones
        .filter(m => m.unlocked)
        .flatMap(m => m.unlocks);

    // Check if requirements for current milestone are met
    const canCompleteCurrentMilestone = currentMilestone
        ? Object.entries(currentMilestone.requirements || {}).every(
            ([itemId, requiredAmount]) => {
                if (itemId === "discoveredNodes") {
                    return discoveredNodesCount >= requiredAmount;
                }
                return (inventory[itemId]?.currentAmount || 0) >= requiredAmount;
            }
        )
        : false;

    // Complete milestone if requirements met
    const completeCurrentMilestone = () => {
        if (!currentMilestone || !canCompleteCurrentMilestone) return false;
        setMilestones(prev =>
            prev.map(m =>
                m.id === currentMilestone.id ? { ...m, unlocked: true } : m
            )
        );
        setActiveMilestone(currentMilestone.id);
        return true;
    };

    // Optionally auto-complete milestone when requirements met
    useEffect(() => {
        if (canCompleteCurrentMilestone) {
            // Uncomment below to auto-complete
            completeCurrentMilestone();
        }
    }, [canCompleteCurrentMilestone]);

    return {
        milestones,
        activeMilestone,
        currentMilestone,
        unlockedMachineNames,
        canCompleteCurrentMilestone,
        completeCurrentMilestone,
        setMilestones,
        setActiveMilestone,
    };
}

export default useMilestone;
