# Machine Colors Integration Summary

## Overview
Successfully moved the `useMachineColors` hook to a general hooks directory and integrated machine-specific colors and backgrounds across multiple screens for a consistent visual identity.

## Changes Made

### 1. Created General Hooks Directory
- **Location**: `src/hooks/`
- **Files**:
  - `useMachineColors.js` - Enhanced hook with utility functions
  - `index.js` - Barrel export file

### 2. Enhanced useMachineColors Hook
- Added utility functions:
  - `getMachineColor(machineId)` - Get color for specific machine
  - `getMachineColorWithOpacity(machineId, opacity)` - Get color with opacity for backgrounds
- Improved JSDoc documentation
- Added support for all machine types

### 3. Updated ProgressionTree Component
- Moved from local hook to general hook
- Updated imports to use `../../../../../hooks`
- Removed local `useMachineColors.js` file
- Updated hook exports

### 4. Enhanced BuildScreen
- **Features Added**:
  - Machine-specific border colors (left border with 4px width)
  - Machine-specific background colors (15% opacity)
  - Machine-specific icon placeholder colors
  - Machine-specific machine name colors
  - Machine-specific build button colors
- **Visual Improvements**:
  - Enhanced shadows for better depth
  - Rounded corners (border radius increased to 8px)
  - Better visual hierarchy

### 5. Enhanced DeployedMachinesScreen - MachineCard
- **Features Added**:
  - Machine-specific border colors (left border with 4px width)
  - Machine-specific background colors (10% opacity)
  - Machine-specific icon colors and backgrounds
  - Machine-specific machine name colors
  - Updated icon function to accept color parameter
- **Visual Improvements**:
  - Enhanced shadows and elevation
  - Better icon container styling
  - Support for all machine types (assembler, manufacturer, foundry, oilExtractor)

### 6. Enhanced ProductAssemblyScreen - MachineGridItem
- **Features Added**:
  - Machine-specific border colors (2px border)
  - Machine-specific background colors (20% opacity)
  - Machine-specific icon placeholder colors
  - Machine-specific machine name colors
- **Visual Improvements**:
  - Better border radius (12px for container, 8px for icon)
  - Enhanced typography
  - Added recipe text styling

## Machine Color Mapping
```javascript
const MACHINE_COLORS = {
  smelter: "#E57373",        // Reddish
  constructor: "#64B5F6",    // Light blue
  foundry: "#FFD54F",        // Yellow
  refinery: "#AB47BC",       // Purple
  assembler: "#26A69A",      // Teal
  manufacturer: "#FF7043",   // Orange
  miner: Colors.accentGreen, // Green from Colors
  oilExtractor: "#5D4037",   // Brown
  default: "#90A4AE",        // Grey blue
};
```

## Hook Usage
```javascript
import { useMachineColors } from "../../hooks";

const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();

// Get solid color
const machineColor = getMachineColor('smelter');

// Get color with opacity for backgrounds
const backgroundColor = getMachineColorWithOpacity('smelter', 0.15);
```

## Benefits
1. **Consistent Visual Identity**: All machine-related components now use the same color scheme
2. **Better UX**: Users can quickly identify machine types by color
3. **Maintainable Code**: Centralized color management
4. **Reusable Hook**: Can be used across all screens that display machines
5. **Enhanced Visuals**: Better shadows, borders, and visual hierarchy

## Files Modified
- `src/hooks/useMachineColors.js` (new)
- `src/hooks/index.js` (new)
- `src/screens/BuildScreen/BuildScreen.js`
- `src/screens/BuildScreen/styles.js`
- `src/screens/DeployedMachinesScreen/components/MachineCard/index.js`
- `src/screens/DeployedMachinesScreen/components/MachineCard/styles.js`
- `src/screens/ProductAssemblyScreen/components/MachineGridItem/MachineGridItem.js`
- `src/screens/ProductAssemblyScreen/components/ProgressionTree/hooks/useMachineRecipes.js`
- `src/screens/ProductAssemblyScreen/components/ProgressionTree/hooks/index.js`
- Deleted: `src/screens/ProductAssemblyScreen/components/ProgressionTree/hooks/useMachineColors.js`
