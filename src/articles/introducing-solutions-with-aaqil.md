---
title: "Introducing Solutions with Aaqil — One Platform, Every Project"
date: "2026-06-02"
description: "This app serves as the central hub for all of my apps and my B2B showroom — a unified digital space where I control the narrative, the design, and the data."
author: "Aaqil Khan"
tags: ["platform", "nextjs", "react", "portfolio", "full-stack", "engineering", "typescript"]
coverImage: "https://raw.githubusercontent.com/ABDULAAQILKHAN/SOLUTIONS-WITH-AAQIL/refs/heads/master/image.png"
---

# Introducing Solutions with Aaqil — One Platform, Every Project

Every developer eventually hits the same wall. Your best work is scattered — a deployed app on one subdomain, a credential on LinkedIn, a write-up on Medium that the algorithm buried three days after you posted it, and a GitHub profile that only makes sense to people who already know what they are looking at.

That fragmentation is the problem this platform exists to solve.

**Solutions with Aaqil** is not a portfolio template I filled in. It is a purpose-built engineering platform that acts as the command center for every application I ship, every article I write, and every client engagement I take on. This post is the origin story — the *why*, the *how*, and what you can expect to find here.

---

## 1. The Core Motivation — Why I Built This

The professional identity of a modern software engineer is painfully distributed. GitHub holds the code. LinkedIn holds the resume. Medium or Substack holds the writing. Behance or Dribbble holds the design work. Each platform owns a piece of you, and none of them talk to each other. You end up managing five separate audiences with five separate publishing cadences, and your actual narrative — the connective tissue between the work you do and the thinking behind it — lives nowhere.

I wanted one address where a hiring manager, a prospective client, or a fellow engineer could arrive and get the complete picture:

- What I have built and shipped
- How I think about engineering problems
- Which tools I reach for and why
- What I am working on right now

Beyond discoverability, there is a deeper reason: **ownership**. Platforms come and go. Algorithms change. Subreddits get banned. Twitter becomes X. The only permanent address is the one I host myself. Every article on this site, every project entry, every line of copy — it is mine, version-controlled, and not subject to a content policy I did not write.

---

## 2. Under the Hood — The Engineering Decisions

### Framework: Next.js 15 with App Router

The site is built on **Next.js 15** using the App Router. This was a deliberate choice over simpler static-site generators for one reason: the platform is not just a blog — it is a live application. Users can authenticate, access project-specific dashboards, and interact with deployed sub-systems. Next.js gives me the flexibility to serve purely static marketing pages at the edge while keeping authenticated routes dynamic and server-rendered, all within a single codebase.

### The Custom Markdown CMS

The publishing engine — what you are reading through right now — is intentionally lightweight. There is no database, no headless CMS subscription, no API round-trip. Articles are `.md` files stored in `src/articles/`. At build time, a small server-side utility reads each file using **gray-matter** to parse frontmatter (title, date, tags, cover image), sorts them by date, and passes the content to **react-markdown** for rendering.

The result is pre-rendered static HTML that loads in milliseconds. Adding a new article is a single file drop — no admin panel, no migration, no deploy hook. The content lives in the same Git repository as the code, so every article has a full version history, and rollbacks are a `git revert` away.

This approach deliberately trades a rich editing UI for simplicity, portability, and zero infrastructure cost. For a technical author who writes in a code editor anyway, it is the right trade.

### Rendering Pipeline

```
src/articles/my-article.md
        │
        ▼  (build time — Node.js fs)
  gray-matter parses frontmatter + content
        │
        ▼  generateStaticParams()
  Next.js pre-renders /articles/[slug]
        │
        ▼  (client)
  react-markdown + remark-gfm + rehype-raw
        │
        ▼
  Custom component map (headings, code, tables,
  iframes, video — all styled to theme)
```

The `rehype-raw` plugin is the key enabler for rich media. It passes raw HTML nodes through the renderer untouched, which means embedding a YouTube `<iframe>` or a `<video>` tag directly in a Markdown file works exactly as expected — no MDX, no special syntax.

### Performance

Because all article pages are statically generated at build time (`generateStaticParams`), they are served as pre-built HTML from the CDN edge — no server compute on the hot path. First load is under 100 kB of JavaScript for the listing page. The animated background (SpaceBackground) and theme system are lazy client components that hydrate after the content is already visible.

---

## 3. Tech Stack — Complete Breakdown

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack React framework, SSG + SSR |
| UI Library | React 19 | Component model, Server Components |
| Language | TypeScript 5 | End-to-end type safety |
| Styling | Tailwind CSS v4 | Utility-first CSS, zero-runtime |
| Animation | Framer Motion 12 | Page transitions, micro-interactions |
| Icons | Lucide React | Consistent icon set |
| Auth | Supabase (SSR) | Row-level security, OAuth, JWT sessions |
| Markdown Parser | react-markdown + gray-matter | Article rendering engine |
| GFM Support | remark-gfm | Tables, strikethrough, task lists |
| Raw HTML | rehype-raw | iframe / video embed pass-through |
| Email | EmailJS | Contact form, zero backend required |
| Analytics | PostHog | Self-hostable product analytics, session replay |
| Font | Geist (Sans + Mono) | Vercel's system font, optimised loading |
| Display Font | Orbitron | Headings and brand wordmark |
| Hosting | Vercel | Edge network, automatic preview deploys |
| SEO | next-sitemap | Automatic sitemap + robots.txt generation |
| Package Manager | npm | Dependency management |

### Authentication Architecture

Auth is handled by **Supabase** with the `@supabase/ssr` adapter, which manages cookie-based sessions across both Server Components and the middleware layer. The middleware file intercepts every request, refreshes the session token if it is close to expiry, and attaches the user context before the route renders — meaning no client-side auth flash, no layout shift, and no unauthenticated render flicker on protected pages.

### Theme System

The light/dark toggle is powered by a custom `ThemeContext` that persists the user's preference to `localStorage` and applies the `.dark` class to `<html>` on mount. Tailwind's `@custom-variant dark` directive scopes all dark-mode styles to that class. The animated `SpaceBackground` component switches between a sun (light mode) and a moon (dark mode) with Framer Motion-driven rotation — the visual identity of the site shifts with the theme, not just the text colours.

---

## 4. The Centralized Portfolio — Solving the Fragmentation Problem

Every application listed on this platform is a production system, not a tutorial clone. Here is what is currently in the ecosystem:

### My Certs
A credential management platform built for engineers who accumulate certifications faster than they can organize them. The standout feature is **contextual grouping** — certificates are clustered by domain (cloud, security, frontend, etc.) rather than dumped into a flat list. This makes the profile readable to a non-technical recruiter and scannable to a technical hiring manager simultaneously.

### Compare AI
An AI comparison tool that integrates multiple language model APIs and renders responses side-by-side in real time. The interesting engineering problem here was **session state architecture** — keeping streamed responses synchronized across provider connections without race conditions, and surfacing latency and token cost as first-class UI elements rather than afterthoughts.

### HRMS Lite
A lightweight Human Resource Management System demonstrating that enterprise-grade functionality does not require enterprise-grade complexity. Built with a FastAPI backend and a React frontend, it covers employee records, leave management, and role-based access control in a codebase small enough to audit in an afternoon.

Each of these systems links back here. This platform is the index — the place where context, motivation, and technical writeups for each project live alongside the deployed product.

---

## 5. The Development Philosophy — How I Actually Build Software

Two principles guide every system I ship.

**First: boring technology for infrastructure, interesting technology for product.** The stack above is not chosen for novelty. Next.js, TypeScript, Tailwind, and Supabase are mature, well-documented, and have large talent pools. Choosing them means I spend cognitive budget on the product problem, not on framework archaeology. When the situation calls for something different — a Rust binary, a Go service, a Python ML pipeline — I reach for it. But the default is deliberately boring.

**Second: AI as a multiplier, not a replacement.** I integrate agentic coding tools — Claude Code, Copilot, and custom prompt workflows — into every phase of development. The productivity gains are real: scaffolding, boilerplate, test generation, and first-pass documentation all move significantly faster. But the architecture decisions, the security model, the data schema, and the user experience judgement calls remain deliberate human choices. AI handles the mechanical translation of intent into code. I handle the intent.

This site itself was built in a fraction of the time it would have taken five years ago, using that exact workflow. The article publishing engine you are reading through was designed, implemented, and integrated in a single session. That compression of iteration time is the most consequential shift in software development right now, and this platform will document it in detail as the practice matures.

---

## 6. What to Expect Next

This is the first article. Here is what is coming:

- **Architecture breakdowns** of each project in the ecosystem — the decisions that worked, the ones that did not, and what I would change
- **Deep dives into specific engineering problems** — async session management, streaming API responses, markdown rendering pipelines, auth token rotation
- **Agentic development workflows** — how I structure prompts, manage context, and integrate AI tooling into a professional engineering practice without losing control of the output
- **FastAPI + Next.js integration patterns** — full-stack patterns for teams building Python backends with React frontends
- **Security engineering** — practical approaches to input validation, rate limiting, and auth hardening for indie-scale production systems

If any of those topics are relevant to what you are building, this is the right place to follow.

---

*Questions, feedback, or want to discuss a project? The [contact form](/#contact) is always open.*
