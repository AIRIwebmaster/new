'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Turnstile } from '@/components/ui/turnstile';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = '/mydashboard';
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grey-50 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Image
            src="/images/logo.png"
            alt="AIRI Foundation"
            width={120}
            height={40}
            className="mx-auto mb-6"
          />
          <h1 className="text-h4 text-foreground">AIRI Admin Dashboard</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none"
              placeholder="you@airifoundation.org"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none"
            />
          </div>

          

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-grey-light">
          AIRI Foundation &middot; Internal Use Only
        </p>
      </div>
    </div>
  );
}
