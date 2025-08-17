import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

// Returns an array of basic resource objects from inventory, with id, name, icon, and currentAmount
export default function useBasicResources() {
  const { inventory } = useContext(GameContext);
  // These are the canonical IDs for basic resources in items.js
  const basicResourceIds = ["ironOre", "copperOre", "coal", "limestone"];
  return basicResourceIds.map((id) => {
    const item = inventory[id] || {};
    return {
      id,
      name: item.name || id,
      icon: item.icon || null,
      currentAmount: item.currentAmount || 0,
    };
  });
}
