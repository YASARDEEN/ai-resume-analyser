import React, { useState } from 'react';
import { FileText, Mail, Lock, AlertCircle, User as UserIcon, Chrome, Linkedin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

import { API_BASE_URL } from '../config';

const LoginPage: React.FC<{ onLogin: (role: 'candidate' | 'admin', token: string) => void }> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'candidate' | 'admin'>('candidate');
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const endpoint = isRegistering ? '/api/v1/auth/register' : '/api/v1/auth/login';
        const payload = isRegistering
            ? { name, email, password, role: activeTab }
            : { email, password };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userName', data.user.name);
                onLogin(data.user.role, data.accessToken);
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Could not connect to the server. Please ensure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Column: AI/Network Illustration */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-blue-700 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full -ml-48 -mb-48 blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center text-white mb-12">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mr-3 border border-white/30 shadow-xl">
                            <FileText className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">ResumeAI</span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Elevate Your Career with AI Precision.
                        </h1>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Our advanced ATS and Resume Analyzer helps you land more interviews by optimizing your resume for modern recruitment systems.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-blue-200 text-sm flex items-center space-x-6">
                    <span>Trusted by 500+ Enterprises</span>
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-blue-400 overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Login Card */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50/50">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="md:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                <FileText className="text-white w-7 h-7" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500">
                            {isRegistering ? 'Join thousands of professionals today' : 'Log in to manage your career journey'}
                        </p>
                    </div>

                    <Card className="p-6 border-slate-200 shadow-xl shadow-slate-200/50">
                        {/* Tabs Placeholder - Only Candidate now */}
                        <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
                            <button
                                className="flex-1 py-2 text-sm font-bold rounded-md bg-white text-primary shadow-sm"
                            >
                                Candidate Portal
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {isRegistering && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            className="pl-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="email"
                                        placeholder="name@company.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    {!isRegistering && <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                                {isLoading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In')}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-sm text-slate-600 hover:text-primary transition-colors"
                            >
                                {isRegistering ? 'Already have an account? Sign in' : 'Don\'t have an account? Create one'}
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
