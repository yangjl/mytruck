'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions/auth';
import Link from 'next/link';
import { UsersIcon } from '@/components/icons';

export default function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc]">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
             <div className="bg-[#e94e77] p-3 rounded-full text-white">
                <UsersIcon className="w-8 h-8" />
             </div>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
          <form action={dispatch} className="flex flex-col gap-4 mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e94e77]"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e94e77]"
              required
              minLength={6}
            />
            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">{errorMessage}</p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#e94e77] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d13c65] transition disabled:opacity-60"
            >
              {isPending ? 'Logging in…' : 'Log In'}
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#e94e77] hover:underline font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
