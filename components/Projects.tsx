"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ExternalLink, Handshake, Building2, Utensils, Shield, Stethoscope, ArrowUpRight } from "lucide-react"

interface Partner {
  id: string
  name: string
  category: string
  description: string
  services: string[]
  icon: typeof Building2
  color: string
  url?: string
  status: "active" | "potential"
}

const partners: Partner[] = [
  {
    id: "royal-it",
    name: "Royal IT Services",
    category: "IT Solutions",
    description: "Comprehensive IT infrastructure and managed services provider. We deliver enterprise-grade technology solutions including network setup, cybersecurity, and cloud migration.",
    services: ["Web Development", "IT Infrastructure", "Cloud Solutions", "Technical Support"],
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    url: "https://www.royalitservice.com/",
    status: "active"
  },
  {
    id: "zayka-darbar",
    name: "Zayka Darbar",
    category: "Food & Hospitality",
    description: "Modern restaurant management system with online ordering, real-time tracking, and seamless customer experience. A complete digital transformation for the food industry.",
    services: ["E-commerce Platform", "Order Management", "Admin Dashboard", "Customer Portal"],
    icon: Utensils,
    color: "from-orange-500 to-red-500",
    url: "https://zaykadarbar.vercel.app/",
    status: "active"
  },
  {
    id: "ss-security",
    name: "SS Security Services",
    category: "Security Solutions",
    description: "Professional security management solutions with staff scheduling, incident reporting, and client portal. Streamlining security operations for modern businesses.",
    services: ["Staff Management", "Incident Reporting", "Client Dashboard", "Mobile App"],
    icon: Shield,
    color: "from-green-500 to-emerald-500",
    url: "https://ss-computers.vercel.app/",
    status: "active"
  },
  {
    id: "rehmat-clinic",
    name: "Rehmat Clinic - Dr. Faisal Khan",
    category: "Healthcare",
    description: "Digital healthcare solution for patient management, appointment scheduling, and medical records. Bringing modern technology to healthcare services.",
    services: ["Patient Portal", "Appointment System", "Medical Records", "Telemedicine"],
    icon: Stethoscope,
    color: "from-purple-500 to-pink-500",
    url: "#",
    status: "potential"
  }
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const activePartners = partners.filter(p => p.status === "active")
  const potentialPartners = partners.filter(p => p.status === "potential")

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Handshake className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Business Partners
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trusted partnerships delivering digital transformation across industries. Building success stories together.
          </p>
        </motion.div>

        {/* Active Partners */}
        <motion.div
          style={{ y, willChange: "transform" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {activePartners.map((partner, index) => {
            const IconComponent = partner.icon

            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-6 hover:bg-white/5 dark:hover:bg-black/30 transition-all duration-300 group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${partner.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-300`} />

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                    ACTIVE PARTNER
                  </span>
                  <span className="text-gray-500 text-sm">{partner.category}</span>
                </div>

                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${partner.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {partner.name}
                </h3>

                <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                  {partner.description}
                </p>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {partner.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-xs font-medium border border-white/10"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {partner.url && partner.url !== "#" && (
                  <motion.a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 font-medium text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Visit Project
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </motion.a>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Potential Partners Section */}
        {potentialPartners.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Upcoming Collaborations
              </h3>
              <p className="text-gray-400">Exciting partnerships in the pipeline</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {potentialPartners.map((partner, index) => {
                const IconComponent = partner.icon

                return (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-dashed border-orange-400/30 rounded-2xl p-6 hover:bg-white/5 dark:hover:bg-black/30 transition-all duration-300 group"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${partner.color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </motion.div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                            {partner.name}
                          </h4>
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold border border-orange-500/30">
                            COMING SOON
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{partner.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {partner.services.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="px-2 py-1 bg-white/5 text-gray-400 rounded-md text-xs border border-white/5"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {/* Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Interested in Partnership?
            </h3>
            <p className="text-gray-400 mb-6">
              Let's build something amazing together. Transform your business with cutting-edge technology.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start a Conversation
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
