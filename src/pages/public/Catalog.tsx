import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalogStore } from '../../store/catalog.store';
import { useShallow } from 'zustand/react/shallow';
import { CarCard } from '../../shared/components/ui/CarCard';
import { CarCardSkeleton } from '../../shared/components/ui/CarCardSkeleton';
import { RangeFilter } from '../../shared/components/ui/RangeFilter';

// Простой кастомный Combobox для мобильных
function Combobox({ value, onChange, options, placeholder, disabled }: { 
  value: string | undefined, 
  onChange: (val: string) => void, 
  options: string[], 
  placeholder: string,
  disabled?: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Синхронизация при изменении value извне (например, сброс фильтров)
  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  // Закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '') onChange(''); // Сброс при очистке
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-slate-400 text-sm">Ничего не найдено</div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-50 last:border-0"
                onClick={() => {
                  onChange(option);
                  setSearch(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { allCars, loading, fetchCars, filters, setFilters, resetFilters } = useCatalogStore(
    useShallow((state) => ({
      allCars: state.allCars,
      loading: state.loading,
      fetchCars: state.fetchCars,
      filters: state.filters,
      setFilters: state.setFilters,
      resetFilters: state.resetFilters,
    }))
  );

  // Синхронизация URL -> Store при загрузке
  useEffect(() => {
    const mark = searchParams.get('mark') || undefined;
    const model = searchParams.get('model') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minRun = searchParams.get('minRun') ? Number(searchParams.get('minRun')) : undefined;
    const maxRun = searchParams.get('maxRun') ? Number(searchParams.get('maxRun')) : undefined;
    const minYear = searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined;
    const maxYear = searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined;
    
    setFilters({ mark, model, minPrice, maxPrice, minRun, maxRun, minYear, maxYear });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Загрузка данных один раз
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Клиентская фильтрация
  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      if (filters.mark && car.mark.toLowerCase() !== filters.mark.toLowerCase()) return false;
      if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.minRun && car.run < filters.minRun) return false;
      if (filters.maxRun && car.run > filters.maxRun) return false;
      if (filters.minYear && (!car.year || car.year < filters.minYear)) return false;
      if (filters.maxYear && (!car.year || car.year > filters.maxYear)) return false;
      return true;
    });
  }, [allCars, filters]);

  // Динамические списки для селектов
  const uniqueMarks = useMemo(() => {
    const marks = new Set(allCars.map(c => c.mark));
    return Array.from(marks).sort();
  }, [allCars]);

  const uniqueModels = useMemo(() => {
    const availableCars = filters.mark ? allCars.filter(c => c.mark.toLowerCase() === filters.mark?.toLowerCase()) : allCars;
    const models = new Set(availableCars.map(c => c.model));
    return Array.from(models).sort();
  }, [allCars, filters.mark]);

  // Границы для слайдеров
  const bounds = useMemo(() => {
    if (allCars.length === 0) return { price: [0, 10000000], run: [0, 300000], year: [2000, 2025] };
    const prices = allCars.map(c => c.price);
    const runs = allCars.map(c => c.run);
    const years = allCars.map(c => c.year || 2000);
    return {
      price: [Math.min(...prices), Math.max(...prices)],
      run: [Math.min(...runs), Math.max(...runs)],
      year: [Math.min(...years), Math.max(...years)]
    };
  }, [allCars]);

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined };
    
    // Если меняем марку, сбрасываем модель
    if (key === 'mark') {
      newFilters.model = undefined;
    }
    
    setFilters(newFilters);
    
    // Синхронизация Store -> URL
    setSearchParams(prev => {
      if (value) {
        prev.set(key, String(value));
      } else {
        prev.delete(key);
      }
      if (key === 'mark') prev.delete('model');
      return prev;
    });
  };

  const handleReset = () => {
    resetFilters();
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold">Каталог автомобилей</h1>
        <p className="text-[var(--color-text-muted)]">Найдено: {filteredCars.length} авто</p>
      </div>
      
      {/* Верхняя панель фильтров */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Фильтры</h2>
          {Object.keys(filters).length > 0 && (
            <button 
              onClick={handleReset}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Сбросить все
            </button>
          )}
        </div>
        
        {/* Ряд 1: Марка и Модель (Поиск) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Марка</label>
            <Combobox 
              value={filters.mark}
              onChange={(val) => handleFilterChange('mark', val)}
              options={uniqueMarks}
              placeholder="Выберите или начните вводить..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Модель</label>
            <Combobox 
              value={filters.model}
              onChange={(val) => handleFilterChange('model', val)}
              options={uniqueModels}
              placeholder={filters.mark ? "Выберите или начните вводить..." : "Сначала выберите марку"}
              disabled={!filters.mark}
            />
          </div>
        </div>

        {/* Ряд 2: 3 колонки слайдеров */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RangeFilter 
            label="Цена (₽)"
            min={bounds.price[0]} 
            max={bounds.price[1]} 
            step={50000}
            value={[filters.minPrice ?? bounds.price[0], filters.maxPrice ?? bounds.price[1]]}
            onChange={(val) => { handleFilterChange('minPrice', val[0]); handleFilterChange('maxPrice', val[1]); }}
            formatLabel={(v) => v.toLocaleString('ru-RU')}
          />
          <RangeFilter 
            label="Пробег (км)"
            min={bounds.run[0]} 
            max={bounds.run[1]} 
            step={5000}
            value={[filters.minRun ?? bounds.run[0], filters.maxRun ?? bounds.run[1]]}
            onChange={(val) => { handleFilterChange('minRun', val[0]); handleFilterChange('maxRun', val[1]); }}
            formatLabel={(v) => v.toLocaleString('ru-RU')}
          />
          <RangeFilter 
            label="Год выпуска"
            min={bounds.year[0]} 
            max={bounds.year[1]} 
            step={1}
            value={[filters.minYear ?? bounds.year[0], filters.maxYear ?? bounds.year[1]]}
            onChange={(val) => { handleFilterChange('minYear', val[0]); handleFilterChange('maxYear', val[1]); }}
          />
        </div>
      </div>
      
      {/* Сетка автомобилей */}
      <div>
        {loading && allCars.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Ничего не найдено</h3>
            <p className="text-slate-500 mb-6">Попробуйте изменить параметры фильтра</p>
            <button 
              onClick={handleReset}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

