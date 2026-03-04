import React, { useState, useEffect } from 'react';
import {
    Search as SearchIcon,
    Filter,
    ChevronRight,
    MapPin,
    Briefcase,
    Star,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

const CandidateRankingPage: React.FC<{ onViewDetails: (id: string) => void }> = ({ onViewDetails }) => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchCandidates = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch('http://localhost:5000/api/v1/resumes/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCandidates(data);
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.candidate_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Ranking</h1>
                <p className="text-slate-500 mt-1">AI-indexed list of all candidates ranked by ATS match score.</p>
            </div>

            {/* Filters Section */}
            <Card className="bg-white border-slate-100">
                <CardContent className="p-4 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                            className="pl-10 h-10"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-10">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Ranking Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">ATS Score</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                                            <p className="text-slate-500 font-medium">Fetching candidates...</p>
                                        </td>
                                    </tr>
                                ) : filteredCandidates.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-slate-400">No candidates found matching your criteria.</td>
                                    </tr>
                                ) : filteredCandidates.map((person) => (
                                    <tr key={person.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mr-4">
                                                    <UserIcon className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{person.candidate_name}</p>
                                                    <p className="text-xs text-slate-500">{person.candidate_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center text-sm font-bold text-slate-900 mb-1">
                                                    <Star className={cn("w-3 h-3 mr-1 fill-current", Number(person.score) >= 80 ? "text-warning" : "text-slate-300")} />
                                                    {person.score || 0}%
                                                </div>
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            Number(person.score) >= 85 ? "bg-success" : Number(person.score) >= 70 ? "bg-primary" : "bg-danger"
                                                        )}
                                                        style={{ width: `${person.score || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                className="h-9 px-4 text-primary font-bold hover:bg-primary/5"
                                                onClick={() => onViewDetails(person.id)}
                                            >
                                                View Profile
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CandidateRankingPage;
