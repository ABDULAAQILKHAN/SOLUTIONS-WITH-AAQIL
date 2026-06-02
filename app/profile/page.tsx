'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, LayoutGrid, Settings, Loader2, ExternalLink, Camera, Phone, MapPin, Briefcase, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/lib/constants'
import { getAuthToken, clearAuthToken } from '@/app/actions/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string;[key: string]: unknown } | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile State
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [designation, setDesignation] = useState('')

  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await getAuthToken()
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const data = await response.json()
        setUser(data)

        const metadata = data.metadata || {}
        setFullName(`${metadata.fullName}`.trim())
        setAvatarUrl(data.avatarUrl || '')
        setPhoneNumber(metadata.phoneNumber || '')
        setAddress(metadata.address || '')
        setDesignation(metadata.designation || '')

      } catch (err) {
        console.error('Error fetching user:', err)
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true)
      setMessage(null)
      const file = event.target.files?.[0]
      if (!file) return

      const token = await getAuthToken()
      if (!token) throw new Error('No auth token')

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/users/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setAvatarUrl(data.avatarUrl)
      setMessage('Avatar uploaded successfully!')
      setTimeout(() => setMessage(null), 3000)
    } catch (error: unknown) {
      setMessage(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage(null)

    if (!user) return

    try {
      const token = await getAuthToken()
      if (!token) throw new Error('No auth token')

      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_PRO_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          metadata: {
            fullName,
            phoneNumber,
            address,
            designation
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(null), 3000)
    } catch (err: unknown) {
      setMessage(`Error saving profile: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
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
          {/* Profile Settings */}
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
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 group-hover:border-orange-500 transition-colors relative">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploadingImage ? <Loader2 className="animate-spin w-6 h-6 text-white" /> : <Upload className="w-6 h-6 text-white" />}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Click to upload avatar</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {message && (
                  <div className={`text-sm p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/10 text-red-200' : 'bg-green-500/10 text-green-200'}`}>
                    {message}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    placeholder="e.g. Senior Developer"
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    placeholder="+1 (555) 000-0000"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    placeholder="City, Country"
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-orange-500 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
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
                  {updating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : 'Update Profile'}
                </button>
              </form>
            </motion.div>
          </div>

          {/* My Projects */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-orange-400" /> Accessible Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECTS.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all group flex flex-col h-full"
                  >
                    <div className="h-40 bg-zinc-800 relative group-hover:bg-zinc-800/80 transition-colors">
                      {/* Project Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={`/${project.image}`}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                      </div>

                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded z-10">
                        ID: {project.id}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 z-10">
                        <h3 className="font-bold text-lg text-white">{project.title}</h3>
                        <p className="text-xs text-orange-200">{project.category}</p>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between relative bg-zinc-900 z-20">
                      <p className="text-sm text-gray-400 mb-4">{project.description}</p>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full bg-zinc-800 hover:bg-orange-600 hover:text-white text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors gap-2 group-hover:bg-zinc-700"
                      >
                        Access Project <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
