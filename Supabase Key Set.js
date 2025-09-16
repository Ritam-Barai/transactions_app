// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
// ✅ Replace this with your Supabase Edge Function URL
const SUPABASE_GET_HANDLERS_URL = "https://udshfriodvtamglqievl.supabase.co/functions/v1/data_get_handlers";

// ✅ Replace with your Supabase anon or service role key
const SUPABASE_GET_HANDLERS_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkc2hmcmlvZHZ0YW1nbHFpZXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5MDc5ODksImV4cCI6MjAzOTQ4Mzk4OX0.hEP6vyHxinjFQJnq2r4vnysGAwYqNVt26NXdDies_Zc";
// 
// Function URL
const SUPABASE_INSERT_URL = "https://udshfriodvtamglqievl.supabase.co/functions/v1/process_json";

const SUPABASE_INSERT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkc2hmcmlvZHZ0YW1nbHFpZXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5MDc5ODksImV4cCI6MjAzOTQ4Mzk4OX0.hEP6vyHxinjFQJnq2r4vnysGAwYqNVt26NXdDies_Zc";

// Save into Keychain
Keychain.set("SUPABASE_GET_HANDLERS_URL", SUPABASE_GET_HANDLERS_URL);
Keychain.set("SUPABASE_GET_HANDLERS_KEY", SUPABASE_GET_HANDLERS_KEY);

Keychain.set("SUPABASE_INSERT_URL", SUPABASE_INSERT_URL);
Keychain.set("SUPABASE_INSERT_KEY", SUPABASE_INSERT_KEY);

console.log("✅ Supabase URL and Key saved to Keychain.");