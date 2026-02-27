import { createClient } from '@supabase/supabase-js';

// Эти переменные должны быть заданы в Vercel Environment Variables
// Для локальной разработки используем .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
