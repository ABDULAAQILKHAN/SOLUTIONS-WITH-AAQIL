"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ExternalLink, Github, FolderOpen, Star, Code } from "lucide-react"
import type { Project } from "../types"

const projects: Project[] = [
  {
    id: "1",
    name: "Stepper.ai",
    description:
      "AI chatbot to debug code step by step, transforming single user prompts into interactive, step-by-step guides. Developed a responsive frontend with Next.js and Tailwind CSS, and a robust FastAPI backend to manage AI processing and data flow. Integrated Supabase for authentication and utilized Neon DB PostgreSQL for efficient storage and retrieval of content, ensuring seamless user experience and scalable data management.",
    technologies: ["Next.js", "Tailwind CSS", "FastAPI", "Supabase", "Neon DB (PostgreSQL)"],
    //githubUrl: "https://github.com/aaqilkhan/stepper-ai",
    liveUrl: "https://stepperai.vercel.app/",
    featured: true,
  },
  {
    id: "2",
    name: "MyCerts",
    description:
      "Secure Digital Certificate & Credential Hub. Developed a full-stack certificate management portal enabling professionals to securely share and verify credentials with recruiters. Implemented a login-based system for uploading, managing, and generating unique shareable links for certifications. Built a responsive React frontend for seamless user experience and a robust backend API using Node.js and FastAPI to handle all CRUD operations and secure link generation. Planning migration to a Blockchain backend for enhanced verification.",
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "Blockchain (planned)"],
    //githubUrl: "https://github.com/aaqilkhan/mycerts",
    liveUrl: "https://mycerts99.vercel.app/",
    featured: false,
  },
  {
    id: "3",
    name: "MyResumeAI",
    description:
      "Intelligent Resume Builder. Developed a client-side resume builder powered by Gemini AI, enabling automatic parsing of user data to auto-fill resume fields—reducing manual entry time by over 90%. Users can generate polished, downloadable PDF resumes directly in the browser without any backend dependency. Implemented a modern, responsive UI using React and Tailwind CSS.",
    technologies: ["React", "Gemini AI API", "Tailwind CSS", "PDF Generation Libraries"],
    //githubUrl: "https://github.com/aaqilkhan/myresumeai",
    liveUrl: "https://myresumeai.vercel.app/",
    featured: false,
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

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
          <div className="flex items-center justify-center mb-8">
            <FolderOpen className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Featured Work
            </h2>
          </div>
          <p className="text-xl text-gray-300">Production-grade applications I've architected and delivered</p>
        </motion.div>

        <motion.div
          style={{ y, willChange: "transform" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-6 hover:bg-white/5 dark:hover:bg-black/30 transition-all duration-300 group ${
                project.featured ? "lg:col-span-2" : ""
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {project.featured && (
                <motion.div
                  className="flex items-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 font-semibold text-sm">FEATURED PROJECT</span>
                </motion.div>
              )}

              <div className="h-48 bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:from-orange-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                <Code className="w-16 h-16 text-orange-400 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>

              <h3
                className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {project.name}
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30 hover:bg-orange-500/30 transition-colors duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </motion.a>
                )}
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
