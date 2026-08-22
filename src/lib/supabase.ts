import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '../types/user';

// Read Supabase credentials safely from Vite environment
const env = (import.meta as any).env || {};
const supabaseUrl = (env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Checks whether valid, non-placeholder Supabase production credentials exist
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (!supabaseUrl.startsWith('https://')) return false;
  if (!supabaseUrl.includes('.supabase.co')) return false;
  
  // Ignore dummy/template URLs
  const invalidKeywords = [
    'placeholder',
    'your-project',
    'your_project',
    'example',
    'sample',
    'my-project',
    'your-anon-key'
  ];
  
  for (const kw of invalidKeywords) {
    if (supabaseUrl.toLowerCase().includes(kw) || supabaseAnonKey.toLowerCase().includes(kw)) {
      return false;
    }
  }

  return true;
};

// Safe client (uses mock endpoint if not configured so app never crashes)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-disabled.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-disabled-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Trigger OAuth login with Google
 */
export async function signInWithGoogle(redirectTo?: string) {
  if (!isSupabaseConfigured()) {
    console.info('[Supabase Auth] Using demo Google OAuth provider (No live Supabase URL set in .env)');
    return { data: null, error: new Error('SUPABASE_NOT_CONFIGURED') };
  }

  const redirectUrl = redirectTo || `${window.location.origin}/login`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Trigger OAuth login with GitHub
 */
export async function signInWithGitHub(redirectTo?: string) {
  if (!isSupabaseConfigured()) {
    console.info('[Supabase Auth] Using demo GitHub OAuth provider (No live Supabase URL set in .env)');
    return { data: null, error: new Error('SUPABASE_NOT_CONFIGURED') };
  }

  const redirectUrl = redirectTo || `${window.location.origin}/login`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
        scopes: 'read:user user:email',
      },
    });

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Get current active session from Supabase
 */
export async function getSupabaseSession() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Map a Supabase Auth User object to SLA AI application User model
 */
export function mapSupabaseUserToAppUser(sbUser: SupabaseUser, roleOverride?: UserRole): User {
  const metadata = sbUser.user_metadata || {};
  const email = sbUser.email || metadata.email || 'oauth_user@enterprise.io';
  const name = metadata.full_name || metadata.name || metadata.user_name || email.split('@')[0];
  const avatar = metadata.avatar_url || metadata.picture || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

  let role: UserRole = roleOverride || 'CLIENT';
  let title = 'Client Technical Lead';

  if (!roleOverride) {
    if (metadata.role === 'ADMIN' || email.includes('admin') || email.includes('sarah')) {
      role = 'ADMIN';
      title = 'Principal SLA Architect';
    } else if (metadata.role === 'AGENT' || email.includes('sre') || email.includes('elena')) {
      role = 'AGENT';
      title = 'Staff SRE & Incident Commander';
    }
  }

  return {
    id: sbUser.id,
    name,
    email,
    role,
    title,
    company: metadata.company || 'Enterprise Global Partner',
    avatar,
    department: metadata.department || 'Infrastructure Engineering',
    activeTicketsCount: 0,
    maxCapacity: 6,
    isAvailable: true,
  };
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutSupabase() {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}
