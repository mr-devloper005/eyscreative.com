'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Search } from 'lucide-react'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

type StoredComment = {
  id: string
  name: string
  email?: string
  comment: string
  createdAt: string
  articleTitle?: string
  articleSlug?: string
}

const COMMENTS_PER_PAGE = 8
const COMMENT_KEY_PREFIX = 'slot4:article-comments:'

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return 'Just now'
  }
}

const readCommentsFromStorage = (): StoredComment[] => {
  const items: StoredComment[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(COMMENT_KEY_PREFIX)) continue
    const articleSlug = key.replace(COMMENT_KEY_PREFIX, '')
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue
        if (typeof item.name !== 'string' || typeof item.comment !== 'string') continue
        items.push({
          id: typeof item.id === 'string' ? item.id : `${articleSlug}-${items.length}`,
          name: item.name,
          email: typeof item.email === 'string' ? item.email : undefined,
          comment: item.comment,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          articleTitle: typeof item.articleTitle === 'string' ? item.articleTitle : undefined,
          articleSlug: typeof item.articleSlug === 'string' ? item.articleSlug : articleSlug,
        })
      }
    } catch {
      // Ignore corrupted local comment records.
    }
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function CommentsPage() {
  const [comments, setComments] = useState<StoredComment[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setComments(readCommentsFromStorage())
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return comments
    return comments.filter((item) => {
      return [item.name, item.email, item.comment, item.articleTitle, item.articleSlug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [comments, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COMMENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleComments = filtered.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  function refreshComments() {
    setComments(readCommentsFromStorage())
    setPage(1)
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-[#d9e6f2] bg-[linear-gradient(180deg,#ffffff_0%,#eef5fc_100%)]">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="rounded-[2.5rem] border border-[#d7e3ef] bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:p-12">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#9b0f06]">
                    <MessageSquare className="h-4 w-4" /> Local comments
                  </p>
                  <h1 className="mt-5 text-5xl font-black tracking-[-0.07em] sm:text-6xl">Comments</h1>
                  <p className="mt-5 max-w-2xl text-lg leading-9 text-[#56718d]">
                    Review comments saved in this browser from article pages.
                  </p>
                </div>
                <button type="button" className="inline-flex items-center justify-center rounded-2xl border border-[#c9d9ea] bg-white px-6 py-3.5 text-sm font-black transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-panel-bg)]" onClick={refreshComments}>Refresh comments</button>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#56718d]" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setPage(1)
                    }}
                    placeholder="Search comments..."
                    className="h-12 w-full rounded-2xl border border-[#d7e3ef] bg-white pl-10 pr-4 text-sm font-bold outline-none transition focus:border-[var(--slot4-accent-soft)]"
                  />
                </div>
                <p className="text-sm font-bold text-[#56718d]">
                  {filtered.length} comment{filtered.length === 1 ? '' : 's'} found
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          {visibleComments.length ? (
            <div className="grid gap-4">
              {visibleComments.map((item) => (
                <article key={`${item.articleSlug}-${item.id}`} className="rounded-[2rem] border border-[#d7e3ef] bg-white p-6 shadow-[0_16px_48px_rgba(65,101,138,0.08)]">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-black text-[var(--slot4-page-text)]">{item.name}</p>
                      <p className="mt-1 text-xs font-bold text-[#56718d]">{formatDate(item.createdAt)}</p>
                    </div>
                    {item.articleSlug ? (
                      <Link href={`/article/${item.articleSlug}`} className="text-sm font-black text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                        Open article
                      </Link>
                    ) : null}
                  </div>
                  {item.articleTitle ? <p className="mt-4 text-sm font-black text-[var(--slot4-page-text)]">{item.articleTitle}</p> : null}
                  <p className="mt-3 text-sm leading-7 text-[#56718d]">{item.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#d7e3ef] bg-white/80 p-10 text-center">
              <MessageSquare className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No comments yet</h2>
              <p className="mt-2 text-sm font-bold text-[#56718d]">Add a comment on any article page and it will appear here.</p>
            </div>
          )}

          {filtered.length > COMMENTS_PER_PAGE ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {currentPage > 1 ? (
                <button type="button" className="rounded-2xl border border-[#d7e3ef] bg-white px-5 py-3 text-sm font-black" onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
              ) : null}
              <span className="rounded-2xl bg-[#17304d] px-5 py-3 text-sm font-black text-white">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <button type="button" className="rounded-2xl border border-[#d7e3ef] bg-white px-5 py-3 text-sm font-black" onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
              ) : null}
            </div>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
