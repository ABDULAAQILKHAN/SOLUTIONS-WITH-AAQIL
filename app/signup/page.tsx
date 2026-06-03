'use client'

import React, { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Loader2, Check, User, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import ProjectShowcase from '@/components/ProjectShowcase'

// ── Validation helpers ────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateSignup(fields: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}) {
  const e: Record<string, string> = {}
  if (!fields.fullName.trim() || fields.fullName.trim().length < 2)
    e.fullName = 'Full name must be at least 2 characters.'
  if (!EMAIL_RE.test(fields.email))
    e.email = 'Please enter a valid email address.'
  if (fields.password.length < 8)
    e.password = 'Password must be at least 8 characters.'
  else if (!/[A-Z]/.test(fields.password) || !/[a-z]/.test(fields.password) || !/\d/.test(fields.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(fields.password))
    e.password = 'Password must include uppercase, lowercase, number, and special character.'
  if (fields.confirmPassword !== fields.password)
    e.confirmPassword = 'Passwords do not match.'
  return e
}

// ── Field error component ─────────────────────────────────────────────────────
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
  return `w-full bg-zinc-900/80 border ${error ? 'border-red-500/60' : 'border-zinc-800'} rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/40 focus:border-red-500/60' : 'focus:ring-orange-500/50 focus:border-orange-500/50'} transition-all placeholder:text-gray-600`
}

// ── Password strength ─────────────────────────────────────────────────────────
const PW_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
  { label: 'Special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

// ── Main form ─────────────────────────────────────────────────────────────────
function SignupContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // touched tracks which fields the user has left (blurred) at least once
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }))

  const errors = validateSignup({ fullName, email, password, confirmPassword })
  const fieldError = (f: string) => touched[f] ? errors[f] : undefined

  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mark everything touched so all errors surface
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true })
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    setServerError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          metadata: { name: fullName },
          redirectUrl: `${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}/login?message=${encodeURIComponent('Email verified successfully. You can now login.')}`
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Signup failed')
      router.push(`/login?message=${encodeURIComponent('Check your email to confirm your account')}`)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black z-0 pointer-events-none" />

      {/* ── Left: Project Showcase ─────────────────────────────────────────── */}
      <div className="hidden md:flex w-full md:w-1/2 flex-col relative z-10">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-8 bg-gradient-to-b from-black/80 to-transparent">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
            One Account. All Projects.
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Access our complete ecosystem of applications and tools.
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

      {/* ── Right: Signup Form ─────────────────────────────────────────────── */}
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-400">Join the Solutions with Aaqil ecosystem today.</p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              ⚠️ {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSignup} noValidate className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => touch('fullName')}
                  className={inputClass(fieldError('fullName'))}
                  required
                />
              </div>
              <FieldError msg={fieldError('fullName')} />
            </div>

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
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => touch('password')}
                  className={inputClass(fieldError('password'))}
                  required
                />
              </div>
              <FieldError msg={fieldError('password')} />

              {/* Inline strength checklist */}
              {password && (
                <div className="space-y-1 mt-2 text-xs bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                  {PW_RULES.map(({ label, test }) => {
                    const ok = test(password)
                    return (
                      <div key={label} className={`flex items-center gap-2 ${ok ? 'text-green-400' : 'text-gray-500'}`}>
                        <Check className={`w-3 h-3 ${ok ? 'opacity-100' : 'opacity-30'}`} />
                        {label}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => touch('confirmPassword')}
                  className={inputClass(fieldError('confirmPassword'))}
                  required
                />
              </div>
              <FieldError msg={fieldError('confirmPassword')} />
            </div>

            {/* Terms */}
            <div className="flex items-start mt-2">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 border border-zinc-700 rounded bg-zinc-900 focus:ring-2 focus:ring-orange-500/50 checked:bg-orange-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-orange-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-orange-400 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2 h-5 w-5" />Creating Account...</>
              ) : (
                <>Create Account<ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign in instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  )
}
