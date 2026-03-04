import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Eye, Trash2, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/CircularProgress';
import { cn } from '../lib/utils';
import { API_BASE_URL } from '../config';

const CandidateDashboard: React.FC<{ onViewDetails: (id: string) => void, onLogout: () => void }> = ({ onViewDetails, onLogout }) => {
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [resumes, setResumes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchResumes = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/resumes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setResumes(data);
            }
        } catch (error) {
            console.error('Error fetching resumes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchResumes();
    }, []);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', file);

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/resumes/analyze`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Resume uploaded and analyzed successfully!');
                fetchResumes();
            } else if (response.status === 401) {
                alert('Your session has expired. Please log in again.');
                onLogout();
            } else {
                const errorData = await response.json();
                alert(`Upload failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error connecting to backend server.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const deleteResume = async (id: string | number) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/resumes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setResumes(resumes.filter(r => String(r.id) !== String(id)));
            } else {
                alert('Failed to delete resume');
            }
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Error connecting to backend');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {localStorage.getItem('userName') || 'User'}</h1>
                    <p className="text-slate-500 mt-1">Check your resume's ATS performance and optimizations.</p>
                </div>
                <Button className="h-11 shadow-lg shadow-primary/20" onClick={onButtonClick} disabled={isUploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Quick Upload'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2 border-dashed border-slate-200 bg-white hover:border-primary/40 transition-colors">
                        <CardContent className="p-8 lg:p-12">
                            <form
                                className="flex flex-col items-center justify-center text-center space-y-4"
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={onFileChange}
                                    accept=".pdf,.docx"
                                />
                                <div className={cn(
                                    "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
                                    dragActive ? "bg-primary/20 scale-110" : "bg-primary/5"
                                )}>
                                    <Upload className={cn(
                                        "w-10 h-10 transition-colors",
                                        dragActive ? "text-primary" : "text-primary/60"
                                    )} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-slate-900">Upload Your Resume</h3>
                                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                                        Drag and drop your file here, or click to browse. Supported formats: PDF, DOCX (Max 5MB).
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <Button
                                        variant="outline"
                                        className="h-11 px-8 border-slate-200"
                                        type="button"
                                        onClick={onButtonClick}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Browse Files'}
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-400 mt-4 italic">
                                    * Your data is encrypted and protected by our AI security protocols.
                                </p>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                            <div>
                                <CardTitle>Recent Analysis</CardTitle>
                                <CardDescription>Track and manage your analyzed resumes.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary font-bold">
                                View All
                                <ArrowUpRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">File Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">ATS Score</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {resumes.length === 0 && !isLoading && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                                    No resumes found. Upload one to get started!
                                                </td>
                                            </tr>
                                        )}
                                        {resumes.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center">
                                                        <FileText className="w-5 h-5 text-slate-400 mr-3 group-hover:text-primary transition-colors" />
                                                        <span className="text-sm font-medium text-slate-900">{item.file_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-slate-500">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge variant="success">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Completed
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-center">
                                                        <CircularProgress value={item.score || 0} size={40} strokeWidth={4} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-slate-100"
                                                            onClick={() => onViewDetails(item.id)}
                                                        >
                                                            <Eye className="w-4 h-4 text-slate-500" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-danger/60 hover:text-danger hover:bg-danger/5"
                                                            onClick={() => deleteResume(item.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    <Card className="bg-primary text-white overflow-hidden relative">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <CardHeader>
                            <CardTitle className="text-white">Profile Strength</CardTitle>
                            <CardDescription className="text-blue-100">AI confidence in your profile</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center py-4">
                                <CircularProgress value={78} size={120} strokeWidth={10} className="text-white ring-8 ring-white/10 rounded-full" showValue={true} />
                                <div className="mt-8 text-center">
                                    <p className="text-sm text-blue-100 px-4">Your infrastructure skills are highly rated. Consider adding more 'Cloud Security' keywords.</p>
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <Button className="w-full bg-white text-primary hover:bg-blue-50 border-none shadow-sm font-bold">
                                Optimize Now
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>AI Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center mr-3 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Experience Match High</p>
                                    <p className="text-xs text-slate-500 mt-1">Found 8+ years of relevant experience in DevOps.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center mr-3 mt-1 shrink-0">
                                    <AlertCircle className="w-4 h-4 text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Missing Certifications</p>
                                    <p className="text-xs text-slate-500 mt-1">LinkedIn profiles often list 'AWS Certified' for your target roles.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
