import Link from "next/link"
import { notFound } from "next/navigation"
import { getArticle, getAllSlugs } from "@/lib/articles"
import ArticleLayout from "@/components/ArticleLayout"
import ArticleContent from "@/components/ArticleContent"
import type { Metadata } from "next"
import { Calendar, User } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return {
    title: `${article.title} | Solutions With Aaqil`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <ArticleLayout showBack>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Cover image */}
        {article.coverImage && (
          <div
            className="w-full h-52 sm:h-72 rounded-2xl mb-10 bg-cover bg-center border border-white/10 shadow-xl"
            style={{ backgroundImage: `url(${article.coverImage})` }}
          />
        )}

        {/* Article header */}
        <header className="mb-10 pb-8 border-b border-white/10">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6"
            style={{ fontFamily: "'Orbitron', 'Inter', sans-serif" }}
          >
            {article.title}
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-6">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-medium">{article.author}</span>
            </span>
            {article.date && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </header>

        {/* Article body */}
        <div className="bg-white/3 dark:bg-black/10 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-10">
          <ArticleContent content={article.content} />
        </div>

        {/* Footer CTA */}
        <div className="mt-14 p-8 bg-white/5 dark:bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl text-center">
          <p className="text-gray-400 mb-4">Enjoyed this article?</p>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </article>
    </ArticleLayout>
  )
}
