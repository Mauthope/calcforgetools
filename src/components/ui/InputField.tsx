import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const id = props.id || props.name;
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
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
