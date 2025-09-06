import { useMemo } from "react";
import { items } from "../../../../../data/items";
import { useMachineColors } from "../../../../../hooks";

/**
 * Hook that builds machine recipes data
 * @returns {Object} Object containing machineList and machineRecipes
 */
export const useMachineRecipes = () => {
  const { MACHINE_COLORS } = useMachineColors();
  
  return useMemo(() => {
    // Get all machines
    const machineIds = Object.keys(items).filter(
      (id) => items[id].type === "machine"
    );

    // For each machine, collect all products it can create
    const machineRecipes = {};

    machineIds.forEach((machineId) => {
      const machine = items[machineId];
      const machineColor = MACHINE_COLORS[machineId] || MACHINE_COLORS.default;
      const isMiningMachine = machineId === "miner" || machineId === "oilExtractor";

      if (isMiningMachine) {
        // For mining machines, we need to use the node resources
        // Find all nodes this machine can extract from
        const nodeIds = Object.keys(items).filter(id => 
          id.endsWith('_node') && 
          (items[id].machineRequired === machineId || 
          (!items[id].machineRequired && machineId === "miner"))
        );
        
        // Create recipe objects for each node
        const recipes = nodeIds.map(nodeId => {
          const node = items[nodeId];
          const outputResourceId = nodeId.replace('_node', '');
          
          // Get input materials for this machine
          const inputs = machine.inputs
            ? Object.keys(machine.inputs).map((inputId) => ({
                id: inputId,
                name: items[inputId]?.name || inputId,
                quantity: machine.inputs[inputId],
                color: items[inputId]?.machine
                  ? MACHINE_COLORS[items[inputId].machine] ||
                    MACHINE_COLORS.default
                  : "#8BC34A", // Green for raw materials
              }))
            : [];
            
          // Get output resources from the node
          const outputs = node.output
            ? Object.keys(node.output).map((outputId) => {
                return {
                  id: outputId,
                  name: items[outputId]?.name || outputId,
                  quantity: node.output[outputId],
                  color: machineColor,
                  nodeInfo: {
                    description: node.description || "",
                    manualMineable: node.manualMineable || false,
                    processingTime: node.processingTime || 1
                  }
                };
              })
            : [];
            
          return {
            id: outputResourceId, // Use the resource ID, not the node ID
            name: items[outputResourceId]?.name || node.name.replace(' Node', ''),
            inputs,
            outputs,
            processingTime: node.processingTime || 1,
            fuelConsumption: machine.fuelConsumption || 0
          };
        });
        
        machineRecipes[machineId] = {
          id: machineId,
          name: machine.name,
          color: machineColor,
          description: machine.description || "",
          recipes: recipes
        };
      } else {
        // Standard machines - find all products that can be made by this machine
        const products = Object.keys(items).filter((id) => {
          return items[id].machine === machineId && items[id].type !== "machine";
        });

        // Create recipe objects for each product
        const recipes = products.map((productId) => {
          const product = items[productId];

          // Get input materials for this recipe
          const inputs = product.inputs
            ? Object.keys(product.inputs).map((inputId) => ({
                id: inputId,
                name: items[inputId]?.name || inputId,
                quantity: product.inputs[inputId],
                color: items[inputId]?.machine
                  ? MACHINE_COLORS[items[inputId].machine] ||
                    MACHINE_COLORS.default
                  : "#8BC34A", // Green for raw materials
              }))
            : [];

          // Get output products
          const outputs = product.output
            ? Object.keys(product.output).map((outputId) => {
                return {
                  id: outputId,
                  name:
                    outputId === productId
                      ? product.name
                      : items[outputId]?.name || outputId,
                  quantity: product.output[outputId],
                  color: machineColor
                };
              })
            : [];

          return {
            id: productId,
            name: product.name,
            inputs,
            outputs,
            processingTime: product.processingTime || 1,
            fuelConsumption: product.fuelConsumption || 0,
          };
        });

        machineRecipes[machineId] = {
          id: machineId,
          name: machine.name,
          color: machineColor,
          description: machine.description || "",
          recipes: recipes,
        };
      }
    });

    // Create an array of machine objects for the tabs
    const machineList = machineIds.map((id) => ({
      id,
      name: items[id].name,
      color: MACHINE_COLORS[id] || MACHINE_COLORS.default,
      recipeCount: machineRecipes[id].recipes.length,
    }));

    return { machineList, machineRecipes };
  }, []);
};

export default useMachineRecipes;
