import { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
}

export function RangeFilter({ label, min, max, step, value, onChange, formatLabel }: RangeFilterProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  // Синхронизация локального стейта, если значение изменилось извне (например, сброс фильтров)
  useEffect(() => {
    if (value[0] !== localValue[0] || value[1] !== localValue[1]) {
      setLocalValue(value);
    }
  }, [value[0], value[1]]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-4">{label}</label>
      <div className="px-2" style={{ touchAction: 'none' }}>
        <ReactSlider
          className="h-1.5 w-full bg-slate-200 rounded-full mb-4"
          thumbClassName="h-5 w-5 bg-white border-2 border-[var(--color-primary)] rounded-full -top-1.5 cursor-grab focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
          renderTrack={(props, state) => {
            const { key, ...restProps } = props as any;
            return (
              <div 
                key={key}
                {...restProps} 
                className={`h-1.5 rounded-full ${state.index === 1 ? 'bg-[var(--color-primary)]' : 'bg-slate-200'}`} 
              />
            );
          }}
          renderThumb={(props, state) => {
            const { key, ...restProps } = props as any;
            return (
              <div 
                key={key}
                {...restProps} 
              />
            );
          }}
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={(val) => setLocalValue(val as [number, number])}
          onAfterChange={(val) => onChange(val as [number, number])}
          pearling
          minDistance={step}
        />
        <div className="flex justify-between text-sm text-slate-500 font-medium">
          <span>{formatLabel ? formatLabel(localValue[0]) : localValue[0]}</span>
          <span>{formatLabel ? formatLabel(localValue[1]) : localValue[1]}</span>
        </div>
      </div>
    </div>
  );
}
