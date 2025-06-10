import React from 'react';

interface CardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode; // 👈 вот это добавь
}

export const Card: React.FC<CardProps> = ({ title, value, subtitle, icon, children }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-md space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-zinc-500 text-sm">{title}</h3>
                    {value && <p className="text-2xl font-semibold">{value}</p>}
                    {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
                </div>
                {icon && <div className="text-3xl text-zinc-400">{icon}</div>}
            </div>
            <div>{children}</div> {/* 👈 контент графика */}
        </div>
    );
};
