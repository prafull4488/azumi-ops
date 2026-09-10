import { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_DATA } from '../data/defaultData';

const STORAGE_KEY = 'azumi-site-data-v1';
const SiteDataContext = createContext(null);

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...structuredClone(DEFAULT_DATA), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return structuredClone(DEFAULT_DATA);
}

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(loadInitial);
  const [savedAt, setSavedAt] = useState(null);

  const save = useCallback(next => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedAt(Date.now());
    } catch {
      /* storage unavailable */
    }
  }, []);

  const resetToDefault = useCallback(() => {
    const fresh = structuredClone(DEFAULT_DATA);
    save(fresh);
  }, [save]);

  return (
    <SiteDataContext.Provider value={{ data, setData: save, savedAt, resetToDefault }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}
