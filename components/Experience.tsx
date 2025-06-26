"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Briefcase, CheckCircle, Calendar, MapPin } from "lucide-react"

interface ExperienceType {
  id: string
  company: string
  role: string
  duration: string
  location: string
  achievements: string[]
  technologies: string[]
}

const experiences: ExperienceType[] = [
  {
    id: "1",
    company: "Techdome Solutions Pvt. Ltd",
    role: "Associate Software Development Engineer",
    duration: "May 2023 – Present",
    location: "Indore, India",
    achievements: [
      "Spearheaded end-to-end delivery of six multifaceted software solutions using React, Svelte, FastAPI, NestJS, and Express",
      "Engineered RESTful APIs and responsive front-end interfaces, achieving 30% improvement in user engagement metrics",
      "Established Docker-based microservice architecture, facilitating streamlined CI/CD pipelines and enhancing system modularity",
      "Orchestrated integration of PostgreSQL and MongoDB, optimizing data transactions for scalable, low-latency storage solutions",
      "Led hardening of self-hosted enterprise application infrastructure with robust SSL/TLS certificate management",
      "Contributed to architecture-level design decisions for scalable system modules",
    ],
    technologies: ["React", "Svelte", "FastAPI", "NestJS", "Docker", "PostgreSQL", "MongoDB"],
  },
  {
    id: "2",
    company: "Blaccskull Platforms Pvt. Ltd",
    role: "Full Stack Developer Intern",
    duration: "March 2023 – April 2024",
    location: "Remote",
    achievements: [
      "Designed and implemented responsive web/mobile interfaces using React and React Native, enhancing mobile UX efficiency by 50%",
      "Developed and optimized backend logic using Node.js and Express, resulting in 25% reduction in response latency",
      "Employed Git-based workflows within distributed team context, managing parallel development streams via branching strategies",
      "Participated in structured code reviews and maintained high code quality standards",
    ],
    technologies: ["React", "React Native", "Node.js", "Express", "Git"],
  },
]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <Briefcase className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Professional Journey
            </h2>
          </div>
          <p className="text-xl text-gray-300">Building scalable solutions across diverse industries</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Animated timeline line */}
            <motion.div
              className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-full"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{ transformOrigin: "top" }}
            />

            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                className="relative flex items-start mb-12"
              >
                {/* Animated timeline dot */}
                <motion.div
                  className="absolute left-6 w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-4 border-black z-10 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.3 + 0.8 }}
                  whileHover={{ scale: 1.2 }}
                />

                {/* Content card */}
                <motion.div
                  className="ml-20 bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-8 hover:bg-white/5 dark:hover:bg-black/30 transition-all duration-300 w-full group"
                  style={{ y }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3
                        className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                      >
                        {experience.role}
                      </h3>
                      <h4 className="text-xl text-orange-400 font-semibold mb-2">{experience.company}</h4>
                      <div className="flex items-center text-gray-400 text-sm space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {experience.duration}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {experience.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {experience.technologies.map((tech) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(249, 115, 22, 0.3)" }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-4">
                    {experience.achievements.map((achievement, achievementIndex) => (
                      <motion.div
                        key={achievementIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.3 + achievementIndex * 0.1 + 1 }}
                        className="flex items-start group/item"
                        whileHover={{ x: 5 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0 group-hover/item:text-green-300 transition-colors duration-200" />
                        <p
                          className="text-gray-300 leading-relaxed group-hover/item:text-white transition-colors duration-200"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {achievement}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
