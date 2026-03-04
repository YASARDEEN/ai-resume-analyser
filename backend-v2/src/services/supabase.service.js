const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

let supabase = null;

if (config.supabase.url && config.supabase.anonKey && config.supabase.url !== 'your_supabase_project_url') {
    supabase = createClient(config.supabase.url, config.supabase.anonKey);
    console.log('✅ Supabase Client Initialized');
} else {
    console.warn('⚠️ Supabase credentials missing. Supabase features will be disabled.');
}

module.exports = supabase;
