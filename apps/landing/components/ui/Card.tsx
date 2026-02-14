import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, title, subtitle, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden", className)}
                {...props}
            >
                {(title || subtitle) && (
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        {title && <div className="text-lg font-semibold text-slate-900">{title}</div>}
                        {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        )
    }
)
Card.displayName = "Card"

export { Card }
