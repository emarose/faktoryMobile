This file contains concise, actionable guidance for AI coding assistants working on the Faktory Mobile codebase.

Keep edits small, focused, and consistent with the project's existing style (functional React components, hooks, and minimal inline styling). Prefer changes that are low-risk and easy to validate by running the app with Expo.

Key pointers
- Project type: Expo React Native app. Entry: `App.js`. Runs with `npm start` / `expo start`. Android: `npm run android`.
- Structure: UI lives under `src/screens`, reusable UI under `src/components`, domain logic in `src/hooks`, and static data in `src/data`. Global state uses `src/contexts`.
- Styling: Components rely on inline style objects and small `styles.js` files next to screens/components (look for `styles.js` alongside a screen). Keep CSS-like changes minimal and platform-agnostic.

Important files and patterns (reference examples)
- `App.js` — application bootstrap and top-level providers (wraps navigation and contexts).
- `src/contexts/GameContext.js` — central game state; prefer using provided context hooks instead of creating parallel state management.
- `src/hooks/*` — custom hooks encapsulate game logic (e.g., `useMining.js`, `useMachines.js`, `useGeneratedMapNodes.js`). Follow these conventions: pure functions where possible, side-effects inside hooks using useEffect, and return shapes matching existing callers.
- `src/data/items.js`, `src/data/nodeTypes.js` — canonical data shapes for items and nodes. When adding new items/nodes match the structure (id, name, output, capacity, etc.).
- `tools/check.js` — local analysis tool. Use it to run quick checks when modifying game-data or colors (see `Run Node Color Analysis` task in the workspace tasks).

Developer workflows
- Start app locally (Expo dev server):
  - Windows cmd.exe:
    npm install
    npm start
  - Or run on device/emulator:
    npm run android
    npm run ios
- The project uses Expo-managed flow; avoid introducing native modules unless absolutely necessary.

Conventions & expectations for edits
- Keep component props and hooks interfaces stable. Many components assume specific shapes (for example `node` objects with {id,name,x,y,type,capacity,currentAmount}`). Update related usages across `src/screens` and `src/components` when changing these shapes.
- Prefer adding new behavior in hooks (`src/hooks`) instead of scattering logic into components.
- Use small, optimistic UI updates for player interactions (e.g., manual mining). See `src/screens/MapScreen/components/NodeCard/NodeCard.js` for an example of local animation + state update pattern.
- Animations use `react-native` `Animated` API and the project already uses `react-native-reanimated`. Match existing style and keep animations performant (useNativeDriver where possible).

Integration points & external deps
- Expo and React Navigation are primary frameworks (`expo`, `@react-navigation/*`). Keep navigation changes centralized in `src/navigation`.
- Vector icons via `@expo/vector-icons`; many components import MaterialCommunityIcons.

Testing and validation
- There are no automated unit tests in the repo. Validate changes by running the app and exercising the relevant screens.
- Use `tools/check.js` for quick static checks when available.

Examples to copy-paste for common tasks
- Add a new item to `src/data/items.js` using existing object shapes (id keyed map). Search for existing item IDs (e.g., `ironOre`) to replicate fields like `name`, `color`, `output`.
- Add a small hook:
  - Put file in `src/hooks`, export default named hook.
  - Keep 1-2 responsibilities (derive data, encapsulate side effects) and reuse existing context hooks.

When in doubt
- Prefer minimal, local changes and keep behavior consistent with current UX (progress bars, depletion, mining rules). Document non-obvious assumptions inline in code comments.
- If making large changes (new navigation flows, native modules, or major data model changes), ask a human reviewer first and include a short migration plan.

Please review these instructions and tell me if you'd like more detail on any area (e.g., navigation, game rules, or data model examples).
