"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface SavedValue {
  id: string;
  name: string;
  value: number;
  source: string; // Where this value came from (e.g., "Investment Calculator")
  type: "currency" | "percentage" | "number";
  createdAt: string;
}

interface SavedValuesContextType {
  savedValues: SavedValue[];
  saveValue: (value: Omit<SavedValue, "id" | "createdAt">) => void;
  updateValue: (id: string, updates: Partial<Pick<SavedValue, "name">>) => void;
  deleteValue: (id: string) => void;
  getValue: (id: string) => SavedValue | undefined;
  clearAll: () => void;
}

const SavedValuesContext = createContext<SavedValuesContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "finance-calculator-saved-values";

/**
 * Load saved values from localStorage
 */
const loadSavedValues = (): SavedValue[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load saved values:", error);
    return [];
  }
};

/**
 * Save values to localStorage
 */
const storeSavedValues = (values: SavedValue[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch (error) {
    console.error("Failed to store saved values:", error);
  }
};

interface SavedValuesProviderProps {
  children: ReactNode;
}

/**
 * Provider component for saved values functionality
 */
export function SavedValuesProvider({ children }: SavedValuesProviderProps) {
  const [savedValues, setSavedValues] = useState<SavedValue[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved values on mount
  useEffect(() => {
    const loaded = loadSavedValues();
    setSavedValues(loaded);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (isLoaded) {
      storeSavedValues(savedValues);
    }
  }, [savedValues, isLoaded]);

  /**
   * Save a new value
   */
  const saveValue = (valueData: Omit<SavedValue, "id" | "createdAt">) => {
    const newValue: SavedValue = {
      ...valueData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setSavedValues((prev) => [newValue, ...prev]);
  };

  /**
   * Update an existing saved value
   */
  const updateValue = (
    id: string,
    updates: Partial<Pick<SavedValue, "name">>,
  ) => {
    setSavedValues((prev) =>
      prev.map((value) => (value.id === id ? { ...value, ...updates } : value)),
    );
  };

  /**
   * Delete a saved value
   */
  const deleteValue = (id: string) => {
    setSavedValues((prev) => prev.filter((value) => value.id !== id));
  };

  /**
   * Get a specific saved value by ID
   */
  const getValue = (id: string): SavedValue | undefined => {
    return savedValues.find((value) => value.id === id);
  };

  /**
   * Clear all saved values
   */
  const clearAll = () => {
    setSavedValues([]);
  };

  const contextValue: SavedValuesContextType = {
    savedValues,
    saveValue,
    updateValue,
    deleteValue,
    getValue,
    clearAll,
  };

  return (
    <SavedValuesContext.Provider value={contextValue}>
      {children}
    </SavedValuesContext.Provider>
  );
}

/**
 * Hook to use saved values context
 */
export function useSavedValues(): SavedValuesContextType {
  const context = useContext(SavedValuesContext);
  if (!context) {
    throw new Error("useSavedValues must be used within a SavedValuesProvider");
  }
  return context;
}
