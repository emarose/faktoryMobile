# ⚠️ TESTING CHANGES - REVERT BEFORE PRODUCTION

**Created:** December 20, 2025

## Changes Made for Testing

These changes are **TEMPORARY** and must be reverted before sending a preview or releasing to production.

---

### 1. ✅ useInventory.js - Test Inventory Added
**File:** `src/hooks/useInventory.js` (lines 21-23)

**Current state:**
```javascript
// Testing inventory: Add 200 of each item
Object.keys(initialItems).forEach((key) => {
  initialItems[key].currentAmount = 200;
});
```

**Action needed:** 
- [ ] **DELETE** or comment out lines 21-23 to start with 0 items

---

### 2. ✅ GameContext.js - Save/Load Disabled
**File:** `src/contexts/GameContext.js` (lines 561-565)

**Current state:**
```javascript
// Load inventory and machines
const savedInventory = await loadData(STORAGE_KEYS.INVENTORY);
// TESTING: Comment out to use initial test inventory from useInventory
// if (savedInventory) {
//   setInventory(savedInventory);
// }
console.log("Skipping saved inventory load - using test data from useInventory");
```

**Action needed:**
- [ ] **UNCOMMENT** the if statement to restore save/load functionality
- [ ] Remove the console.log
- [ ] Should look like:
```javascript
const savedInventory = await loadData(STORAGE_KEYS.INVENTORY);
if (savedInventory) {
  setInventory(savedInventory);
}
```

---

## Quick Checklist Before Preview/Production:

- [ ] Revert `src/hooks/useInventory.js` (remove test inventory)
- [ ] Revert `src/contexts/GameContext.js` (restore save/load)
- [ ] Test that game properly saves and loads inventory
- [ ] Verify new players start with correct initial amounts (30 iron/copper/limestone/coal)
- [ ] Delete this file after changes are reverted

---

## Notes

These changes allow rapid testing by:
1. Starting with 200 of every item
2. Preventing saved data from overwriting test data

Without these reverts, production users will:
- Start with 200 of everything (game breaking)
- Not be able to save/load their inventory progress
