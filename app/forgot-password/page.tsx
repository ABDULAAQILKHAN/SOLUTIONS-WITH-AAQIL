'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Loader2, CheckCircle, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { PROJECT_ORIGINS } from '@/lib/constants'

function ForgotPasswordContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const searchParams = useSearchParams()

  const fromKey = searchParams.get('from')?.toLowerCase() || null
  const originProject = fromKey && PROJECT_ORIGINS[fromKey] ? PROJECT_ORIGINS[fromKey] : null

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/profile/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0 pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 z-10">
        {/* ─── Origin Project Card (shown when ?from= is present) ─── */}
        {originProject && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full md:w-1/2 flex flex-col justify-center"
          >
            <a
              href={originProject.returnUrl}
              className="inline-flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors group w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to {originProject.name}
            </a>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              {/* Project image */}
              <div className="relative w-full aspect-video">
                <Image
                  src={`/${originProject.image}`}
                  alt={originProject.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-gradient-to-r ${originProject.accentColor} ${originProject.accentColorTo} text-white`}>
                    {originProject.tagline}
                  </div>
                  <h2 className="text-xl font-bold text-white">{originProject.name}</h2>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-gray-400 text-sm leading-relaxed">{originProject.description}</p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2">
                  {originProject.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/5 border border-white/10 text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={originProject.returnUrl}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r ${originProject.accentColor} ${originProject.accentColorTo} hover:opacity-90 transition-opacity shadow-lg`}
                >
                  Open {originProject.name} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Reset Password Form ─── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`w-full ${originProject ? 'md:w-1/2' : 'max-w-md mx-auto'} bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl flex flex-col justify-center`}
        >
          {!originProject && (
            <Link href="/login" className="inline-flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          )}
          
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-gray-400 mb-6 text-sm">
            {originProject
              ? <>Enter your email to reset your password for <span className="text-white font-medium">{originProject.name}</span>.</>
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>

          {success ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center"
             >
               <div className="flex justify-center mb-3">
                 <CheckCircle className="w-12 h-12 text-green-400" />
               </div>
               <h3 className="font-semibold text-green-400 mb-2">Check your email</h3>
               <p className="text-gray-300 text-sm">We've sent a password reset link to <span className="text-white font-medium">{email}</span></p>

               {originProject && (
                 <a
                   href={originProject.returnUrl}
                   className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r ${originProject.accentColor} ${originProject.accentColorTo} hover:opacity-90 transition-opacity`}
                 >
                   Return to {originProject.name} <ExternalLink className="w-3.5 h-3.5" />
                 </a>
               )}
             </motion.div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
               {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {/* Bottom links */}
          <div className="mt-6 text-center text-gray-400 text-sm space-y-2">
            <div>
              Remember your password?{' '}
              <Link href={`/login${fromKey ? `?from=${fromKey}` : ''}`} className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Sign in
              </Link>
            </div>
            <div>
              Don&apos;t have an account?{' '}
              <Link href={`/signup${fromKey ? `?from=${fromKey}` : ''}`} className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordContent />
    </Suspense>
  )
}
