import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Users as UserIcon,
    FileText,
    CheckCircle,
    Loader2,
    Calendar,
    ChevronRight,
    Search as SearchIcon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const ReportsPage: React.FC<{ onViewDetails?: (id: string) => void }> = ({ onViewDetails }) => {
    const [stats, setStats] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            // Fetch Overview Stats
            const statsRes = await fetch('http://localhost:5000/api/v1/analytics/overview', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }

            // Fetch Candidate Records for Report
            const candidatesRes = await fetch('http://localhost:5000/api/v1/resumes/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (candidatesRes.ok) {
                const data = await candidatesRes.json();
                setCandidates(data);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.candidate_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium">Generating reports and aggregating records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
                    <p className="text-slate-500 mt-1">Comprehensive overview of hiring performance and candidate records.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" className="h-10">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last 30 Days
                    </Button>
                    <Button variant="outline" className="h-10 border-slate-200">
                        Export Report PDF
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Resumes', value: stats?.totalApplicants || '0', icon: FileText, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Active Jobs', value: stats?.activeJobs || '0', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Avg Master Score', value: `${stats?.averageAtsScore}%` || '0%', icon: CheckCircle, color: 'text-success bg-success/10' },
                    { label: 'Registered Candidates', value: candidates.length.toString(), icon: UserIcon, color: 'text-purple-600 bg-purple-50' },
                ].map((stat, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <TrendingUp className="w-4 h-4 text-success" />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Candidate Records Table */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 pb-6 border-b border-slate-50">
                        <div>
                            <CardTitle>Detailed Candidate Records</CardTitle>
                            <CardDescription>A complete log of all candidates and their analysis results.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-64">
                            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Profile</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Applied</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Master Score</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">View Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredCandidates.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">No candidate records found.</td>
                                        </tr>
                                    ) : filteredCandidates.map((record, i) => (
                                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mr-3 text-slate-400">
                                                        <UserIcon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-tight">{record.candidate_name}</p>
                                                        <p className="text-xs text-slate-500">{record.candidate_email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(record.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-sm font-bold mb-1 ${Number(record.score) >= 70 ? 'text-success' : 'text-primary'}`}>
                                                        {record.score || 0}%
                                                    </span>
                                                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${Number(record.score) >= 70 ? 'bg-success' : 'bg-primary'}`}
                                                            style={{ width: `${record.score || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="success">Completed</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary hover:bg-primary/5"
                                                    onClick={() => onViewDetails?.(record.id)}
                                                >
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Distribution Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-indigo-600" />
                            Score Distribution Analysis
                        </CardTitle>
                        <CardDescription>Breakdown of candidate performance across all uploads.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 pt-4">
                            {[
                                { label: 'High Talent (80-100%)', count: candidates.filter(c => Number(c.score) >= 80).length, total: candidates.length, color: 'bg-success' },
                                { label: 'Strong Fit (60-80%)', count: candidates.filter(c => Number(c.score) >= 60 && Number(c.score) < 80).length, total: candidates.length, color: 'bg-primary' },
                                { label: 'Potential Growth (<60%)', count: candidates.filter(c => Number(c.score) < 60).length, total: candidates.length, color: 'bg-warning' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-slate-700">{item.label}</span>
                                        <span className="font-bold text-slate-900">{item.count} Candidates</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <div
                                            style={{ width: `${(item.count / (item.total || 1)) * 100}%` }}
                                            className={`h-full ${item.color} transition-all duration-1000`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Confidence Insight */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-indigo-600">AI Confidence</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-10">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <TrendingUp className="w-16 h-16 text-primary opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-black text-primary">98%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium px-4 leading-relaxed">
                            Our AI algorithm has processed {candidates.length} records with a 98.4% parser confidence rate.
                        </p>
                        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center gap-6 text-xs font-bold text-slate-400">
                            <div className="flex flex-col items-center">
                                <span className="text-slate-900 text-base mb-1">0%</span>
                                FAILURE
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-slate-900 text-base mb-1">1s</span>
                                LATENCY
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReportsPage;
