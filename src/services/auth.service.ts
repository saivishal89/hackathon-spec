// Authentication & User Identity Service
import { supabase, isSupabaseConfigured, mapSupabaseUserToAppUser } from '../lib/supabase';
import { User, UserRole } from '../types/user';
import { MOCK_USERS } from '../data/mockUsers';

export class AuthService {
  /**
   * Registers a new user with Supabase Auth or mock local state
   */
  static async register(params: {
    email: string;
    password?: string;
    fullName: string;
    role?: 'client' | 'admin';
    company?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const role: UserRole = params.role === 'admin' ? 'ADMIN' : 'CLIENT';

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: params.email,
          password: params.password || 'SecurePass2026!',
          options: {
            data: {
              full_name: params.fullName,
              role: params.role || 'client',
              company: params.company || 'Enterprise Partner',
            },
          },
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
          const mapped = mapSupabaseUserToAppUser(data.user, role);
          return { success: true, user: mapped };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local state fallback
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: params.fullName,
      email: params.email,
      role,
      title: role === 'ADMIN' ? 'SLA Operations Lead' : 'Client Operations Lead',
      company: params.company || 'Enterprise Global Systems',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    return { success: true, user: newUser };
  }

  /**
   * Fetches user profile from profiles table
   */
  static async getProfile(userId: string): Promise<User | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            name: data.full_name,
            email: data.email,
            role: data.role.toUpperCase() as UserRole,
            title: data.role === 'admin' ? 'Operations Admin' : 'Client Technical Lead',
            company: data.company || 'Enterprise Partner',
            avatar: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          };
        }
      } catch {
        // fallback
      }
    }

    const mock = MOCK_USERS.find(u => u.id === userId);
    return mock || null;
  }
}
