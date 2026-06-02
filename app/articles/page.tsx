import { getAllArticles } from "@/lib/articles"
import ArticleLayout from "@/components/ArticleLayout"
import Link from "next/link"
import type { Metadata } from "next"
import { Calendar, Tag, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Articles | Solutions With Aaqil",
  description: "Technical articles and deep dives on full-stack development, AI, and modern web engineering by Aaqil Khan.",
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <ArticleLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1
            className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "'Orbitron', 'Inter', sans-serif" }}
          >
            ARTICLES
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Technical deep dives, engineering decisions, and lessons learned building production software.
          </p>
          <div className="mt-6 h-0.5 w-24 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full" />
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            No articles published yet. Check back soon.
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group block"
              >
                <article className="bg-white/5 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-2xl p-6 sm:p-8 hover:border-orange-500/40 hover:bg-white/8 dark:hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-orange-500/10">
                  {/* Cover image */}
                  {article.coverImage && (
                    <div
                      className="w-full h-40 rounded-xl mb-6 bg-cover bg-center border border-white/5"
                      style={{ backgroundImage: `url(${article.coverImage})` }}
                    />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200 leading-snug flex-1">
                      {article.title}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-all duration-200 group-hover:translate-x-1 flex-shrink-0 mt-1" />
                  </div>

                  <p className="text-gray-400 mb-5 leading-relaxed line-clamp-2">
                    {article.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {article.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    {article.tags.length > 0 && (
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <Tag className="w-3.5 h-3.5" />
                        {article.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                    <span className="ml-auto text-orange-400 font-medium text-xs">
                      {article.author}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </ArticleLayout>
  )
}
