import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CandidateDashboard from './pages/CandidateDashboard';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import KeywordManagementPage from './pages/KeywordManagementPage';
import CandidateRankingPage from './pages/CandidateRankingPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';

type AppState = 'login' | 'candidate-dashboard' | 'candidate-resumes' | 'candidate-profile' | 'candidate-settings' | 'analysis-results' | 'admin-dashboard' | 'keyword-management' | 'candidate-ranking' | 'admin-reports' | 'admin-settings';

const App: React.FC = () => {
    const [state, setState] = useState<AppState>('login');
    const [role, setRole] = useState<'candidate' | 'admin' | null>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedRole = localStorage.getItem('userRole');
        if (storedToken && storedRole) {
            setRole(storedRole as 'candidate' | 'admin');
            setToken(storedToken);
            setState(storedRole === 'candidate' ? 'candidate-dashboard' : 'admin-dashboard');
        }
    }, []);

    const handleLogin = (userRole: 'candidate' | 'admin', userToken: string) => {
        localStorage.setItem('accessToken', userToken);
        localStorage.setItem('userRole', userRole);
        setRole(userRole);
        setToken(userToken);
        setState('candidate-dashboard');
        setActiveTab('dashboard');
    };

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        setToken(null);
        setState('login');
    };

    const handleSidebarTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'dashboard') setState('candidate-dashboard');
        else if (tab === 'resumes') setState('candidate-resumes');
        else if (tab === 'profile') setState('candidate-profile');
        else if (tab === 'settings') setState('candidate-settings');
    };

    if (state === 'login') {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <Layout
            activeTab={activeTab}
            onTabChange={handleSidebarTabChange}
            onLogout={handleLogout}
        >
            <div className="animate-in fade-in duration-500">
                {state === 'candidate-dashboard' && (
                    <CandidateDashboard onViewDetails={(id) => { setSelectedResumeId(id); setState('analysis-results'); }} onLogout={handleLogout} />
                )}
                {state === 'candidate-resumes' && (
                    <CandidateDashboard onViewDetails={(id) => { setSelectedResumeId(id); setState('analysis-results'); }} onLogout={handleLogout} />
                )}
                {state === 'candidate-profile' && <ProfilePage />}
                {state === 'candidate-settings' && <SettingsPage />}
                {state === 'analysis-results' && (
                    <AnalysisResultsPage
                        onBack={() => {
                            setState('candidate-dashboard');
                        }}
                        resumeId={selectedResumeId}
                    />
                )}
            </div>
        </Layout>
    );
};

export default App;
