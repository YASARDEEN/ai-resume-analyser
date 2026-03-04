import React from 'react';
import { Settings, Bell, Globe, Lock, Cpu, Database } from 'lucide-react';

const SettingsPage: React.FC = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Configure application behavior and system preferences.</p>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <Bell className="text-indigo-600" size={22} />
                        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Email Alerts</p>
                                <p className="text-sm text-slate-500">Receive analysis reports and candidate matches via email.</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">System Logs</p>
                                <p className="text-sm text-slate-500">Get notified about critical system events and API status.</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <Cpu className="text-indigo-600" size={22} />
                        <h2 className="text-xl font-bold text-slate-900">AI Parameters</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Analysis Creativity (Temperature)</label>
                            <input type="range" className="w-full accent-indigo-600" min="0" max="100" defaultValue="70" />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>Strict</span>
                                <span>Balanced</span>
                                <span>Creative</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">OpenAI Model</label>
                            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>gpt-4o (Recommended)</option>
                                <option>gpt-4-turbo</option>
                                <option>gpt-3.5-turbo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                        <Database className="text-indigo-600" size={22} />
                        <h2 className="text-xl font-bold text-slate-900">Data Management</h2>
                    </div>
                    <div className="p-6">
                        <button className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors">
                            Purge System Cache
                        </button>
                        <p className="text-xs text-slate-400 mt-2 italic">This will permanently clear all temporary analysis data.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
