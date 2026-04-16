
export const PROJECTS = [
    {
        id: 1,
        slug: "solutions-with-aaqil",
        title: "Solutions with Aaqil",
        category: "Next.js, Tailwind, Framer motion, Email.js",
        description: "My personal B2B portfolio with Auth control of my own projects.",
        image: "sol.png",
        link: "https://solutions-with-aaqil.vercel.app/"
    },
    {
        id: 2,
        slug: "zayka-darbar",
        title: "Zayka-Darbar",
        category: "Next.js, Supabase, NestJS",
        description: "Multi-role food ordering platform with real-time tracking.",
        image: "zayka.png",
        link: "https://zaykadarbar.vercel.app/"
    },
    {
        id: 3,
        slug: "mycerts",
        title: "MyCerts",
        category: "Next.js, NestJS, PostgreSQL",
        description: "Secure digital credential hub for verifiable certificates.",
        image: "certshare.png",
        link: "https://mycerts99.vercel.app/"
    },
    {
        id: 4,
        slug: "stepper-ai",
        title: "Stepper.ai",
        category: "Next.js, FastAPI, Supabase",
        description: "AI chatbot to debug code step by step.",
        image: "stepperai.png",
        link: "https://stepperai.vercel.app/"
    },
];

/**
 * Origin project config for auth pages.
 * When a user arrives at /signup?from=<key> or /forgot-password?from=<key>,
 * the page uses this data to show project-specific branding and a return link.
 */
export const PROJECT_ORIGINS: Record<string, {
    name: string;
    tagline: string;
    description: string;
    accentColor: string;      // Tailwind gradient `from-` color
    accentColorTo: string;    // Tailwind gradient `to-` color
    image: string;            // public/ image filename
    tech: string[];
    returnUrl: string;
}> = {
    mycerts: {
        name: 'MyCerts',
        tagline: 'Your Digital Credential Hub',
        description: 'Upload, organize, and share your professional certificates with verified digital credentials.',
        accentColor: 'from-emerald-500',
        accentColorTo: 'to-teal-600',
        image: 'certshare.png',
        tech: ['Next.js', 'NestJS', 'PostgreSQL'],
        returnUrl: 'https://mycerts99.vercel.app/',
    },
    stepperai: {
        name: 'Stepper.ai',
        tagline: 'AI-Powered Code Debugger',
        description: 'Debug your code step by step with an intelligent AI assistant that walks you through every issue.',
        accentColor: 'from-violet-500',
        accentColorTo: 'to-purple-600',
        image: 'stepperai.png',
        tech: ['Next.js', 'FastAPI', 'Supabase'],
        returnUrl: 'https://stepperai.vercel.app/',
    },
    resumeai: {
        name: 'ResumeAI',
        tagline: 'Smart Resume Builder',
        description: 'Craft ATS-optimized resumes powered by AI that help you land your dream job faster.',
        accentColor: 'from-sky-500',
        accentColorTo: 'to-blue-600',
        image: 'sol.png',
        tech: ['Next.js', 'AI/ML', 'Supabase'],
        returnUrl: 'https://resumeai.vercel.app/',
    },
};
