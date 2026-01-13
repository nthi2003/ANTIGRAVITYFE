import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-primary text-white hover:bg-slate-800 shadow-lg shadow-primary/25",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
        ghost: "text-slate-600 hover:bg-slate-100",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5 gap-1.5",
        md: "text-sm px-4 py-2.5 gap-2",
        lg: "text-base px-6 py-3 gap-2.5",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && leftIcon}
            {children}
        </button>
    );
};
