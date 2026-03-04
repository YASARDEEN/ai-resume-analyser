import React, { useState } from 'react';
import { User, Mail, Shield, Camera, Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const [name, setName] = useState(localStorage.getItem('userName') || 'User');
    const role = localStorage.getItem('userRole');

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Personal Profile</h1>
                <p className="text-slate-500">Manage your account information and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                <User className="w-16 h-16 text-indigo-600" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                        <p className="text-slate-500 capitalize mb-4">{role}</p>
                        <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                            Active Account
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-indigo-600" />
                            Account Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        disabled
                                        value="user@example.com"
                                        className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                    />
                                    <Mail className="absolute right-3 top-2.5 text-slate-400" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Shield size={20} className="text-indigo-600" />
                            Security
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                                <p className="text-sm text-slate-500">Protect your account with an extra layer of security.</p>
                            </div>
                            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                            <Save size={18} />
                            Save Profile Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
