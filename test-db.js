const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      if (key === 'SUPABASE_URL') supabaseUrl = value.trim();
      if (key === 'SUPABASE_ANON_KEY') supabaseAnonKey = value.trim();
    }
  }
} catch (err) {
  console.log('Error reading .env file, using default parameters.');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase variables in .env file!');
  process.exit(1);
}

console.log('Connecting to Supabase at:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, status')
      .limit(3);

    if (error) {
      console.error('\n❌ Supabase Connection Failed or Table does not exist!');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('\nRecommendation: Please run the SQL queries in `supabase-schema.sql` inside the Supabase SQL Editor first.');
    } else {
      console.log('\n✅ Successfully connected to Supabase and fetched projects!');
      console.log('Sample Data fetched:', data);
    }
  } catch (err) {
    console.error('Execution error:', err.message);
  }
}

checkConnection();
