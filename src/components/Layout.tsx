import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Bell, User as UserIcon, Search } from 'lucide-react';
import { Button } from './ui/Button';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={onTabChange}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onLogout={onLogout}
            />

            <div className="flex-1 flex flex-col lg:pl-64">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden mr-2"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100 w-64 lg:w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search resumes, optimizations..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-white" />
                        </Button>
                        <div className="h-8 w-[1px] bg-slate-100 mx-2" />
                        <div className="flex items-center group cursor-pointer">
                            <div className="text-right mr-3 hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900 leading-tight">
                                    {localStorage.getItem('userName') || 'User'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Job Seeker
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
                                <UserIcon className="w-6 h-6 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
