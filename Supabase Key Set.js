// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
// ✅ Replace this with your Supabase Edge Function URL
const SUPABASE_GET_HANDLERS_URL = "";

// ✅ Replace with your Supabase anon or service role key
const SUPABASE_GET_HANDLERS_KEY = "";
// 
// Function URL
const SUPABASE_INSERT_URL = "";

const SUPABASE_INSERT_KEY = "";

// Save into Keychain
Keychain.set("SUPABASE_GET_HANDLERS_URL", SUPABASE_GET_HANDLERS_URL);
Keychain.set("SUPABASE_GET_HANDLERS_KEY", SUPABASE_GET_HANDLERS_KEY);

Keychain.set("SUPABASE_INSERT_URL", SUPABASE_INSERT_URL);
Keychain.set("SUPABASE_INSERT_KEY", SUPABASE_INSERT_KEY);

console.log("✅ Supabase URL and Key saved to Keychain.");
