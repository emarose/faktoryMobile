# Machine Card Fixes Required

All recipe-based machine cards (Foundry, Assembler, Refinery) need identical structure to SmelterCard.
OilExtractorCard needs identical structure to MinerCard.

## Common Issues Found:
1. Collapsed view missing the Change/Assign button (should be styled like Smelter/Miner)
2. Collapsed view missing proper status badge (should use selectedNodePill with border)
3. Duplicate collapsed views in multiple files
4. Expanded view not wrapped in LinearGradient with proper styling
5. Expanded view missing proper header with icon and badges

## Pattern to Follow:

### Recipe-based machines (Constructor, Foundry, Assembler, Refinery):
- Follow SmelterCard.js exactly
- Collapsed view: icon + name | status badge + button
- Expanded processing: LinearGradient wrapper, icon header, queue badge, status badge, progress controls
- Expanded idle: LinearGradient wrapper showing ready state

### Node-based machines (OilExtractor):
- Follow MinerCard.js exactly  
- Collapsed view: icon + name | status badge + button
- Expanded: LinearGradient wrapper, node info, depletion progress, pause/detach controls

## Files to Fix:
- FoundryCard.js - has duplicate collapsed view
- AssemblerCard.js - has duplicate collapsed view
- RefineryCard.js - has duplicate collapsed view
- OilExtractorCard.js - needs MinerCard pattern

ConstructorCard.js has been partially fixed but needs review.
