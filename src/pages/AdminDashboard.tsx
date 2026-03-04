import React, { useState, useEffect } from 'react';
import {
    Users,
    FileCheck,
    Briefcase,
    Clock,
    TrendingUp,
    ArrowUpRight,
    MoreVertical,
    Calendar,
    Filter,
    Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

interface AdminDashboardProps {
    onNavigate?: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState({ total: 0, avg: 0 });

    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const res = await fetch('http://localhost:5000/api/v1/resumes/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
                const scores = data.map((c: any) => Number(c.score)).filter((s: number) => s > 0);
                const avg = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
                setSummary({ total: data.length, avg });
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Analysis Dashboard</h1>
                <p className="text-slate-500 mt-1">Direct access to candidate results and ATS performance scores.</p>
            </div>

            {/* Simple Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary border-primary">
                    <CardContent className="p-6 flex items-center justify-between text-white">
                        <div>
                            <p className="text-primary-foreground/80 font-medium">Total Registered Candidates</p>
                            <h3 className="text-3xl font-bold mt-1 text-white">{summary.total}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-success border-success">
                    <CardContent className="p-6 flex items-center justify-between text-white">
                        <div>
                            <p className="text-white/80 font-medium">Average Platform Master Score</p>
                            <h3 className="text-3xl font-bold mt-1 text-white">{summary.avg}%</h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Candidate Results Table */}
            <Card>
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Candidate Results & Login Details</CardTitle>
                        <CardDescription>Comprehensive list of all platform users and their scores.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fetchData()}>
                        Refresh Data
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Login Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">ATS Score</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading candidate outcomes...</td>
                                    </tr>
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No candidate records found.</td>
                                    </tr>
                                ) : (
                                    candidates.map((candidate, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary text-xs font-bold">
                                                        {candidate.candidate_name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-900">{candidate.candidate_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">{candidate.candidate_email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-bold text-sm">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full mr-2",
                                                        Number(candidate.score) >= 80 ? "bg-success" : Number(candidate.score) >= 60 ? "bg-primary" : "bg-danger"
                                                    )} />
                                                    {candidate.score || 0}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary font-bold hover:bg-primary/5"
                                                    onClick={() => onNavigate?.('candidates')}
                                                >
                                                    View Bio
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
