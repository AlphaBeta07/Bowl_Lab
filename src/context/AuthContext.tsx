'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, role?: 'customer' | 'admin') => Promise<void>;
  signUp: (email: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: 'customer' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: UserProfile = {
  id: 'usr-demo-101',
  email: 'foodie@bowllab.in',
  fullName: 'Anish Sharma',
  phone: '+91 98765 12345',
  role: 'customer',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USER);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user saved in localStorage
    try {
      const saved = localStorage.getItem('bowllab_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (typeof window !== 'undefined') {
      if (u) {
        localStorage.setItem('bowllab_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('bowllab_user');
      }
    }
  };

  const signIn = async (email: string, role: 'customer' | 'admin' = 'customer') => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signInWithOtp({ email });
      }
      const loggedUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role,
      };
      saveUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, fullName: string, phone: string) => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        fullName,
        phone,
        role: 'customer',
      };
      saveUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    saveUser(null);
  };

  const switchRole = (newRole: 'customer' | 'admin') => {
    if (user) {
      const updated = { ...user, role: newRole };
      saveUser(updated);
    } else {
      saveUser({
        id: `usr-admin-${Date.now()}`,
        email: 'admin@bowllab.in',
        fullName: 'Lab Chef (Admin)',
        role: newRole,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === 'admin',
        signIn,
        signUp,
        signOut,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

