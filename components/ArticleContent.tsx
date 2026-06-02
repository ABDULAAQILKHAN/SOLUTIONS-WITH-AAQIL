"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { Components } from "react-markdown"
import Image from "next/image"

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 mt-10 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-4 mt-10 pb-2 border-b border-white/10">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-white mb-3 mt-8">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-gray-200 mb-2 mt-6">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-gray-300 leading-relaxed mb-5 text-base sm:text-lg">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-orange-400 hover:text-orange-300 underline underline-offset-2 decoration-orange-400/50 transition-colors duration-200"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-bold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-gray-200 italic">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="list-none space-y-2 mb-6 pl-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-6 pl-4 text-gray-300">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-300 text-base sm:text-lg flex gap-2">
      <span className="text-orange-400 mt-1 flex-shrink-0">▸</span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-orange-500 pl-5 my-6 bg-white/5 dark:bg-black/20 py-4 pr-4 rounded-r-xl text-gray-300 italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-")
    if (isBlock) {
      return (
        <code className="block text-sm text-green-300 font-mono leading-relaxed">
          {children}
        </code>
      )
    }
    return (
      <code className="text-orange-300 bg-white/10 dark:bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-black/50 dark:bg-black/70 border border-white/10 rounded-xl p-5 overflow-x-auto mb-6 text-sm leading-relaxed">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null
    return (
      <span className="block my-6 rounded-xl overflow-hidden border border-white/10">
        <Image
          src={src}
          alt={alt ?? ""}
          width={900}
          height={500}
          className="w-full object-cover"
          unoptimized={src.startsWith("http")}
        />
      </span>
    )
  },
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-orange-500/10 border-b border-orange-500/30">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left px-4 py-3 text-orange-400 font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-gray-300 border-b border-white/5">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-white/5 transition-colors">{children}</tr>
  ),
  hr: () => <hr className="border-white/10 my-8" />,
  // Pass iframe and video through as raw HTML (requires rehype-raw)
  iframe: (props) => (
    <span className="block my-6 rounded-xl overflow-hidden border border-white/10 aspect-video">
      <iframe {...props} className="w-full h-full" />
    </span>
  ),
  video: (props) => (
    <span className="block my-6 rounded-xl overflow-hidden border border-white/10">
      <video {...props} className="w-full rounded-xl" controls />
    </span>
  ),
}

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
