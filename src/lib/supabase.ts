import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '../types/user';

// Read Supabase credentials safely from Vite environment
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Fallback mock/safe client if not yet configured with production keys
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
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
    console.warn('[Supabase Auth] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured yet in .env');
    return { data: null, error: new Error('Supabase credentials not configured in .env') };
  }

  const redirectUrl = redirectTo || `${window.location.origin}/login`;

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
}

/**
 * Trigger OAuth login with GitHub
 */
export async function signInWithGitHub(redirectTo?: string) {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase Auth] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured yet in .env');
    return { data: null, error: new Error('Supabase credentials not configured in .env') };
  }

  const redirectUrl = redirectTo || `${window.location.origin}/login`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectUrl,
      scopes: 'read:user user:email',
    },
  });

  return { data, error };
}

/**
 * Get current active session from Supabase
 */
export async function getSupabaseSession() {
  if (!isSupabaseConfigured()) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session;
}

/**
 * Map a Supabase Auth User object to SLA AI application User model
 */
export function mapSupabaseUserToAppUser(sbUser: SupabaseUser, roleOverride?: UserRole): User {
  const metadata = sbUser.user_metadata || {};
  const email = sbUser.email || metadata.email || 'oauth_user@enterprise.io';
  const name = metadata.full_name || metadata.name || metadata.user_name || email.split('@')[0];
  const avatar = metadata.avatar_url || metadata.picture || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

  // Determine role: default to CLIENT or map based on metadata/email
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
  await supabase.auth.signOut();
}
