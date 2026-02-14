import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    actions,
    className = ''
}) => {
    return (
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 mb-6 border-b border-slate-200 ${className}`}>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                )}
            </div>

            {actions && (
                <div className="flex items-center space-x-3 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
};
