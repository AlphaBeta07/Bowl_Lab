'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, Package, LogOut, LogIn, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const { user, isAdmin, signIn, signUp, signOut, switchRole } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (authMode === 'login') {
      await signIn(email);
      setMsg('Signed in successfully!');
    } else {
      await signUp(email, fullName, phone);
      setMsg('Account created successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-border pb-6 flex items-baseline justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
              Membership &amp; Orders
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mt-1">
              Customer Account
            </h1>
          </div>
          {user && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Profile Info (6 cols) */}
            <div className="md:col-span-6 bg-surface border border-border rounded-3xl p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xl text-accent font-bold">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{user.fullName || 'Foodie Member'}</h3>
                  <p className="text-xs text-secondary font-mono">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-secondary">Phone Number</span>
                  <span className="font-mono font-medium text-foreground">{user.phone || '+91 98765 12345'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-secondary">Account Role</span>
                  <span className="font-mono font-bold uppercase text-accent">{user.role}</span>
                </div>
              </div>

              {/* Role Switcher Pill */}
              <div className="pt-2">
                <button
                  onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
                  className="w-full py-2.5 px-4 rounded-xl border border-border bg-cream-50 hover:bg-cream-100 text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  <span>Switch Role to {isAdmin ? 'Customer' : 'Admin'}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions (6 cols) */}
            <div className="md:col-span-6 space-y-4">
              
              <Link
                href="/account/orders"
                className="block bg-surface border border-border rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-cream-100 flex items-center justify-center text-accent">
                    <Package className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-bold text-base text-foreground">Order History &amp; Tracking</h4>
                <p className="text-xs text-secondary mt-1">
                  View past bowl receipts, current kitchen status, and re-order your favorite recipes.
                </p>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="block bg-surface border border-accent/40 rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      <Shield className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-base text-accent">Admin Management Dashboard</h4>
                  <p className="text-xs text-secondary mt-1">
                    Manage catalog ingredients, update kitchen orders, set restaurant hours, and mark COD as paid.
                  </p>
                </Link>
              )}

            </div>

          </div>
        ) : (
          <div className="max-w-md mx-auto bg-surface border border-border rounded-3xl p-8 shadow-card space-y-6">
            <div className="text-center">
              <h2 className="font-display font-black text-2xl text-foreground">
                {authMode === 'login' ? 'Sign In to BOWL LAB' : 'Create an Account'}
              </h2>
              <p className="text-xs text-secondary mt-1">
                Access your past custom recipes and track live kitchen orders.
              </p>
            </div>

            {msg && <p className="text-xs text-emerald-600 font-bold text-center">{msg}</p>}

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Anish Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-xs font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="foodie@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider shadow-floating transition-all"
              >
                {authMode === 'login' ? 'Continue with Email' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-xs text-secondary pt-2">
              {authMode === 'login' ? (
                <button
                  onClick={() => setAuthMode('signup')}
                  className="underline hover:text-foreground"
                >
                  Need an account? Sign up
                </button>
              ) : (
                <button
                  onClick={() => setAuthMode('login')}
                  className="underline hover:text-foreground"
                >
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

