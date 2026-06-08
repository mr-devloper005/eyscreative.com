import Link from 'next/link'
import { ArrowRight, Clock3, Image as ImageIcon } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-[2.3rem] border border-[#cddceb] bg-[#112a44] text-white shadow-[0_24px_80px_rgba(17,42,68,0.28)] ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-6 sm:p-8 lg:min-h-[620px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,42,68,0.08),rgba(17,42,68,0.88))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#eed9b9]">{label}</span>
          <h3 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl lg:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/78 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#17304d]">
            Read story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-[1.7rem] border border-[#d7e3ef] bg-white shadow-[0_14px_38px_rgba(65,101,138,0.08)] ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_34%,rgba(17,42,68,0.82)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#17304d]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="absolute bottom-4 left-4 right-4 line-clamp-3 text-lg font-black leading-tight tracking-[-0.04em] text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.7rem] border border-[#d7e3ef] bg-white p-5 shadow-[0_12px_34px_rgba(65,101,138,0.07)] ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf4fb] text-xs font-black text-[#17304d]">{index + 1}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#9b0f06]">
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em] text-[#17304d]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6f88a1]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[2rem] border border-[#d7e3ef] bg-white p-4 shadow-[0_16px_42px_rgba(65,101,138,0.08)] ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className="relative aspect-[16/12] overflow-hidden rounded-[1.5rem] bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[210px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#9b0f06]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[#17304d] sm:text-3xl">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#6f88a1]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#17304d]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href, badge = 'Visual' }: { post: SitePost; href: string; badge?: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-[#d7e3ef] bg-white shadow-[0_16px_42px_rgba(65,101,138,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(17,42,68,0.78)_100%)]" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#17304d]">
          <ImageIcon className="h-3 w-3" /> {badge}
        </span>
        <h3 className="absolute bottom-4 left-4 right-4 line-clamp-2 text-2xl font-black tracking-[-0.04em] text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

export const postCardTone = {
  card: dc.surface.card,
  accentText: pal.accentText,
}
