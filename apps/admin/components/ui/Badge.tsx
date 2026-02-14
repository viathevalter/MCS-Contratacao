import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'brand';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    className = '',
    size = 'md'
}) => {
    const variants = {
        success: 'bg-green-100 text-green-800 border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        error: 'bg-red-100 text-red-800 border-red-200',
        neutral: 'bg-slate-100 text-slate-600 border-slate-200',
        info: 'bg-blue-100 text-blue-800 border-blue-200',
        brand: 'bg-brand-100 text-brand-800 border-brand-200'
    };

    const sizes = {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2.5 py-0.5'
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};
