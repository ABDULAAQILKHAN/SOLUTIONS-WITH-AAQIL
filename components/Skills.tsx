"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Code, Database, Smartphone, Settings, Brain, Blocks, Globe, Zap, Briefcase, ArrowRight, CheckCircle } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  icon: typeof Code
  color: string
  skills: string[]
  deliverables: string[]
}

const services: Service[] = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Custom websites and web applications built with modern frameworks. From landing pages to complex enterprise solutions.",
    icon: Code,
    color: "from-blue-400 to-blue-600",
    skills: ["React", "Next.js", "Svelte", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
    deliverables: ["Responsive Websites", "E-commerce Platforms", "Admin Dashboards", "Progressive Web Apps"]
  },
  {
    id: "backend-api",
    title: "Backend & API Development",
    description: "Scalable server-side solutions and RESTful APIs. Secure, performant, and built for growth.",
    icon: Database,
    color: "from-green-400 to-green-600",
    skills: ["FastAPI", "NestJS", "Express.js", "Python", "Node.js", "PostgreSQL", "MongoDB", "Springboot"],
    deliverables: ["REST APIs", "GraphQL APIs", "Microservices", "Database Design"]
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    description: "Cross-platform mobile applications that deliver native-like experiences on iOS and Android.",
    icon: Smartphone,
    color: "from-purple-400 to-purple-600",
    skills: ["React Native", "Flutter", "Firebase", "Supabase"],
    deliverables: ["iOS Apps", "Android Apps", "Cross-Platform Apps", "App Store Deployment"]
  },
  {
    id: "ai-solutions",
    title: "AI & Machine Learning",
    description: "Intelligent solutions powered by cutting-edge AI. Chatbots, automation, and data-driven insights.",
    icon: Brain,
    color: "from-pink-400 to-pink-600",
    skills: ["TensorFlow", "OpenAI API", "LangChain", "Hugging Face", "Computer Vision"],
    deliverables: ["AI Chatbots", "Recommendation Systems", "Document Processing", "Custom AI Models"]
  },
  {
    id: "devops-cloud",
    title: "DevOps & Cloud Services",
    description: "Infrastructure setup, deployment pipelines, and cloud architecture for seamless operations.",
    icon: Settings,
    color: "from-orange-400 to-orange-600",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Git/GitHub", "Vercel", "Netlify"],
    deliverables: ["Cloud Migration", "CI/CD Pipelines", "Server Setup", "Performance Optimization"]
  },
  {
    id: "blockchain",
    title: "Web3 & Blockchain",
    description: "Decentralized applications and smart contracts for the next generation of the internet.",
    icon: Blocks,
    color: "from-yellow-400 to-yellow-600",
    skills: ["Ethereum", "Solidity", "Web3.js", "MetaMask", "Smart Contracts"],
    deliverables: ["Smart Contracts", "DApps", "NFT Platforms", "Token Development"]
  },
  {
    id: "automation",
    title: "Business Automation",
    description: "Streamline your workflows with custom automation solutions. Save time and reduce errors.",
    icon: Zap,
    color: "from-red-400 to-red-600",
    skills: ["n8n", "Zapier", "Selenium", "Puppeteer"],
    deliverables: ["Workflow Automation", "Data Scraping", "Report Generation", "Integration Services"]
  },
]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [activeService, setActiveService] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

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
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Services & Expertise
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to elevate your business. Each service backed by industry-leading technologies.
          </p>
        </motion.div>

        <motion.div
          style={{ y, willChange: "transform" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isActive = activeService === service.id

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white/3 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-6 hover:bg-white/5 dark:hover:bg-black/30 transition-all duration-300 group cursor-pointer ${
                  isActive ? "ring-2 ring-orange-400" : ""
                }`}
                onClick={() => setActiveService(isActive ? null : service.id)}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {service.title}
                </h3>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.skills.slice(0, isActive ? undefined : 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-white/5 text-gray-300 rounded-md text-xs font-medium border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                  {!isActive && service.skills.length > 4 && (
                    <span className="px-2 py-1 text-orange-400 text-xs font-medium">
                      +{service.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Expanded Content */}
                <motion.div
                  initial={false}
                  animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-orange-400 mb-3">What You Get:</h4>
                    <ul className="space-y-2">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-center text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <div className="flex items-center text-orange-400 text-sm font-medium mt-4 group-hover:text-orange-300">
                  {isActive ? "Click to collapse" : "Click to expand"}
                  <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${isActive ? "rotate-90" : ""}`} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
