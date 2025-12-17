import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define storage keys
export const STORAGE_KEYS = {
  MILESTONES: '@faktory/milestones',
  PLAYER_POSITION: '@faktory/playerPosition',
  DISCOVERED_NODES: '@faktory/discoveredNodes',
  MACHINES: '@faktory/machines',
  INVENTORY: '@faktory/inventory',
  NODE_AMOUNTS: '@faktory/nodeAmounts',
  MAP_SEED: '@faktory/mapSeed',
  TOAST_SHOWN_NODE_IDS: '@faktory/toastShownNodeIds',
  CRAFTING_QUEUE: '@faktory/craftingQueue',
  SAVE_TIMESTAMP: '@faktory/saveTimestamp',
};

const useStorage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSaveData, setHasSaveData] = useState(false);

  // Save data to AsyncStorage
  const saveData = useCallback(async (key, data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.error(`Error saving data for key ${key}:`, e);
      return false;
    }
  }, []);

  // Load data from AsyncStorage
  const loadData = useCallback(async (key, defaultValue = null) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (e) {
      console.error(`Error loading data for key ${key}:`, e);
      return defaultValue;
    }
  }, []);

  // Delete specific data
  const deleteData = useCallback(async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error deleting data for key ${key}:`, e);
      return false;
    }
  }, []);

  // Delete all game data (for starting a new game)
  const deleteAllGameData = useCallback(async () => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      setHasSaveData(false);
      return true;
    } catch (e) {
      console.error('Error deleting all game data:', e);
      return false;
    }
  }, []);

  // Check if any save data exists
  const checkForSaveData = useCallback(async () => {
    try {
      setIsLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      const gameDataExists = keys.some(key => key.startsWith('@faktory/'));
      setHasSaveData(gameDataExists);
      setIsLoading(false);
      return gameDataExists;
    } catch (e) {
      console.error('Error checking for save data:', e);
      setIsLoading(false);
      return false;
    }
  }, []);

  // Load all game data at once
  const loadAllGameData = useCallback(async () => {
    try {
      setIsLoading(true);
      const keys = Object.values(STORAGE_KEYS);
      const stores = await AsyncStorage.multiGet(keys);
      
      const result = {};
      stores.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch (e) {
            console.error(`Error parsing data for key ${key}:`, e);
            result[key] = null;
          }
        } else {
          result[key] = null;
        }
      });
      
      setIsLoading(false);
      return result;
    } catch (e) {
      console.error('Error loading all game data:', e);
      setIsLoading(false);
      return {};
    }
  }, []);

  // Save all game data at once
  const saveAllGameData = useCallback(async (gameData) => {
    try {
      const pairs = Object.entries(gameData).map(([key, value]) => [
        key,
        JSON.stringify(value)
      ]);
      
      await AsyncStorage.multiSet(pairs);
      setHasSaveData(true);
      return true;
    } catch (e) {
      console.error('Error saving all game data:', e);
      return false;
    }
  }, []);

  // Initialize by checking if save data exists
  useEffect(() => {
    checkForSaveData();
  }, [checkForSaveData]);

  return {
    isLoading,
    hasSaveData,
    saveData,
    loadData,
    deleteData,
    deleteAllGameData,
    checkForSaveData,
    loadAllGameData,
    saveAllGameData,
  };
};

export default useStorage;