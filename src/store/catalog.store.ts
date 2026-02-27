import { create } from 'zustand';
import { apiClient } from '../services/api.client';
import type { Car, CarsQuery } from '../services/api.client';

interface CatalogState {
  allCars: Car[]; // Храним все машины
  loading: boolean;
  error: string | null;
  filters: CarsQuery;
  lastFetchedAt: number | null;

  fetchCars: () => Promise<void>;
  setFilters: (filters: Partial<CarsQuery>) => void;
  resetFilters: () => void;
  invalidateCache: () => void;
}

const DEFAULT_FILTERS: CarsQuery = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут кэш на клиенте

export const useCatalogStore = create<CatalogState>((set, get) => ({
  allCars: [],
  loading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  lastFetchedAt: null,

  fetchCars: async () => {
    const { lastFetchedAt } = get();
    
    // Если данные свежие, не делаем запрос
    if (lastFetchedAt && Date.now() - lastFetchedAt < CACHE_DURATION) {
      return;
    }

    set({ loading: true, error: null });
    
    try {
      // Запрашиваем ВСЕ машины один раз
      const data = await apiClient.getCars();
      set({
        allCars: data,
        loading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },

  setFilters: (newFilters) => {
    set(s => ({ 
      filters: { ...s.filters, ...newFilters }
    }));
  },

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  invalidateCache: () => set({ lastFetchedAt: null }),
}));
