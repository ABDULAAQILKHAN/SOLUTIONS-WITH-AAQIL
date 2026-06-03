'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, LayoutGrid, Settings, Loader2, Camera, Phone, MapPin, Briefcase, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/lib/constants'
import { getAuthToken, clearAuthToken } from '@/app/actions/auth'
import ProjectShowcase from '@/components/ProjectShowcase'
import AvatarCropModal from '@/components/AvatarCropModal'

// ── Validation ────────────────────────────────────────────────────────────────
const PHONE_RE = /^\+?[\d\s\-().]{7,}$/

function validateProfile(fields: {
  fullName: string
  phoneNumber: string
  designation: string
  address: string
}) {
  const e: Record<string, string> = {}
  if (!fields.fullName.trim() || fields.fullName.trim().length < 2)
    e.fullName = 'Full name must be at least 2 characters.'
  if (fields.phoneNumber && !PHONE_RE.test(fields.phoneNumber))
    e.phoneNumber = 'Please enter a valid phone number.'
  if (fields.designation.length > 100)
    e.designation = 'Designation must be under 100 characters.'
  if (fields.address.length > 200)
    e.address = 'Address must be under 200 characters.'
  return e
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-400 mt-1"
    >
      {msg}
    </motion.p>
  )
}

// ── Profile page ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string;[key: string]: unknown } | null>(null)
  const [loading, setLoading] = useState(true)

  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [designation, setDesignation] = useState('')

  const [updating, setUpdating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  // Crop modal state
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form validation
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (f: string) => setTouched((t) => ({ ...t, [f]: true }))
  const errors = validateProfile({ fullName, phoneNumber, designation, address })
  const fieldError = (f: string) => touched[f] ? errors[f] : undefined

  const showMessage = (text: string, ok: boolean) => {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 3500)
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await getAuthToken()
        if (!token) { router.push('/login'); return }

        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('Failed to fetch user')

        const data = await response.json()
        setUser(data)
        const meta = data.metadata || {}
        setFullName(`${meta.name || ''}`.trim())
        setAvatarUrl(data.avatarUrl || '')
        setPhoneNumber(meta.phone || '')
        setAddress(meta.address || '')
        setDesignation(meta.designation || '')
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    await clearAuthToken()
    router.push('/login')
    router.refresh()
  }

  // ── File selected → open crop modal ─────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image must be under 5 MB.', false)
      return
    }

    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    // Reset input so re-selecting same file re-triggers onChange
    e.target.value = ''
  }

  // ── Crop confirmed → upload blob ─────────────────────────────────────────
  const handleCropConfirmed = async (blob: Blob) => {
    setCropSrc(null)
    setUploadingImage(true)
    setMessage(null)
    try {
      const token = await getAuthToken()
      if (!token) throw new Error('No auth token')

      const formData = new FormData()
      formData.append('file', blob, 'avatar.jpg')

      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/users/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      setAvatarUrl(data.avatarUrl)
      showMessage('Avatar uploaded successfully!', true)
    } catch (err: unknown) {
      showMessage(err instanceof Error ? err.message : 'Upload failed.', false)
    } finally {
      setUploadingImage(false)
    }
  }

  // ── Profile update ───────────────────────────────────────────────────────
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ fullName: true, phoneNumber: true, designation: true, address: true })
    if (Object.keys(errors).length > 0) return

    setUpdating(true)
    setMessage(null)
    try {
      const token = await getAuthToken()
      if (!token) throw new Error('No auth token')

      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ metadata: { fullName, phoneNumber, address, designation } }),
      })
      if (!response.ok) throw new Error('Failed to update profile')
      showMessage('Profile updated successfully!', true)
    } catch (err: unknown) {
      showMessage(err instanceof Error ? err.message : 'Update failed.', false)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <>
      {/* ── Avatar Crop Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {cropSrc && (
          <AvatarCropModal
            imageSrc={cropSrc}
            onCrop={handleCropConfirmed}
            onClose={() => setCropSrc(null)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white relative">
        {/* Header */}
        <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
              Solutions with Aaqil
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden sm:inline-block">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Profile Settings ─────────────────────────────────── */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden p-6"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-400" /> Profile Settings
                </h2>

                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 group-hover:border-orange-500 transition-colors relative">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                          <Camera className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Loading / hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploadingImage
                        ? <Loader2 className="animate-spin w-6 h-6 text-orange-400" />
                        : <Upload className="w-6 h-6 text-white" />
                      }
                    </div>

                    {/* Permanent loading ring when uploading */}
                    {uploadingImage && (
                      <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {uploadingImage ? 'Uploading…' : 'Click to upload · max 5 MB'}
                  </p>
                </div>

                {/* Profile form */}
                <form onSubmit={handleUpdateProfile} noValidate className="space-y-4">
                  <AnimatePresence mode="wait">
                    {message && (
                      <motion.div
                        key={message.text}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-sm p-3 rounded-lg ${message.ok ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}
                      >
                        {message.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Designation */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      placeholder="e.g. Senior Developer"
                      onChange={(e) => setDesignation(e.target.value)}
                      onBlur={() => touch('designation')}
                      className={`w-full bg-zinc-950 border ${fieldError('designation') ? 'border-red-500/60' : 'border-zinc-700'} focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600`}
                    />
                    <FieldError msg={fieldError('designation')} />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => touch('fullName')}
                      className={`w-full bg-zinc-950 border ${fieldError('fullName') ? 'border-red-500/60' : 'border-zinc-700'} focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all`}
                    />
                    <FieldError msg={fieldError('fullName')} />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      placeholder="+1 (555) 000-0000"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onBlur={() => touch('phoneNumber')}
                      className={`w-full bg-zinc-950 border ${fieldError('phoneNumber') ? 'border-red-500/60' : 'border-zinc-700'} focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600`}
                    />
                    <FieldError msg={fieldError('phoneNumber')} />
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      placeholder="City, Country"
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={() => touch('address')}
                      className={`w-full bg-zinc-950 border ${fieldError('address') ? 'border-red-500/60' : 'border-zinc-700'} focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600`}
                    />
                    <FieldError msg={fieldError('address')} />
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-70 mt-4"
                  >
                    {updating
                      ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving…</>
                      : 'Update Profile'
                    }
                  </button>
                </form>
              </motion.div>
            </div>

            {/* ── Right: Project Showcase ────────────────────────────────── */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-orange-400" /> Accessible Projects
                </h2>

                {/* Showcase */}
                <div className="rounded-2xl overflow-hidden border border-white/5" style={{ height: 520 }}>
                  <ProjectShowcase />
                </div>

                {/* Mini list below showcase */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {PROJECTS.map((p) => (
                    <a
                      key={p.id}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-900 border border-white/5 rounded-xl p-3 hover:border-orange-500/30 transition-all group flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 overflow-hidden relative flex-shrink-0">
                        <Image src={`/${p.image}`} alt={p.title} fill className="object-cover" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium group-hover:text-orange-400 transition-colors truncate">
                        {p.title}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
