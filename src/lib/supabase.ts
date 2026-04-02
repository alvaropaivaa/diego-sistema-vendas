import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gvcfshufyfxspbcpriyn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QU06_ABvWfubFUWNGX7xNw_m31BAGxr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
