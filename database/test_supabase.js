import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('----------------------------------------------------');
console.log('AlumniConnect - Supabase PostgreSQL Connection Test');
console.log('----------------------------------------------------');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.log('⚠️  No valid Supabase credentials found in server/.env.');
  console.log('ℹ️  The backend will automatically run in local standalone mode.');
  console.log('ℹ️  To connect to Supabase:');
  console.log('   1. Sign up at https://supabase.com');
  console.log('   2. Create a new project and go to Settings > API');
  console.log('   3. Set SUPABASE_URL, SUPABASE_ANON_KEY, and USE_SUPABASE=true in server/.env');
  console.log('   4. Run server/database/supabase_schema.sql and supabase_seed.sql in Supabase SQL Editor');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log(`Connecting to: ${supabaseUrl}...`);
    const { data, error } = await supabase.from('users').select('id, email, role').limit(5);

    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      process.exit(1);
    }

    console.log('✅ Supabase connected successfully!');
    console.log(`Found ${data.length} users in database:`, data);
  } catch (err) {
    console.error('❌ Unexpected error during Supabase connection:', err.message);
    process.exit(1);
  }
}

testConnection();
