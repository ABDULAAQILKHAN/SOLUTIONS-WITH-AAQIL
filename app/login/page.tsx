'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, ArrowRight, Loader2, ShieldCheck, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { setAuthToken } from '@/app/actions/auth'
import ProjectShowcase from '@/components/ProjectShowcase'

// ── Validation ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateLogin(fields: { email: string; password: string }) {
  const e: Record<string, string> = {}
  if (!EMAIL_RE.test(fields.email)) e.email = 'Please enter a valid email address.'
  if (!fields.password) e.password = 'Password is required.'
  return e
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-400 mt-1 ml-1"
    >
      {msg}
    </motion.p>
  )
}

function inputClass(error?: string) {
  return `w-full bg-black/50 border ${error ? 'border-red-500/60' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/40 focus:border-red-500/60' : 'focus:ring-orange-500/50 focus:border-orange-500/50'} transition-all placeholder:text-gray-600`
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (f: string) => setTouched((t) => ({ ...t, [f]: true }))

  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const errors = validateLogin({ email, password })
  const fieldError = (f: string) => touched[f] ? errors[f] : undefined

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    setServerError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')
      if (data.accessToken) {
        await setAuthToken(data.accessToken)
        router.push('/profile')
        router.refresh()
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black z-0 pointer-events-none" />

      {/* ── Left: Project Showcase ─────────────────────────────────────────── */}
      <div className="hidden md:flex w-full md:w-1/2 flex-col relative z-10">
        <div className="absolute top-0 left-0 right-0 z-10 p-8 bg-gradient-to-b from-black/80 to-transparent">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
            One Account. All Projects.
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to access your complete ecosystem.
          </p>
        </div>
        <div className="flex-1">
          <ProjectShowcase />
        </div>
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> Secure Access</span>
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-red-500" /> Single Identity</span>
        </div>
      </div>

      {/* ── Right: Login Form ──────────────────────────────────────────────── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        {/* SOL Button */}
        <Link
          href="/"
          className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center justify-center w-fit h-fit px-6 py-2 rounded-full bg-orange/5  hover:bg-orange/10 transition-all border border-orange/10 text-orange font-bold text-sm tracking-widest backdrop-blur-sm hover:scale-105"
        >
          Solutions with Aaqil
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-tr from-orange-500 to-red-600 p-3 rounded-xl shadow-lg shadow-orange-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-center mb-8">Sign in to continue your journey</p>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              ⚠️ {serverError}
            </motion.div>
          )}

          {message && (
            <div className="bg-blue-500/10 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => touch('email')}
                  className={inputClass(fieldError('email'))}
                  required
                />
              </div>
              <FieldError msg={fieldError('email')} />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <Link href="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => touch('password')}
                  className={inputClass(fieldError('password'))}
                  required
                />
              </div>
              <FieldError msg={fieldError('password')} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2 h-5 w-5" />Signing in...</>
              ) : (
                <>Sign In<ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign up now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
