# 🏭 Faktory Mobile

A resource management and automation game built with React Native and Expo, inspired by factory-building games like Factorio.

## 🎮 About

Faktory Mobile is an idle/incremental factory game where you explore a procedurally generated map, mine resources, build production chains, and automate your growing industrial empire—all from your mobile device.

### Key Features

- **🗺️ Procedurally Generated Map** - Explore a tile-based world with resource nodes scattered across the terrain
- **⛏️ Resource Mining** - Manually mine or deploy automated miners on resource nodes
- **🏗️ Production Chains** - Build smelters, foundries, constructors, assemblers, and more to transform raw materials into complex products
- **📦 Inventory Management** - Manage your resources with a comprehensive inventory system
- **🎯 Milestone System** - Progress through milestones to unlock new machines and capabilities
- **🎵 Dynamic Music System** - Enjoy background music with volume controls and track selection
- **💾 Save/Load System** - Your progress is automatically saved and can be manually managed

### Game Mechanics

- **Mining**: Extract raw resources like iron ore, copper ore, coal, stone, and crude oil
- **Processing**: Refine raw materials into usable products (iron plates, copper wire, steel, etc.)
- **Crafting**: Combine processed materials into intermediate and advanced products
- **Automation**: Deploy machines on resource nodes to automate production
- **Discovery**: Explore the map to find new resource deposits
- **Building**: Place machines strategically to optimize your factory layout

## 🎨 Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development framework and tooling
- **React Navigation** - Screen navigation
- **React Native Reanimated** - Smooth animations
- **AsyncStorage** - Persistent data storage
- **Expo AV** - Audio playback for music

## 📱 Screens

- **Map Screen** - Main game view with grid-based exploration and player movement
- **Inventory** - View all collected resources and materials
- **Build** - Deploy machines on discovered resource nodes
- **Deployed Machines** - Manage your placed machines and their production
- **Factory Screens** - Individual screens for each machine type (Smelter, Foundry, Constructor, etc.)
- **Milestones** - Track your progress and unlock new content
- **Options** - Music controls, save/load, and game settings

## 🎯 Development

This is a private project built for personal enjoyment and learning. The codebase follows functional React patterns with hooks for state management and custom hooks for game logic.

Key architectural patterns:
- Context-based global state (GameContext, AudioContext, ToastContext)
- Custom hooks for domain logic (useMining, useMachines, useProduction, etc.)
- Component composition with reusable UI elements
- Data-driven design for items, nodes, and milestones

## 📝 Recent Updates

- Smooth player sprite animations with Reanimated
- Pathfinding system with visual trail dots
- Collision feedback when walking into obstacles
- Mini progress bars on mining nodes
- Improved grid styling with dashed borders
- Music controls refactored into separate component
- Production idle state management

## 🎵 Music Credits

Game includes original background music tracks. See [Music Setup Documentation](docs/MUSIC_SETUP.md) for details.

---

*Built with ❤️ and a lot of coffee*
