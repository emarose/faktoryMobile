# FAKTORY MOBILE TO GODOT 4.5 MIGRATION GUIDE
## Comprehensive Analysis & Implementation Roadmap

---

## EXECUTIVE SUMMARY

Faktory Mobile is a **factory-building/automation idle game** inspired by Satisfactory, built with React Native/Expo. The game features:
- **Procedurally generated resource nodes** on an explorable tile-based map
- **Resource extraction, processing, and crafting chains** (10+ machine types, 100+ items)
- **Progressive milestone system** (20 milestones unlocking new technologies)
- **Real-time production loops** with automated mining and manual mining options
- **Persistent save system** using AsyncStorage

---

## 1. CORE GAME MECHANICS BREAKDOWN

### 1.1 Mining & Resource Extraction

#### Manual Mining
- Player can manually mine basic resource nodes (Iron, Copper, Coal, Limestone)
- Each manual mine action yields `+1` resource instantly
- Visual feedback: ripple animation + mini toast "+1" notification
- Constrained by **storage capacity** (10,000 per resource)

#### Automated Mining
- **Miner machines** can be placed on resource nodes (max 4 per node)
- **Extractors** work similarly for crude oil nodes
- Each miner produces resources per second (default efficiency = 1.0)
- Nodes deplete over time: each active miner depletes 1 capacity per second
- **Auto-pause system**: miners pause when:
  - Node depletes (currentAmount ≤ 0)
  - Storage is full (currentAmount ≥ RESOURCE_CAP)
- **Auto-resume**: miners resume when storage has space AND node has capacity

#### Node Generation System
```javascript
// Procedural generation using mulberry32 PRNG
- Chunk-based (11x11 tiles per chunk)
- Seeded generation (reproducible worlds)
- Spawn chance: 5% per tile
- Weighted distribution (Iron/Copper/Coal 70%, Uranium 1%)
- 10 node types with varying rarity
```

**Key Data Structures:**
```javascript
Node: {
  id: string,
  name: string,
  type: string, // e.g., "ironOre_node"
  x: number,
  y: number,
  capacity: number, // default 1000
  currentAmount: number // tracks depletion
}
```

---

### 1.2 Production & Crafting System

#### Machine Types & Recipes
1. **Smelter**: Ores → Ingots (Iron Ore → Iron Ingot)
2. **Constructor**: Ingots → Basic parts (Iron Ingot → Iron Rods/Plates)
3. **Foundry**: Advanced ingots (Coal + Iron Ore → Steel Ingot)
4. **Assembler**: Multi-input parts (Iron Plates + Screws → Reinforced Plates)
5. **Refinery**: Fluids & chemicals (Crude Oil → Plastic/Rubber/Fuel)
6. **Manufacturer**: Complex products (Circuit Boards + AI Limiter → Computers)

#### Recipe Structure
```javascript
Recipe: {
  id: string,
  name: string,
  machine: string, // required machine type
  inputs: { [itemId]: amount },
  output: { [itemId]: amount } | [{ item, amount }],
  processingTime: number, // seconds
  fuelConsumption: number
}
```

#### Crafting Queue System
- Global queue tracked in GameContext
- Each crafting job has: machineId, recipeId, itemName, endsAt, status
- Status: `"pending"` → `"done"` (auto-cleanup after 2s)
- Manual crafting: instant resource deduction + output
- Queue processing: 1-second tick checks endsAt timestamp

---

### 1.3 Exploration & Discovery

#### Map System
- **Tile-based grid** (30px tiles, 11x11 viewport)
- **Player position**: x/y coordinates
- **Movement**: 4-directional (blocked by resource nodes)
- **Discovery radius**: ~47px (circular area around player)

#### Discovery Mechanics
```javascript
- Nodes become visible when within discovery radius
- Toast notification on first discovery: "Found new node: [Name] at (x, y)"
- Persistent tracking via `discoveredNodes` object: { [nodeId]: true }
- Auto-pin closest discovered node in range
```

---

### 1.4 Milestone Progression

**20 Milestones** with cumulative unlocks:

| Milestone | Requirements | Unlocks |
|-----------|-------------|---------|
| #1 | 2 nodes discovered, 10 Iron/Copper, 5 Coal | Smelter, Miner |
| #2 | 20 Iron Ingots, 5 Concrete | Constructor |
| #3 | 15 Iron Rods, 10 Plates, 20 Screws | Assembler |
| #4 | 15 Copper Ingots, 25 Wires | Foundry, Extractor |
| ... | ... | ... |
| #20 | 1 Nuclear Fuel Rod, 10 nodes discovered | Master Industrialist |

**Unlock System:**
- Machines become buildable only after milestone completion
- UI filters: locked items grayed out with "🔒 Locked"
- Auto-completion: triggers when requirements met (debounced)

---

## 2. STATE MANAGEMENT ARCHITECTURE

### 2.1 GameContext (Central State)

```javascript
GameContext provides:
  - inventory: { [itemId]: { id, name, currentAmount, ... } }
  - ownedMachines: [{ id, type, currentRecipeId }]
  - placedMachines: [{ id, type, assignedNodeId, isIdle, efficiency }]
  - allResourceNodes: [Node]
  - discoveredNodes: { [nodeId]: boolean }
  - nodeAmounts: { [nodeId]: number } // depletion tracking
  - playerMapPosition: { x, y }
  - milestones: [Milestone]
  - craftingQueue: [CraftingJob]
  - Functions: addResource, removeResources, placeMachine, buildItem, etc.
```

### 2.2 Hook-Based Logic Separation

| Hook | Responsibility |
|------|---------------|
| `useInventory` | Add/remove items, check affordability, owned machines |
| `useMachines` | Place machines, pause/resume miners, track assignments |
| `useProduction` | 1-second tick production loop (passive generation) |
| `useMining` | Manual mining logic |
| `useBuilding` | Construct machines from inventory resources |
| `useCrafting` | Manual crafting + active crafts tracking |
| `useGeneratedMapNodes` | Procedural node generation from seed |
| `useMilestone` | Check/complete milestones, unlock progression |
| `useStorage` | AsyncStorage save/load (9 storage keys) |

---

## 3. UI/UX PATTERNS

### 3.1 Screen Structure

**Core Screens (Bottom Tab Navigator):**
1. **FactoryScreen** (Home): Milestone card, resource overview, navigation grid
2. **MapScreen**: Tile grid, player sprite, discovery radius, node cards
3. **BuildScreen**: Scrollable machine cards with build buttons
4. **DeployedMachinesScreen**: Tabbed view of all placed/owned machines
5. **InventoryScreen**: Grid of crafted items with quantities

**Machine Screens (Stack Navigator):**
- SmelterScreen, ConstructorScreen, FoundryScreen, etc.
- Each shows: available recipes, queue management, machine stats

### 3.2 Component Patterns

#### Progress Bars
- Node depletion: `currentAmount / capacity`
- Crafting progress: `(now - startedAt) / processingTime`

#### Bottom Sheets
- Node details with deploy/mine actions
- Inventory quick-view on map

#### Gradient Overlays
- `LinearGradient` used extensively for backgrounds
- Cyan (#00ffff) & Magenta (#ff00cc) primary accent colors

---

## 4. DATA STRUCTURES & SCHEMAS

### 4.1 Items.js (100+ Definitions)

```javascript
{
  id: "ironIngot",
  name: "Iron Ingot",
  type: "intermediateProduct", // rawMaterial | intermediateProduct | finalProduct | machine
  description: "Refined iron bar.",
  machine: "smelter", // required machine
  inputs: { ironOre: 2 },
  output: { ironIngot: 1 },
  processingTime: 2,
  fuelConsumption: 0.1,
  icon: "./assets/icons/ironIngot.png"
}
```

**Item Types:**
- **rawMaterial**: Mined from nodes
- **intermediateProduct**: Crafted from other items
- **finalProduct**: End-game complex items
- **machine**: Buildable production buildings

### 4.2 Node Types

```javascript
NODE_TYPES_MAP = [
  { type: "ironOre_node", name: "Iron Ore", color: "#d8dadbff" },
  { type: "copperOre_node", name: "Copper Ore", color: "#b88333ff" },
  // ... 10 total types
]

NODE_SPAWN_RATES = {
  ironOre_node: { ratio: 70, capacity: 1000, output: { ironOre: 1 } },
  uranium_node: { ratio: 1, capacity: 1000, output: { uranium: 1 } }
}
```

### 4.3 Milestone Schema

```javascript
{
  id: "milestone1",
  name: "Basic Resource Gathering",
  description: "...",
  requirementsDescription: "...",
  unlocked: false,
  unlocks: ["Smelter", "Miner"],
  requirements: { 
    discoveredNodes: 2, 
    ironOre: 10, 
    copperOre: 10, 
    coal: 5 
  }
}
```

---

## 5. CRITICAL GAME LOOPS & TIMING

### 5.1 Production Loop (1000ms interval)

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    // 1. Update crafting queue (check endsAt timestamps)
    updateCraftingQueue();
    
    // 2. Process all active miners
    Object.entries(machinesByNode).forEach(([nodeId, machines]) => {
      const node = getNode(nodeId);
      const nodeAmount = nodeAmounts[nodeId];
      
      if (nodeAmount <= 0) {
        pauseAllMinersOnNode(nodeId); // system pause
        return;
      }
      
      const resourceId = getResourceIdFromNode(node);
      const currentStorage = inventory[resourceId].currentAmount;
      
      if (currentStorage >= RESOURCE_CAP) {
        pauseAllMinersOnNode(nodeId); // storage full
        return;
      }
      
      const totalOutput = machines.reduce((sum, m) => 
        sum + output[resourceId] * m.efficiency, 0
      );
      
      depletNode(nodeId, machines.length); // -1 per miner
      addResource(resourceId, totalOutput);
    });
  }, 1000);
}, [dependencies]);
```

### 5.2 Auto-Resume Loop (2000ms interval)

```javascript
// Periodically check idle miners for resume conditions
useEffect(() => {
  const interval = setInterval(() => {
    idleMiners.forEach(machine => {
      const node = getNode(machine.assignedNodeId);
      const resourceId = getResourceIdFromNode(node);
      const storage = inventory[resourceId].currentAmount;
      const nodeAmount = nodeAmounts[node.id];
      
      if (storage < RESOURCE_CAP && nodeAmount > 0) {
        resumeMiner(machine.id, { system: true }); // only system-paused
      }
    });
  }, 2000);
}, [dependencies]);
```

### 5.3 Discovery Loop

```javascript
// On player position change
useEffect(() => {
  const tileRadius = Math.ceil(DISCOVERY_RADIUS_PX / TILE_SIZE);
  const nodesInRange = allResourceNodes.filter(node => {
    const dx = node.x - playerMapPosition.x;
    const dy = node.y - playerMapPosition.y;
    return dx*dx + dy*dy <= tileRadius*tileRadius;
  });
  
  const newDiscoveries = nodesInRange.filter(n => !discoveredNodes[n.id]);
  if (newDiscoveries.length > 0) {
    setDiscoveredNodes(prev => ({ ...prev, ...Object.fromEntries(
      newDiscoveries.map(n => [n.id, true])
    )}));
  }
}, [playerMapPosition, allResourceNodes]);
```

---

## 6. ASSET INVENTORY

### 6.1 Images

**Backgrounds:**
- `background-tileable.png` (main tileable texture)

**Icons (16x16 - 64x64):**
- Resource node icons: ironOreNode, copperOreNode, coal, limestone, etc.
- Machine icons: miner, smelter, constructor, assembler, foundry, refinery, manufacturer
- Item icons: ironIngot, ironRods, screws, circuits, computers, etc.
- UI icons: tab navigation, buttons, frames

**UI Elements:**
- Card backgrounds (worldMap, buildMachines)
- Nine-slice frames
- Player sprite (player-sprite.png)

### 6.2 Fonts

- Bitcount Grid Single
- Pixelify Sans (static variants)
- Press Start 2P
- Space Mono

### 6.3 Audio

**6 Background Music Tracks:**
- track1.mp3 - "Lamerios Tema"
- track2.mp3 - "El Equilibrio Perfecto"
- track3.mp3 - "The Antidote"
- track4.mp3 - "Jazz Nº1"
- track5.mp3 - "Negativo"
- track6.mp3 - "Otoño"

**Audio System:**
- Continuous playback with auto-track-change
- Volume control (default 0.2)
- Mute toggle
- Plays in background (iOS silent mode compatible)

---

## 7. REACT NATIVE SPECIFIC PATTERNS

### 7.1 Navigation

```javascript
// Stack Navigator (main)
<NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Root" component={BottomTabNavigator} />
    <Stack.Screen name="MapScreen" component={MapScreen} />
    <Stack.Screen name="BuildScreen" component={BuildScreen} />
    // ... machine screens
  </Stack.Navigator>
</NavigationContainer>

// Bottom Tab Navigator
<BottomTab.Navigator>
  <BottomTab.Screen name="Factory" component={FactoryScreen} />
  // Custom tab bar with gradient buttons
</BottomTab.Navigator>
```

### 7.2 Styling Patterns

- **Inline styles + StyleSheet.create()** per component
- **LinearGradient backgrounds** everywhere
- **Colors.js constants** for theme consistency
- **Responsive sizing**: uses dimensions but mostly fixed px values
- **Shadows/borders**: `shadowColor`, `shadowRadius`, `borderWidth`

### 7.3 Animations

```javascript
// Animated values
const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true
}).start();

<Animated.View style={{ opacity: fadeAnim }}>
```

**Used for:**
- Manual mine ripple effect (scale + opacity)
- Mini toast fade-in/out
- Bottom sheet slide-up
- Progress bar fills

### 7.4 Persistence

```javascript
// AsyncStorage wrapper
const { saveData, loadData } = useStorage();

// Save game state
await Promise.all([
  saveData(STORAGE_KEYS.INVENTORY, inventory),
  saveData(STORAGE_KEYS.MACHINES, placedMachines),
  saveData(STORAGE_KEYS.PLAYER_POSITION, playerMapPosition),
  // ... 9 total keys
]);

// Load on app start
const savedInventory = await loadData(STORAGE_KEYS.INVENTORY);
```

---

## 8. GODOT 4.5 MIGRATION STRATEGY

### 8.1 Architecture Mapping

| React Native | Godot 4.5 | Notes |
|-------------|-----------|-------|
| GameContext (React Context) | **Autoload Singleton** (GameManager.gd) | Global state manager with signals |
| Hooks (useX) | **Utility Scripts** (ResourceManager.gd, MachineController.gd) | Static classes or autoloads |
| Components (JSX) | **Scenes + Scripts** (.tscn + .gd) | NodeCard.tscn, MachineCard.tscn |
| Navigation Stack | **SceneTree change_scene_to_file()** | ScreenManager autoload |
| AsyncStorage | **File-based save system** (user://) | JSON export/import |
| StyleSheet/Colors | **Theme resource** (.tres) | Centralized UI theme |
| Animated API | **Tween nodes** | AnimationPlayer for complex sequences |

### 8.2 Core Systems Implementation

#### A. Singleton Game Manager (GameManager.gd)

```gdscript
extends Node

signal inventory_changed(item_id: String, amount: int)
signal machine_placed(machine: Dictionary)
signal milestone_completed(milestone: Dictionary)

var inventory: Dictionary = {}
var owned_machines: Array[Dictionary] = []
var placed_machines: Array[Dictionary] = []
var discovered_nodes: Dictionary = {}
var node_amounts: Dictionary = {}
var player_position: Vector2i = Vector2i(5, 5)
var milestones: Array[Dictionary] = []
var crafting_queue: Array[Dictionary] = []

func add_resource(item_id: String, amount: int, source_node_id: String = ""):
    if not inventory.has(item_id):
        inventory[item_id] = create_inventory_item(item_id)
    
    var current = inventory[item_id].currentAmount
    var new_amount = min(current + amount, RESOURCE_CAP)
    inventory[item_id].currentAmount = new_amount
    inventory_changed.emit(item_id, new_amount)

func remove_resources(required: Dictionary) -> bool:
    # Check affordability first
    for item_id in required:
        if inventory.get(item_id, {}).get("currentAmount", 0) < required[item_id]:
            return false
    
    # Deduct
    for item_id in required:
        inventory[item_id].currentAmount -= required[item_id]
        inventory_changed.emit(item_id, inventory[item_id].currentAmount)
    
    return true

# ... other functions
```

#### B. Node Generation (ProceduralMap.gd)

```gdscript
extends Node2D

const CHUNK_SIZE = 11
const TILE_SIZE = 30
const NODE_SPAWN_CHANCE = 0.05

var seed_value: int = 0
var loaded_chunks: Dictionary = {}

func generate_chunk(cx: int, cy: int) -> Array[Dictionary]:
    var nodes: Array[Dictionary] = []
    var chunk_seed = (seed_value & 0xFFFFF) ^ (cx * 73856093) ^ (cy * 19349663)
    
    for x in CHUNK_SIZE:
        for y in CHUNK_SIZE:
            var global_x = cx * CHUNK_SIZE + x
            var global_y = cy * CHUNK_SIZE + y
            var cell_seed = chunk_seed ^ (x * 83492791) ^ (y * 1234567)
            var rng = mulberry32(cell_seed)
            
            if rng.randf() < NODE_SPAWN_CHANCE:
                var node_type = select_node_type(rng)
                nodes.append({
                    "id": "%s_%d_%d" % [node_type, global_x, global_y],
                    "type": node_type,
                    "x": global_x,
                    "y": global_y,
                    "capacity": 1000,
                    "currentAmount": 1000
                })
    
    return nodes

func mulberry32(seed: int) -> RandomNumberGenerator:
    var rng = RandomNumberGenerator.new()
    rng.seed = seed
    return rng
```

#### C. Production Loop (ProductionManager.gd)

```gdscript
extends Node

var production_timer: Timer

func _ready():
    production_timer = Timer.new()
    production_timer.wait_time = 1.0
    production_timer.autostart = true
    production_timer.timeout.connect(_on_production_tick)
    add_child(production_timer)

func _on_production_tick():
    update_crafting_queue()
    process_miners()

func process_miners():
    var machines_by_node = {}
    
    for machine in GameManager.placed_machines:
        if machine.type in ["miner", "Extractor"] and machine.has("assignedNodeId"):
            if machine.get("isIdle", false):
                continue
            
            if not machines_by_node.has(machine.assignedNodeId):
                machines_by_node[machine.assignedNodeId] = []
            machines_by_node[machine.assignedNodeId].append(machine)
    
    for node_id in machines_by_node:
        var machines = machines_by_node[node_id]
        var node = get_node_by_id(node_id)
        var node_amount = GameManager.node_amounts.get(node_id, node.capacity)
        
        if node_amount <= 0:
            for m in machines:
                pause_miner(m.id, true) # system pause
            continue
        
        var resource_id = get_resource_from_node(node)
        var storage = GameManager.inventory.get(resource_id, {}).get("currentAmount", 0)
        
        if storage >= GameManager.RESOURCE_CAP:
            for m in machines:
                pause_miner(m.id, true)
            continue
        
        var total_output = 0
        for m in machines:
            total_output += node.output[resource_id] * m.get("efficiency", 1.0)
        
        var depletion = machines.size()
        GameManager.deplete_node(node_id, node_amount - depletion)
        GameManager.add_resource(resource_id, total_output, node_id)
```

#### D. UI System

**Scene Structure:**
```
Main.tscn
├── GameManager (autoload)
├── CanvasLayer (UI)
│   ├── ScreenManager
│   │   ├── MapScreen (scene instance)
│   │   ├── FactoryScreen (hidden)
│   │   └── BuildScreen (hidden)
│   └── TopBar (always visible)
└── World (for map tiles/nodes)
```

**MapScreen.tscn:**
```
MapScreen (Control)
├── TileMap (TileMapLayer) - Grid rendering
├── PlayerSprite (Sprite2D) - Animated player
├── DiscoveryRadius (Polygon2D) - Visual indicator
├── NodeContainer (Control) - Dynamically spawned NodeCards
├── ControlPanel (VBoxContainer)
│   ├── DirectionPad (GridContainer)
│   │   ├── UpButton (TextureButton)
│   │   ├── DownButton
│   │   ├── LeftButton
│   │   └── RightButton
│   └── InfoLabel (RichTextLabel) - Position display
└── BottomSheet (Panel) - Node details
```

**NodeCard UI (Control script):**
```gdscript
extends Control

var node_data: Dictionary

@onready var name_label = $VBox/NameLabel
@onready var progress_bar = $VBox/ProgressBar
@onready var mine_button = $VBox/MineButton

func _ready():
    update_ui()

func update_ui():
    name_label.text = node_data.name
    progress_bar.value = float(node_data.currentAmount) / node_data.capacity
    mine_button.disabled = node_data.currentAmount <= 0

func _on_mine_button_pressed():
    GameManager.manual_mine(node_data.id)
    update_ui()
```

#### E. Save System

```gdscript
# SaveManager.gd (autoload)
extends Node

const SAVE_PATH = "user://faktory_save.json"

func save_game():
    var save_data = {
        "version": "1.0",
        "timestamp": Time.get_unix_time_from_system(),
        "player_position": {
            "x": GameManager.player_position.x,
            "y": GameManager.player_position.y
        },
        "inventory": GameManager.inventory,
        "owned_machines": GameManager.owned_machines,
        "placed_machines": GameManager.placed_machines,
        "discovered_nodes": GameManager.discovered_nodes,
        "node_amounts": GameManager.node_amounts,
        "milestones": GameManager.milestones,
        "crafting_queue": GameManager.crafting_queue,
        "map_seed": ProceduralMap.seed_value
    }
    
    var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(save_data, "\t"))
        file.close()
        return true
    return false

func load_game() -> bool:
    if not FileAccess.file_exists(SAVE_PATH):
        return false
    
    var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
    if not file:
        return false
    
    var json_string = file.get_as_text()
    file.close()
    
    var json = JSON.new()
    var parse_result = json.parse(json_string)
    if parse_result != OK:
        return false
    
    var save_data = json.get_data()
    
    # Restore state
    GameManager.player_position = Vector2i(
        save_data.player_position.x,
        save_data.player_position.y
    )
    GameManager.inventory = save_data.inventory
    GameManager.placed_machines = save_data.placed_machines
    GameManager.discovered_nodes = save_data.discovered_nodes
    GameManager.node_amounts = save_data.node_amounts
    GameManager.milestones = save_data.milestones
    GameManager.crafting_queue = save_data.crafting_queue
    ProceduralMap.seed_value = save_data.map_seed
    
    return true
```

### 8.3 Asset Migration

#### Images:
- Convert PNG icons to Godot `Texture2D` resources
- Create `AtlasTexture` for sprite sheets (if converting to tilemap)
- Nine-slice: Use Godot's `NinePatchRect` nodes with texture regions

#### Fonts:
- Import TTF/OTF fonts
- Create `FontFile` resources
- Apply to `Theme` resource for global consistency

#### Audio:
- Import MP3 as `AudioStreamMP3` resources
- Create `AudioStreamPlayer` autoload for background music
- Use `AudioStreamPlayer2D` for positional SFX (future)

```gdscript
# MusicManager.gd (autoload)
extends AudioStreamPlayer

var tracks: Array[AudioStream] = [
    preload("res://assets/sounds/track1.mp3"),
    preload("res://assets/sounds/track2.mp3"),
    # ...
]
var current_track_index = 0

func _ready():
    finished.connect(_on_track_finished)
    play_track(0)

func play_track(index: int):
    if index >= 0 and index < tracks.size():
        stream = tracks[index]
        play()
        current_track_index = index

func _on_track_finished():
    current_track_index = (current_track_index + 1) % tracks.size()
    play_track(current_track_index)
```

### 8.4 Performance Considerations

#### Optimizations vs React Native:

| React Native Issue | Godot Solution |
|-------------------|----------------|
| FlatList virtualization | Use `ItemList` or custom viewport culling |
| Multiple re-renders from state changes | Signals only update affected nodes |
| Heavy JSON parsing for save/load | Binary serialization (`var_to_bytes`) |
| Animated ripple effects | GPU-accelerated shaders for particles |
| Interval-based loops | Godot's `_process()` and `Timer` nodes |

#### Godot-Specific Gains:
- **TileMapLayer**: Hardware-accelerated tile rendering (vs React Native grid of Views)
- **Multithread support**: Background node generation without blocking UI
- **Node pooling**: Reuse NodeCard scenes instead of re-creating
- **Shader animations**: Custom GLSL for progress bars, glows

---

## 9. MIGRATION CHECKLIST

### Phase 1: Foundation (Week 1)
- [ ] Create Godot project structure
- [ ] Set up autoload singletons (GameManager, SaveManager, ProceduralMap)
- [ ] Import and organize assets (icons, fonts, audio)
- [ ] Create UI theme resource with color constants
- [ ] Implement basic scene manager for screen transitions

### Phase 2: Core Systems (Week 2-3)
- [ ] Implement items database (JSON → Dictionary)
- [ ] Build procedural map generation (seed + chunk system)
- [ ] Create inventory system (add/remove/check affordability)
- [ ] Implement machine placement logic
- [ ] Build production loop with timers

### Phase 3: UI Screens (Week 3-4)
- [ ] MapScreen with TileMap + player movement
- [ ] FactoryScreen dashboard with cards
- [ ] BuildScreen with machine list + build buttons
- [ ] DeployedMachinesScreen with tabs
- [ ] InventoryScreen grid view

### Phase 4: Advanced Features (Week 4-5)
- [ ] Crafting queue system
- [ ] Milestone progression + unlock logic
- [ ] Node depletion + auto-pause/resume
- [ ] Discovery system + toast notifications
- [ ] Bottom sheets for node/machine details

### Phase 5: Polish & Testing (Week 5-6)
- [ ] Animations (manual mine ripple, progress bars)
- [ ] Audio system (background music, SFX)
- [ ] Save/load system with validation
- [ ] Performance profiling + optimizations
- [ ] Playtesting + bug fixes

### Phase 6: Export & Release (Week 6)
- [ ] Configure export presets (Android/iOS/Desktop)
- [ ] Test on target devices
- [ ] Package assets (compression, optimization)
- [ ] Final QA pass
- [ ] Release build

---

## 10. POTENTIAL CHALLENGES & SOLUTIONS

| Challenge | React Native Approach | Godot Solution |
|-----------|----------------------|----------------|
| **60fps animations** | Animated API can drop frames | AnimationPlayer + Tweens are frame-perfect |
| **Large inventory lists** | FlatList with `getItemLayout` | ItemList with `VScrollBar` culling |
| **Persistent timers** | `setInterval` cleared on unmount | Timer nodes survive scene changes if in autoload |
| **Responsive layouts** | FlexBox + Dimensions API | Anchors + Containers (VBox/HBox/Grid) |
| **Hot reload** | Expo fast refresh | Godot editor live editing |
| **Save data migration** | Manual AsyncStorage versioning | JSON schema validator + fallback defaults |

---

## 11. RECOMMENDED GODOT RESOURCES

### Plugins/Addons:
- **Dialogue Manager**: For future tutorial system
- **GodotXLSX**: If migrating to spreadsheet-based item data
- **GodotJsonData**: Helper for JSON database handling

### Learning Resources:
- [Godot Docs - Autoloads](https://docs.godotengine.org/en/stable/tutorials/scripting/singletons_autoload.html)
- [TileMap Tutorial](https://docs.godotengine.org/en/stable/tutorials/2d/using_tilemaps.html)
- [Signal System Guide](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html)
- [Save/Load Tutorial](https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html)

---

## 12. FINAL NOTES

### Why Migrate?
- **Performance**: Godot's native rendering outperforms React Native for grid-based games
- **Cross-platform**: Single codebase for mobile, desktop, web (same as Expo)
- **Battery life**: Native engine = less overhead vs JS bridge
- **Offline-first**: No dependency on Metro bundler or network

### Migration Timeline:
Estimated **6 weeks** for full parity with current React Native version (solo developer).

### Post-Migration Enhancements:
- Particle effects for mining/production
- Zoom levels for map (not feasible in React Native)
- Custom shaders for resource flow visualization
- Multiplayer potential (Godot's high-level networking)

---

**END OF GUIDE**

This document provides a complete blueprint for migrating Faktory Mobile from React Native/Expo to Godot 4.5. All game mechanics, data structures, and UI patterns have been documented with direct Godot equivalents. The codebase is well-structured with clear separation of concerns via hooks, making the translation to Godot's autoload/signal pattern straightforward.
