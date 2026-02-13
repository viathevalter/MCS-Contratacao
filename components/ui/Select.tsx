import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
    helperText?: string;
    containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    helperText,
    className = '',
    containerClassName = '',
    id,
    ...props
}) => {
    const selectId = id || props.name;

    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1">
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    className={`
            block w-full rounded-lg border shadow-sm transition-colors duration-200
            focus:ring-2 focus:ring-offset-0 focus:outline-none sm:text-sm
            disabled:bg-slate-50 disabled:text-slate-500
            ${error
                            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                            : 'border-slate-300 text-slate-900 focus:ring-brand-500 focus:border-brand-500 hover:border-brand-300'
                        }
            py-2.5 px-3
            ${className}
          `}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in-down">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p className="mt-1 text-sm text-slate-500">{helperText}</p>
            )}
        </div>
    );
};
