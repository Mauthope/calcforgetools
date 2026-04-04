import React, { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  tooltip?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, options, error, tooltip, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-1.5 group relative w-fit">
          {label}
          {tooltip && (
            <div className="text-blue-500 cursor-help z-50">
              <Info className="w-4 h-4" />
              <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-normal">
                {tooltip}
                <div className="absolute left-4 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800"></div>
              </div>
            </div>
          )}
        </label>
        <div className="relative">
          <select
            id={id}
            className={cn(
              "apple-input w-full appearance-none pr-10",
              error && "border-[var(--color-danger)] focus:box-shadow-[0_0_0_3px_rgba(255,59,48,0.2)]",
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--color-text-secondary)]">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
