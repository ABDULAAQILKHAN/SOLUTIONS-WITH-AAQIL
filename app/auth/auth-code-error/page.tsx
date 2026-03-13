
'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthCodeError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-red-500/30 p-8 rounded-2xl shadow-2xl z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
        <p className="text-gray-400 mb-6">
          {errorDescription || "There was a problem authenticating your account."} 
        </p>

        {errorCode && (
            <div className="bg-zinc-950 p-3 rounded-lg border border-white/5 mb-6 text-xs text-gray-500 font-mono">
                Error Code: {errorCode}
            </div>
        )}

        <Link 
            href="/login"
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
            Back to Login <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  )
}
