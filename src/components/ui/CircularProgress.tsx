import React from 'react';
import { cn } from '../../lib/utils';

interface CircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showValue?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    size = 60,
    strokeWidth = 6,
    className,
    showValue = true,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const getColor = (val: number) => {
        if (val >= 80) return 'text-success';
        if (val >= 60) return 'text-warning';
        return 'text-danger';
    };

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-slate-100"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn('transition-all duration-1000 ease-out', getColor(value))}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {showValue && (
                <span className="absolute text-sm font-bold text-slate-700">
                    {value}%
                </span>
            )}
        </div>
    );
};

export { CircularProgress };
