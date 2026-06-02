import fs from "fs"
import path from "path"
import matter from "gray-matter"

const articlesDir = path.join(process.cwd(), "src/articles")

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  description: string
  author: string
  tags: string[]
  coverImage?: string
}

export interface Article extends ArticleMeta {
  content: string
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return []

  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".txt"))
    .map((filename) => {
      const slug = filename.replace(/\.(md|txt)$/, "")
      const raw = fs.readFileSync(path.join(articlesDir, filename), "utf-8")
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : "",
        description: data.description ?? "",
        author: data.author ?? "Aaqil Khan",
        tags: Array.isArray(data.tags) ? data.tags : [],
        coverImage: data.coverImage ?? undefined,
      } satisfies ArticleMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticle(slug: string): Article | null {
  for (const ext of [".md", ".txt"]) {
    const filepath = path.join(articlesDir, `${slug}${ext}`)
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, "utf-8")
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : "",
        description: data.description ?? "",
        author: data.author ?? "Aaqil Khan",
        tags: Array.isArray(data.tags) ? data.tags : [],
        coverImage: data.coverImage ?? undefined,
        content,
      }
    }
  }
  return null
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return []
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".txt"))
    .map((f) => f.replace(/\.(md|txt)$/, ""))
}
