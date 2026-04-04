import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  tooltip?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, helperText, tooltip, ...props }, ref) => {
    const id = props.id || props.name;
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-1.5 group relative w-fit">
          {label}
          {tooltip && (
            <div className="text-blue-500 cursor-help">
              <Info className="w-4 h-4" />
              <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                {tooltip}
                <div className="absolute left-4 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800"></div>
              </div>
            </div>
          )}
        </label>
        <input
          id={id}
          className={cn(
            "apple-input w-full",
            error && "border-[var(--color-danger)] focus:box-shadow-[0_0_0_3px_rgba(255,59,48,0.2)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
        {helperText && !error && <p className="text-sm text-[var(--color-text-secondary)]">{helperText}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
