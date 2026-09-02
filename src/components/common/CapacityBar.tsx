import React from 'react';

interface CapacityBarProps {
  current: number;
  max: number;
  unit: string;
  label: string;
  showDetails?: boolean;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  current,
  max,
  unit,
  label,
  showDetails = true,
}) => {
  const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  const isOverloaded = current > max;

  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700';

  if (percent > 90 || isOverloaded) {
    barColor = 'bg-rose-500';
    textColor = 'text-rose-700 font-semibold';
  } else if (percent > 75) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-700';
  }

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-600 font-medium">{label}</span>
          <span className={textColor}>
            {current.toLocaleString()} / {max.toLocaleString()} {unit} ({percent}%)
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
