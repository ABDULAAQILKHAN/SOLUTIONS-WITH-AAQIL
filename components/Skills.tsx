"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Code, Database, Smartphone, Settings, Brain, Blocks, Globe, Zap } from "lucide-react"
import type { Skill } from "../types"

const skills: Skill[] = [
  // Frontend
  { name: "React", category: "Frontend" },
  { name: "Svelte", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Redux Toolkit", category: "Frontend" },

  // Backend
  { name: "FastAPI", category: "Backend" },
  { name: "NestJS", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "MongoDB", category: "Backend" },
  { name: "Springboot", category: "Backend" },

  // Database
  { name: "MongoDB", category: "Database" },
  { name: "MySQL", category: "Database" },
  { name: "Postgres", category: "Database" },
  { name: "Firebase", category: "Database" },
  { name: "Supabase", category: "Database" },

  // Mobile
  { name: "React Native", category: "Frontend" },
  { name: "Flutter", category: "Frontend" },

  // DevOps
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "AWS", category: "DevOps" },
  { name: "CI/CD", category: "DevOps" },
  { name: "Git/GitHub", category: "DevOps" },

  // AI & ML
  { name: "TensorFlow", category: "AI & ML" },
  { name: "OpenAI API", category: "AI & ML" },
  { name: "LangChain", category: "AI & ML" },
  { name: "Hugging Face", category: "AI & ML" },
  { name: "Computer Vision", category: "AI & ML" },

  // Web3 & Blockchain
  { name: "Ethereum", category: "Web3" },
  { name: "Solidity", category: "Web3" },
  { name: "Web3.js", category: "Web3" },
  { name: "MetaMask", category: "Web3" },
  { name: "Smart Contracts", category: "Web3" },

  // Automation
  { name: "n8n", category: "Automation" },
  { name: "Zapier", category: "Automation" },
  { name: "Selenium", category: "Automation" },
  { name: "Puppeteer", category: "Automation" },

  // Cloud & Modern Tools
  { name: "Vercel", category: "Cloud" },
  { name: "Netlify", category: "Cloud" },
  { name: "Firebase", category: "Cloud" },
  { name: "Supabase", category: "Cloud" },
]

const categoryIcons = {
  Frontend: Code,
  Backend: Database,
  Database: Database,
  Mobile: Smartphone,
  DevOps: Settings,
  "AI & ML": Brain,
  Web3: Blocks,
  Automation: Zap,
  Cloud: Globe,
}

const categoryColors = {
  Frontend: "from-blue-400 to-blue-600",
  Backend: "from-green-400 to-green-600",
  Database: "from-teal-400 to-teal-600",
  Mobile: "from-purple-400 to-purple-600",
  DevOps: "from-orange-400 to-orange-600",
  "AI & ML": "from-pink-400 to-pink-600",
  Web3: "from-yellow-400 to-yellow-600",
  Automation: "from-red-400 to-red-600",
  Cloud: "from-cyan-400 to-cyan-600",
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Skills & Technologies
          </h2>
          <p className="text-xl text-gray-300">Cutting-edge technologies I work with</p>
        </motion.div>

        <motion.div
          style={{ y, willChange: "transform" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
            const colorClass = categoryColors[category as keyof typeof categoryColors]

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-6 hover:bg-white/5 dark:hover:bg-black/30 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${colorClass} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {category}
                </h3>

                <div className="space-y-2">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.03 }}
                      className="px-3 py-2 bg-white/3 dark:bg-black/20 rounded-lg text-gray-300 font-medium cursor-pointer transition-all duration-200 hover:bg-white/5 dark:hover:bg-black/30 hover:text-white"
                      whileHover={{ x: 3 }}
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
