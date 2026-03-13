'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Loader2, Check, LayoutGrid, User, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/lib/constants'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Password complexity check
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLengthValid = password.length >= 8

    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLengthValid)) {
      setError("Password does not meet complexity requirements")
      setLoading(false)
      return
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/login`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Attempt to update profile immediately if user is created
    if (authData.user) {
      // NOTE: Ensure 'id' in 'profiles' table is of type UUID/text, not bigint/integer
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString(),
        })
        
      if (profileError) {
        console.error('Error creating profile:', profileError)
        // If the error is about input syntax for type bigint, it confirms the schema mismatch.
        // The id from auth.users is a UUID (string), but your table might expect a number.
        if (profileError.code === "22P02") {
            setError("Database configuration error: Profile ID type mismatch. Please contact support.")
            setLoading(false)
            return
        }
      }
      
      // Auto login or redirect to confirmation page
      // For email confirmation flow:
      router.push('/login?message=Check your email to confirm your account')
    } else {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black z-0 pointer-events-none" />

      {/* Left Section - Projects Showcase */}
      <div className="w-full md:w-1/2 p-6 md:p-12 relative z-10 flex flex-col justify-center bg-zinc-950 border-r border-white/5">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
            One Account. All Projects.
          </h1>
          <p className="text-gray-400 text-lg">
            Create an account to access our complete ecosystem of applications and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group hover:opacity-40"
            >
              <div className="h-32 bg-zinc-800 relative overflow-hidden">
                {/* Fallback image placeholder if no image exists yet */}
                <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                  <LayoutGrid className="w-10 h-10" />
                </div>
                <Image 
                  src={`/${project.image}`} 
                  alt={project.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                /> 
                
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                   <h3 className="font-bold text-white text-sm">{project.title}</h3>
                 </div>
              </div>
              <div className="p-3">
                 <p className="text-xs text-gray-400 line-clamp-2 mb-2">{project.description}</p>
                 <div className="flex flex-wrap gap-1">
                   {project.category.split(',').slice(0, 2).map((tag, i) => (
                     <span key={i} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-400">
                       {tag.trim()}
                     </span>
                   ))}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 hidden md:flex">
             <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-orange-500" /> Secure Access</div>
             <div className="flex items-center gap-1"><User className="w-4 h-4 text-red-500" /> Single Identity</div>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
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

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center"
            >
              <span className="mr-2">⚠️</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                  required
                />
              </div>
              
              {/* Password Complexity Checklist */}
              {password && (
                <div className="space-y-1 mt-2 text-xs bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                   <p className="font-medium mb-1 text-gray-400">Password strength:</p>
                   <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}>
                      <Check className="w-3 h-3" /> At least 8 characters
                   </div>
                   <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                      <Check className="w-3 h-3" /> Uppercase letter
                   </div>
                   <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                      <Check className="w-3 h-3" /> Lowercase letter
                   </div>
                   <div className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                      <Check className="w-3 h-3" /> Number
                   </div>
                   <div className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                      <Check className="w-3 h-3" /> Special character
                   </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-zinc-900/80 border ${confirmPassword && password !== confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-orange-500/50'} rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 ${confirmPassword && password !== confirmPassword ? 'focus:ring-red-500/50' : 'focus:ring-orange-500/50'} transition-all placeholder:text-gray-600`}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-400 ml-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 border border-zinc-700 rounded bg-zinc-900 focus:ring-3 focus:ring-orange-500 focus:ring-opacity-50 checked:bg-orange-500"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I agree to the <a href="#" className="text-orange-400 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-400 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
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
