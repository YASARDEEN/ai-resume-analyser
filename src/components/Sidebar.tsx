import React, { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    User,
    LifeBuoy,
    Settings,
    LogOut,
    Menu,
    X,
    Briefcase,
    Users,
    BarChart3,
    Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            'flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group',
            active
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        )}
    >
        <Icon className={cn('w-5 h-5 mr-3', active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900')} />
        {label}
    </button>
);

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) => {
    const items = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'resumes', icon: FileText, label: 'My Resumes' },
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'support', icon: LifeBuoy, label: 'Support' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-50 transition-transform duration-300 transform lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo */}
                    <div className="flex items-center px-4 py-6 mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                            <FileText className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">ResumeAI</span>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 space-y-1">
                        {items.map((item) => (
                            <SidebarItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                active={activeTab === item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsOpen(false);
                                }}
                            />
                        ))}
                    </nav>

                    {/* Footer Items */}
                    <div className="pt-4 border-t border-slate-100">
                        <SidebarItem
                            icon={LogOut}
                            label="Logout"
                            onClick={onLogout}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
