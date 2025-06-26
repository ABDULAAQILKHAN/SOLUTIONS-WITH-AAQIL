"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ExternalLink, Github, FolderOpen, Star, Code } from "lucide-react"
import type { Project } from "../types"

const projects: Project[] = [
  {
    id: "1",
    name: "Masterly Learning Platform",
    description:
      "Comprehensive e-learning environment with dynamic resume generation, quiz creation, and peer-to-peer connectivity. Built with React, Tailwind CSS, and FastAPI for real-time analytics and performance tracking.",
    technologies: ["React", "FastAPI", "Tailwind CSS", "PostgreSQL", "WebSocket", "Docker"],
    githubUrl: "https://github.com",
    liveUrl: "https://masterly.com",
    featured: true,
  },
  {
    id: "2",
    name: "Enterprise Microservices Architecture",
    description:
      "Scalable microservices system serving 10,000+ users with Docker containerization, CI/CD pipelines, and 40% reduction in system downtime. Implemented robust SSL/TLS certificate management.",
    technologies: ["Docker", "Kubernetes", "FastAPI", "PostgreSQL", "Redis", "AWS"],
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    id: "3",
    name: "AI-Powered Analytics Dashboard",
    description:
      "Real-time analytics platform with machine learning insights, automated reporting, and interactive data visualization. Integrated with multiple data sources and APIs.",
    technologies: ["React", "Python", "TensorFlow", "D3.js", "MongoDB", "WebSocket"],
    githubUrl: "https://github.com",
    liveUrl: "https://analytics.com",
  },
  {
    id: "4",
    name: "Web3 DeFi Trading Platform",
    description:
      "Decentralized finance platform with smart contract integration, real-time trading, and portfolio management. Built with modern Web3 technologies and secure blockchain interactions.",
    technologies: ["React", "Solidity", "Web3.js", "Ethereum", "MetaMask", "Node.js"],
    githubUrl: "https://github.com",
    liveUrl: "https://defi-platform.com",
  },
  {
    id: "5",
    name: "Mobile E-Commerce Solution",
    description:
      "Cross-platform mobile application with 50% improvement in UX efficiency, payment gateway integration, real-time notifications, and advanced product catalog management.",
    technologies: ["React Native", "Node.js", "Express", "MongoDB", "Stripe", "Firebase"],
    githubUrl: "https://github.com",
  },
  {
    id: "6",
    name: "Automation Workflow Engine",
    description:
      "Enterprise automation platform using n8n and custom workflows, reducing manual processes by 70%. Integrated with multiple third-party services and APIs.",
    technologies: ["n8n", "Node.js", "PostgreSQL", "Docker", "REST APIs", "Webhooks"],
    githubUrl: "https://github.com",
    liveUrl: "https://automation.com",
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
