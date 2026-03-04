const store = require('./store');
const supabase = require('../services/supabase.service');
const crypto = require('crypto');

// Utility to generate UUID locally if Supabase is unavailable
const generateUUID = () => crypto.randomUUID();

// Utility to check if a string is a valid UUID
const isUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));

// Safe JSON Parse
const safeParse = (str) => {
    if (typeof str !== 'string') return str;
    try { return JSON.parse(str); } catch (e) { return str; }
};

// Mock db query interface with Supabase sync
const db = {
    query: async (text, params = []) => {
        store.refresh(); // Ensure we have the latest from manual edits in database.json
        const cleanText = text.replace(/\s+/g, ' ').trim().toLowerCase();
        console.log(`🔍 DB [${new Date().toLocaleTimeString()}] Query: ${text}`);

        // --- AGGREGATES / ANALYTICS ---
        if (cleanText.includes('select count(*) from')) {
            const table = cleanText.split('from ')[1].split(' ')[0].replace(/[;,\)\("']/g, '').trim();
            let supabaseCount = 0;

            if (supabase) {
                try {
                    let query = supabase.from(table).select('*', { count: 'exact', head: true });
                    if (cleanText.includes("where status = 'active'")) query = query.eq('status', 'active');
                    const { count: sCount, error } = await query;
                    if (!error) supabaseCount = sCount || 0;
                } catch (e) { }
            }

            // Local Data (Use a canonical map for store keys)
            const storeKeyMap = {
                'users': 'users',
                'resumes': 'resumes',
                'jobs': 'jobs',
                'ats_scores': 'atsScores',
                'parsed_resumes': 'parsedResumes'
            };
            const key = storeKeyMap[table] || table;
            let localItems = store[key] || [];

            if (table === 'jobs' && cleanText.includes("where status = 'active'")) {
                localItems = localItems.filter(j => String(j.status).toLowerCase() === 'active');
            }

            const count = Math.max(supabaseCount, localItems.length);
            // Ensure we at least show the length of local resumes if count comes back 0 but items exist
            const finalCount = count || localItems.length;
            return { rows: [{ count: finalCount }] };
        }

        if (cleanText.includes('select avg(score) from')) {
            let scores = [];
            // Try Supabase first
            if (supabase) {
                try {
                    const { data: sScores } = await supabase.from('ats_scores').select('score');
                    if (sScores) scores.push(...sScores.map(s => Number(s.score)));

                    const { data: pScores } = await supabase.from('parsed_resumes').select('extracted_data');
                    if (pScores) {
                        scores.push(...pScores.map(p => {
                            const d = typeof p.extracted_data === 'string' ? safeParse(p.extracted_data) : p.extracted_data;
                            return Number(d?.score || d?.ats_score || 0);
                        }));
                    }
                } catch (e) { }
            }

            // Local
            const localAts = (store.atsScores || []).map(s => Number(s.score));
            const localParsed = (store.parsedResumes || []).map(p => {
                const data = safeParse(p.extracted_data);
                return Number(data?.score || data?.ats_score || 0);
            });

            const allScores = [...scores, ...localAts, ...localParsed].filter(s => s > 0);

            let avg = 0;
            if (allScores.length) {
                avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
            }
            // IF STILL 0, check if we have ANY candidate in the list and give a fallback average from list data
            return { rows: [{ avg: avg || 72 }] }; // 72 is a temporary fallback if data exists but score is null
        }

        if (cleanText.includes("date_trunc('week', created_at)")) {
            // Trend query for charts
            let trendData = [];
            if (supabase) {
                try {
                    const { data } = await supabase.rpc('get_weekly_resume_stats'); // Assuming RPC exists or fallback to select
                    if (data) return { rows: data };
                } catch (e) { /* ignore and fallback */ }
            }

            // Local Fallback for weekly grouping
            const resumes = store.resumes || [];
            const weeks = {};
            resumes.forEach(r => {
                const date = new Date(r.created_at);
                const day = date.getDay();
                const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
                const monday = new Date(date.setDate(diff));
                monday.setHours(0, 0, 0, 0);
                const weekKey = monday.toISOString();
                weeks[weekKey] = (weeks[weekKey] || 0) + 1;
            });

            trendData = Object.keys(weeks).map(week => ({
                week,
                count: weeks[week]
            })).sort((a, b) => new Date(b.week) - new Date(a.week)).slice(0, 12);

            return { rows: trendData };
        }

        // --- USERS ---
        if (cleanText.includes('insert into users')) {
            const [name, email, password, role] = params;
            const newUser = {
                id: generateUUID(),
                name,
                email: String(email).toLowerCase(),
                password,
                role: role || 'candidate',
                created_at: new Date().toISOString()
            };

            if (supabase) {
                try {
                    const { data, error } = await supabase.from('users').insert([newUser]).select();
                    if (!error && data) return { rows: data };
                } catch (e) { console.error('Supabase User Error:', e.message); }
            }

            store.users.push(newUser);
            store.save();
            return { rows: [newUser] };
        }

        if (cleanText.includes('from users')) {
            if (cleanText.includes('where email = $1')) {
                const email = String(params[0]).toLowerCase();

                // 1. Check Local First (Ensures manual updates in database.json work instantly during transition)
                const localUser = store.users.find(u => String(u.email).toLowerCase() === email);
                if (localUser && localUser.role === 'admin') {
                    console.log(`🛡️ Admin [${email}] check using Local Store priority`);
                    return { rows: [localUser] };
                }

                // 2. Fallback to Supabase for other users (Candidates)
                if (supabase) {
                    try {
                        const { data } = await supabase.from('users').select('*').eq('email', email);
                        if (data && data.length) return { rows: data };
                    } catch (e) { console.warn('Supabase User Fetch failed, falling back to local'); }
                }

                // 3. Fallback to local for non-admins if Supabase didn't find them
                const user = localUser || store.users.find(u => String(u.email).toLowerCase() === email);
                if (user) console.log(`✅ Found user: ${user.name} (${user.role})`);
                else console.warn(`❌ User not found by email: ${email}`);
                return { rows: user ? [user] : [] };
            }
            if (cleanText.includes('where id = $1')) {
                const id = params[0];
                if (supabase && isUUID(id)) {
                    const { data } = await supabase.from('users').select('*').eq('id', id);
                    if (data && data.length) return { rows: data };
                }
                const user = store.users.find(u => String(u.id) === String(id));
                return { rows: user ? [user] : [] };
            }
            if (supabase) {
                const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
                if (data) return { rows: data };
            }
            return { rows: store.users || [] };
        }

        // --- RESUMES ---
        if (cleanText.includes('insert into resumes')) {
            const [user_id, file_name, file_url, version] = params;
            const newResume = {
                id: generateUUID(),
                user_id,
                file_name,
                file_url,
                version: version || 1,
                created_at: new Date().toISOString()
            };

            if (supabase && isUUID(user_id)) {
                try {
                    const { data, error } = await supabase.from('resumes').insert([newResume]).select();
                    if (!error && data) return { rows: data };
                } catch (e) { console.error('Supabase Resume Error:', e.message); }
            }

            store.resumes.push(newResume);
            store.save();
            return { rows: [newResume] };
        }

        if (cleanText.includes('from resumes')) {
            if (cleanText.includes('u.name as candidate_name')) {
                // Admin Candidate List Query - TRUE HYBRID MERGE
                let supabaseData = [];
                if (supabase) {
                    try {
                        const { data } = await supabase.from('resumes')
                            .select('*, users(name, email), parsed_resumes(extracted_data)')
                            .order('created_at', { ascending: false });
                        if (data) {
                            supabaseData = data.map(r => ({
                                ...r,
                                candidate_name: r.users?.name,
                                candidate_email: r.users?.email,
                                score: r.parsed_resumes?.[0]?.extracted_data?.score || 0
                            }));
                        }
                    } catch (e) { console.error('Supabase Admin Fetch failed'); }
                }

                const localData = (store.resumes || []).map(r => {
                    const u = (store.users || []).find(user => String(user.id) === String(r.user_id));
                    const pEntry = (store.parsedResumes || []).find(pr => String(pr.resume_id) === String(r.id));
                    const p = pEntry ? safeParse(pEntry.extracted_data) : null;
                    return {
                        ...r,
                        candidate_name: u?.name || 'Unknown',
                        candidate_email: u?.email || 'N/A',
                        score: p?.score || p?.ats_score || 0
                    };
                });

                // Merge and Deduplicate by ID
                const merged = [...supabaseData];
                localData.forEach(localItem => {
                    if (!merged.find(s => String(s.id) === String(localItem.id))) {
                        merged.push(localItem);
                    }
                });

                return { rows: merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) };
            }

            if (cleanText.includes('where r.user_id = $1') || cleanText.includes('where user_id = $1')) {
                const user_id = params[0];
                let resumes = [];

                if (supabase && isUUID(user_id)) {
                    try {
                        const { data } = await supabase.from('resumes')
                            .select('*, parsed_resumes(extracted_data), ats_scores(score)')
                            .eq('user_id', user_id)
                            .order('created_at', { ascending: false });

                        if (data) {
                            resumes = data.map(r => {
                                const p = r.parsed_resumes?.[0]?.extracted_data;
                                const generalScore = Number(p?.score || p?.ats_score || 0);
                                const maxAtsScore = r.ats_scores?.length ? Math.max(...r.ats_scores.map(s => Number(s.score))) : 0;
                                return { ...r, score: Math.max(generalScore, maxAtsScore) };
                            });
                            return { rows: resumes };
                        }
                    } catch (e) { console.error('Supabase Resumes Fetch failed'); }
                }

                // Local Fallback
                resumes = (store.resumes || [])
                    .filter(r => String(r.user_id) === String(user_id))
                    .map(r => {
                        const pEntry = (store.parsedResumes || []).find(pr => String(pr.resume_id) === String(r.id));
                        const p = pEntry ? safeParse(pEntry.extracted_data) : null;
                        const generalScore = Number(p?.score || p?.ats_score || 0);

                        const ats = (store.atsScores || []).filter(s => String(s.resume_id) === String(r.id));
                        const maxAtsScore = ats.length ? Math.max(...ats.map(s => Number(s.score))) : 0;

                        const finalScore = Math.max(generalScore, maxAtsScore);
                        return { ...r, score: finalScore };
                    })
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                console.log(`✅ Returned ${resumes.length} resumes for user ${user_id}`);
                return { rows: resumes };
            }
            if (cleanText.includes('where id = $1')) {
                const id = params[0];
                if (supabase && isUUID(id)) {
                    const { data } = await supabase.from('resumes').select('*').eq('id', id);
                    if (data && data.length) return { rows: data };
                }
                const resume = (store.resumes || []).find(r => String(r.id) === String(id));
                return { rows: resume ? [resume] : [] };
            }
        }

        // --- PARSED RESUMES ---
        if (cleanText.includes('insert into parsed_resumes')) {
            const [resume_id, extracted_data, raw_text] = params;
            const dataObj = typeof extracted_data === 'string' ? safeParse(extracted_data) : extracted_data;
            const newParsed = {
                id: generateUUID(),
                resume_id,
                extracted_data: dataObj,
                raw_text,
                created_at: new Date().toISOString()
            };

            if (supabase && isUUID(resume_id)) {
                try {
                    await supabase.from('parsed_resumes').upsert([newParsed]);
                } catch (e) { console.error('Supabase Parsed Resume Error:', e.message); }
            }

            store.parsedResumes = store.parsedResumes || [];
            store.parsedResumes = store.parsedResumes.filter(p => String(p.resume_id) !== String(resume_id));
            store.parsedResumes.push(newParsed);
            store.save();
            return { rows: [newParsed] };
        }

        if (cleanText.includes('from parsed_resumes')) {
            const resume_id = params[0];
            if (supabase && isUUID(resume_id)) {
                const { data } = await supabase.from('parsed_resumes').select('*').eq('resume_id', resume_id);
                if (data && data.length) return { rows: data };
            }
            const parsed = (store.parsedResumes || []).find(p => String(p.resume_id) === String(resume_id));
            if (parsed) {
                parsed.extracted_data = safeParse(parsed.extracted_data);
            }
            return { rows: parsed ? [parsed] : [] };
        }

        // --- JOBS ---
        if (cleanText.includes('insert into jobs')) {
            const [title, description, department, status] = params;
            const newJob = { id: generateUUID(), title, description, department, status: status || 'Active', created_at: new Date().toISOString() };
            if (supabase) {
                const { data } = await supabase.from('jobs').insert([newJob]).select();
                if (data) return { rows: data };
            }
            store.jobs.push(newJob);
            store.save();
            return { rows: [newJob] };
        }

        if (cleanText.includes('from jobs')) {
            if (supabase) {
                const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
                if (data) return { rows: data };
            }
            return { rows: store.jobs || [] };
        }

        // --- ATS SCORES ---
        if (cleanText.includes('insert into ats_scores')) {
            const [resume_id, job_id, score, confidence, analysis] = params;
            const newScore = {
                id: generateUUID(),
                resume_id,
                job_id,
                score: Number(score),
                confidence,
                analysis: safeParse(analysis),
                created_at: new Date().toISOString()
            };
            if (supabase && isUUID(resume_id) && isUUID(job_id)) {
                await supabase.from('ats_scores').insert([newScore]);
            }
            store.atsScores = store.atsScores || [];
            store.atsScores.push(newScore);
            store.save();
            return { rows: [newScore] };
        }

        if (cleanText.includes('from ats_scores')) {
            if (cleanText.includes('where resume_id = $1')) {
                const resume_id = params[0];
                const scores = (store.atsScores || []).filter(s => String(s.resume_id) === String(resume_id));
                return { rows: scores };
            }
            if (cleanText.includes('where job_id = $1')) {
                const job_id = params[0];
                const scores = (store.atsScores || []).filter(s => String(s.job_id) === String(job_id));
                return { rows: scores };
            }
        }

        // --- GENERIC DELETE ---
        if (cleanText.includes('delete from')) {
            const parts = cleanText.split(' ');
            const fromIdx = parts.indexOf('from');
            const tableWithPunct = parts[fromIdx + 1];
            const table = tableWithPunct.replace(/[;,\)\(]/g, '').trim();
            const id = params[0];
            if (supabase && isUUID(id)) {
                await supabase.from(table).delete().eq('id', id);
            }
            if (store[table]) {
                store[table] = store[table].filter(item => String(item.id) !== String(id) && String(item.resume_id) !== String(id));
                store.save();
            }
            return { rows: [{ id }] };
        }

        console.warn(`⚠️ DB Fallback: Unhandled query: ${text}`);
        return { rows: [] };
    },
    pool: { on: () => { }, end: () => { } }
};

module.exports = db;
