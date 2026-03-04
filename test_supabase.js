const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend-v2/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ Supabase Connection Error:', error.message);
            if (error.code === 'PGRST116') {
                console.log('ℹ️ Note: This might mean the table does not exist.');
            }
        } else {
            console.log('✅ Connected to Supabase! Tables exist.');
        }
    } catch (e) {
        console.error('❌ Exception:', e.message);
    }
}

testConnection();
