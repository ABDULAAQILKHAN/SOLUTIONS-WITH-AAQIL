export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  image?: string
  featured?: boolean
}

export interface ExperienceType {
  id: string
  company: string
  role: string
  duration: string
  location: string
  achievements: string[]
  technologies: string[]
}

export interface Skill {
  name: string
  category: "Frontend" | "Backend" | "Mobile" | "DevOps" | "AI & ML" | "Web3" | "Automation" | "Cloud"
  icon?: string
}
