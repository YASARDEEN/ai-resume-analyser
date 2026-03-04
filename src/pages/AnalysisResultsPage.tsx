import React from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Search,
    Lightbulb,
    Clock,
    Zap,
    Download,
    Share2,
    ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/CircularProgress';
import { API_BASE_URL } from '../config';

const AnalysisResultsPage: React.FC<{ onBack: () => void, resumeId: string | null }> = ({ onBack, resumeId }) => {
    const [analysis, setAnalysis] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAnalysis = async () => {
            if (!resumeId) return;
            const token = localStorage.getItem('accessToken');
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/resumes/${resumeId}/analysis`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const extracted = data.extracted_data;
                    // Ensure 'score' is available even if it's nested or named 'ats_score'
                    if (extracted && !extracted.score && extracted.ats_score) {
                        extracted.score = extracted.ats_score;
                    }
                    setAnalysis(extracted);
                }
            } catch (error) {
                console.error('Error fetching analysis:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [resumeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <CircularProgress value={0} size={80} strokeWidth={8} showValue={false} className="animate-spin" />
                <p className="ml-4 text-slate-500 font-medium">Analyzing Resume Data...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Analysis Not Found</h2>
                <p className="text-slate-500 mt-2">We couldn't find the analysis for this resume. Please try uploading it again.</p>
                <Button onClick={onBack} className="mt-8">Go Back</Button>
            </div>
        );
    }

    const matchedKeywords: string[] = analysis.skills || [];
    const missingKeywords: string[] = []; // This would come from a job comparison in the future

    const parsingDetails = [
        { category: 'Skills', found: analysis.skills?.join(', ') || 'None found', status: analysis.skills?.length > 5 ? 'High' : 'Partial' },
        { category: 'Experience', found: `${analysis.experience?.length || 0} jobs found`, status: analysis.experience?.length > 0 ? 'High' : 'Missing' },
        { category: 'Education', found: analysis.education?.[0]?.degree || 'None found', status: analysis.education?.length > 0 ? 'High' : 'Missing' },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-slate-900 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Button>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Hero Score Section */}
            <Card className="bg-white border-slate-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <CircularProgress value={analysis.score || 0} size={160} strokeWidth={12} className="mb-6" />
                        <Badge variant={analysis.score >= 70 ? "success" : "warning"} className="mb-4 px-4 py-1 text-sm">
                            Score: {analysis.score || 0}%
                        </Badge>
                        <h2 className="text-2xl font-bold text-slate-900">ATS Match Score</h2>
                        <p className="text-slate-500 mt-2">
                            {analysis.summary || `Analysis completed for ${analysis.education?.[0]?.degree ? 'technical' : 'professional'} profile.`}
                        </p>
                    </div>

                    <div className="p-8 lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Analysis Overview</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 mb-1 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Processing Time
                                        </p>
                                        <p className="text-lg font-bold text-slate-900">1.2s</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 mb-1 flex items-center">
                                            <Zap className="w-3 h-3 mr-1" />
                                            AI Confidence
                                        </p>
                                        <p className="text-lg font-bold text-slate-900">98.4%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Action</h3>
                                <Card className="bg-primary/5 border-primary/20 border p-4">
                                    <p className="text-sm text-slate-700">Optimize your resume with our AI-powered suggestions to reach a 95+ score.</p>
                                    <Button className="w-full mt-3 h-9 text-sm" variant="primary">
                                        Apply AI Suggestions
                                    </Button>
                                </Card>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Optimization Summary</h3>
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-slate-700">Keywords Relevance</span>
                                    <span className="text-sm font-bold text-success">92%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-success rounded-full" style={{ width: '92%' }} />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-slate-700">Formatting Strength</span>
                                    <span className="text-sm font-bold text-primary">85%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Keywords Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Keywords Analysis</CardTitle>
                            <CardDescription>Visualizing how your skills match the job description.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Matched Keywords ({matchedKeywords.length})</h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchedKeywords.map((kw: string) => (
                                        <Badge key={kw} variant="success" className="px-3 py-1">
                                            <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Missing Keywords ({missingKeywords.length})</h4>
                                <div className="flex flex-wrap gap-2">
                                    {missingKeywords.map((kw: string) => (
                                        <Badge key={kw} variant="danger" className="px-3 py-1">
                                            <XCircle className="w-3 h-3 mr-1.5" />
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Parsing Details</CardTitle>
                            <CardDescription>Deep dive into how our AI interpreted your resume sections.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Requirement</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Found in Resume</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Match</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {parsingDetails.map((item, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.category}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">Auto-detected</td>
                                                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.found}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Badge variant={item.status === 'High' ? 'success' : 'warning'}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Recommendations */}
                <div className="space-y-8">
                    <Card className="border-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center text-primary">
                                <Lightbulb className="w-5 h-5 mr-2" />
                                AI Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "Add 'Grafana' and 'Prometheus' to your Skills section to match the monitoring requirement.",
                                "Quantify your DevOps impact: quantify uptime improvements or deployment speed increases.",
                                "Ensure your LinkedIn URL is correctly hyperlinked in the header.",
                                "Move your 'Technical Skills' section above your 'Experience' for this specific role."
                            ].map((rec, i) => (
                                <div key={i} className="flex group cursor-pointer">
                                    <div className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 transition-all group-hover:scale-150" />
                                    <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                                        {rec}
                                    </p>
                                </div>
                            ))}
                            <Button className="w-full mt-4" variant="outline">
                                View Full Breakdown
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResultsPage;
