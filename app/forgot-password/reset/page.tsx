'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { KeyRound, Lock, Loader2, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { PROJECT_ORIGINS } from '@/lib/constants';

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const fromKey = searchParams.get('from')?.toLowerCase() || null;
  const originProject = fromKey && PROJECT_ORIGINS[fromKey] ? PROJECT_ORIGINS[fromKey] : null;

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const isLengthValid = newPassword.length >= 8;

    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLengthValid)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        if (originProject) {
          window.location.href = originProject.returnUrl;
        } else {
          router.push('/login');
        }
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-orange-500 to-red-600 p-3 rounded-xl shadow-lg shadow-orange-500/20">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
          Secure Your Account
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {originProject
            ? <>Set a new password to continue to <span className="text-white font-medium">{originProject.name}</span></>
            : 'Enter your new password below'
          }
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-start"
          >
            <span className="mr-2 mt-0.5">⚠️</span>
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 text-sm"
          >
            <div className="flex items-center mb-2">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-400 shrink-0" />
              <span>
                Password reset successfully!{' '}
                {originProject
                  ? <>Redirecting you back to <span className="text-white font-medium">{originProject.name}</span>…</>
                  : 'Redirecting to login…'
                }
              </span>
            </div>
            {originProject && (
              <a
                href={originProject.returnUrl}
                className={`inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r ${originProject.accentColor} ${originProject.accentColorTo} hover:opacity-90 transition-opacity`}
              >
                Go to {originProject.name} now <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-300 ml-1">
              New Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
              <input
                type="password"
                id="newPassword"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Resetting...
              </>
            ) : success ? (
              'Success'
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          Remember your password?{' '}
          <Link
            href={`/login${fromKey ? `?from=${fromKey}` : ''}`}
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
