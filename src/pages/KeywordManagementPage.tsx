import React, { useState } from 'react';
import {
    ChevronDown,
    Plus,
    X,
    Info,
    Save,
    RotateCcw,
    Zap,
    Target,
    Trophy
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const KeywordManagementPage: React.FC = () => {
    const [mandatoryKeywords, setMandatoryKeywords] = useState(['Kubernetes', 'Docker', 'AWS', 'Terraform']);
    const [preferredKeywords, setPreferredKeywords] = useState(['Python', 'Go', 'Service Mesh', 'Monitoring', 'CI/CD']);
    const [newMandatory, setNewMandatory] = useState('');
    const [newPreferred, setNewPreferred] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const addKeyword = (type: 'mandatory' | 'preferred') => {
        if (type === 'mandatory' && newMandatory.trim()) {
            if (!mandatoryKeywords.includes(newMandatory.trim())) {
                setMandatoryKeywords([...mandatoryKeywords, newMandatory.trim()]);
            }
            setNewMandatory('');
        } else if (type === 'preferred' && newPreferred.trim()) {
            if (!preferredKeywords.includes(newPreferred.trim())) {
                setPreferredKeywords([...preferredKeywords, newPreferred.trim()]);
            }
            setNewPreferred('');
        }
    };

    const removeKeyword = (type: 'mandatory' | 'preferred', kw: string) => {
        if (type === 'mandatory') {
            setMandatoryKeywords(mandatoryKeywords.filter(k => k !== kw));
        } else {
            setPreferredKeywords(preferredKeywords.filter(k => k !== kw));
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);
        // Simulate API call to save keywords
        setTimeout(() => {
            setIsSaving(false);
            alert('Keywords saved successfully for Senior Cloud Engineer!');
        }, 800);
    };

    const resetKeywords = () => {
        if (window.confirm('Discard all changes?')) {
            setMandatoryKeywords(['Kubernetes', 'Docker', 'AWS', 'Terraform']);
            setPreferredKeywords(['Python', 'Go', 'Service Mesh', 'Monitoring', 'CI/CD']);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Keyword Management</h1>
                    <p className="text-slate-500 mt-1">Configure AI weighting and keyword matching for specific roles.</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-bold text-slate-700 block mb-2">Job Position</label>
                            <div className="relative">
                                <select className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 pr-10 appearance-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    <option>Senior Cloud Engineer (Infrastructure)</option>
                                    <option>Full Stack Developer (Product)</option>
                                    <option>UX Designer (Creative)</option>
                                    <option>Data Analyst (FinOps)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-end pb-0.5">
                            <Button variant="outline" className="h-11" onClick={() => alert('Feature coming soon: Resume templates.')}>
                                Browse Template
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-8">
                {/* Mandatory Keywords */}
                <Card className="border-l-4 border-l-danger">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <div className="flex items-center mb-1">
                                <Target className="w-5 h-5 text-danger mr-2" />
                                <CardTitle>Mandatory Keywords</CardTitle>
                            </div>
                            <CardDescription>Candidates must have ALL of these keywords to pass initial screening.</CardDescription>
                        </div>
                        <Badge variant="danger" className="font-bold">Hard Requirement</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                            {mandatoryKeywords.map((kw) => (
                                <Badge key={kw} variant="secondary" className="px-3 py-1.5 text-sm bg-white border-slate-200">
                                    {kw}
                                    <button onClick={() => removeKeyword('mandatory', kw)} className="ml-2 hover:text-danger">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                            {mandatoryKeywords.length === 0 && <span className="text-slate-400 text-sm italic">No keywords added...</span>}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add mandatory keyword (e.g., Kubernetes)"
                                value={newMandatory}
                                onChange={(e) => setNewMandatory(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addKeyword('mandatory')}
                            />
                            <Button onClick={() => addKeyword('mandatory')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg flex items-start">
                            <Info className="w-4 h-4 text-danger mr-3 mt-0.5 shrink-0" />
                            <p className="text-xs text-danger/80 leading-relaxed font-medium">
                                Pass/Fail Logic: Any resume missing any of the above keywords will be automatically flagged as "Not Qualified" unless overridden by an admin.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferred Keywords */}
                <Card className="border-l-4 border-l-success">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <div className="flex items-center mb-1">
                                <Trophy className="w-5 h-5 text-success mr-2" />
                                <CardTitle>Preferred Keywords</CardTitle>
                            </div>
                            <CardDescription>These keywords contribute extra points to the candidate's ATS score.</CardDescription>
                        </div>
                        <Badge variant="success" className="font-bold">Weighted Scoring</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                            {preferredKeywords.map((kw) => (
                                <Badge key={kw} variant="secondary" className="px-3 py-1.5 text-sm bg-white border-slate-200">
                                    {kw}
                                    <button onClick={() => removeKeyword('preferred', kw)} className="ml-2 hover:text-success">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                            {preferredKeywords.length === 0 && <span className="text-slate-400 text-sm italic">No keywords added...</span>}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add preferred keyword (e.g., Python)"
                                value={newPreferred}
                                onChange={(e) => setNewPreferred(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addKeyword('preferred')}
                            />
                            <Button onClick={() => addKeyword('preferred')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        <Card className="bg-success/5 border-success/10 p-4">
                            <div className="flex items-center text-success mb-2">
                                <Zap className="w-4 h-4 mr-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">Scoring Logic</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Each matching preferred keyword adds <strong>+5 points</strong> to the total match score. Maximum bonus reachable: <strong>25 points</strong>.
                            </p>
                        </Card>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" className="text-slate-500" onClick={resetKeywords}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Discard Changes
                </Button>
                <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => alert('Recalculating scores for all candidates...')}>Apply to Current Candidates</Button>
                    <Button className="px-8" onClick={saveChanges} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default KeywordManagementPage;
