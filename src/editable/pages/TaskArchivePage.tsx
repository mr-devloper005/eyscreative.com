import Link from 'next/link'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Camera,
  Download,
  FileText,
  Filter,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { buildPostUrl, fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo) || asText(content.avatar)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 lg:grid-cols-2', badge: 'Editorial' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Directory' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': task === 'profile' ? '#f7f4f1' : preset.colors.background,
    '--archive-text': task === 'profile' ? '#33120f' : preset.colors.foreground,
    '--archive-surface': task === 'profile' ? '#ffffff' : preset.colors.surface,
    '--archive-accent': task === 'profile' ? '#9b0f06' : 'var(--slot4-accent-fill)',
  } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const leadPost = posts[0]

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="border-b border-[#eadfdb] bg-[linear-gradient(180deg,#ffffff_0%,#f6f0ec_100%)]">
          <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            <div className="overflow-hidden rounded-[2.8rem] border border-[#e6d7d2] bg-[linear-gradient(135deg,#3a1410_0%,#7f1d1d_45%,#f7f2ed_100%)] shadow-[0_30px_90px_rgba(58,20,16,0.18)]">
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
                <div className="relative min-h-[340px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] sm:p-8">
                  <div className="absolute inset-0 opacity-25">
                    {leadPost ? <img src={getImage(leadPost)} alt={leadPost.title} className="h-full w-full object-cover" /> : null}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(39,12,10,0.16),rgba(39,12,10,0.72))]" />
                  </div>
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]">
                        <Icon className="h-4 w-4" /> {voice?.eyebrow || label}
                      </div>
                      <div className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]">
                        Profile task
                      </div>
                    </div>
                    <div className="max-w-2xl">
                      <h1 className="text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
                      <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">{voice?.description || SITE_CONFIG.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-6">
                      {voice?.chips?.map((chip) => (
                        <span key={chip} className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/85">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5">
                  <form action={basePath} className="rounded-[2.2rem] border border-[#e6d7d2] bg-white p-5 shadow-[0_18px_54px_rgba(58,20,16,0.08)]">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9b0f06]">
                      <Filter className="h-4 w-4" /> {voice?.filterLabel || 'Filter'}
                    </div>
                    <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-[#e6d7d2] bg-[#fffaf8] px-4 text-sm font-bold outline-none">
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <button className="mt-3 h-12 w-full rounded-2xl bg-[#5e0006] text-sm font-black text-white">Apply</button>
                    <p className="mt-3 text-xs font-bold text-[#8a645d]">Showing: {categoryLabel}</p>
                  </form>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <StatTile label="Profiles" value={String(Math.max(posts.length, 0))} />
                    <StatTile label="Pages" value={`0${Math.max(pagination.totalPages || 1, 1)}`} />
                    <StatTile label="Active" value={category === 'all' ? 'All' : categoryLabel} />
                    <StatTile label="Focus" value={taskConfig?.label || label} />
                  </div>

                  {leadPost ? (
                    <Link href={`${basePath}/${leadPost.slug}` || buildPostUrl(task, leadPost.slug)} className="group overflow-hidden rounded-[2.2rem] border border-[#e6d7d2] bg-white shadow-[0_18px_54px_rgba(58,20,16,0.08)]">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={getImage(leadPost)} alt={leadPost.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(41,12,10,0.78)_100%)]" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">{deck.badge}</p>
                          <h2 className="mt-2 line-clamp-2 text-2xl font-black tracking-[-0.05em]">{leadPost.title}</h2>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/78">{getSummary(leadPost) || voice?.secondaryNote}</p>
                        </div>
                      </div>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          {posts.length ? (
            <div className={task === 'profile' ? 'grid gap-5 md:grid-cols-2 xl:grid-cols-3' : deck.archiveClass}>
              {posts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#d7e3ef] bg-white/80 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? (
              <Link href={pageHref(basePath, category, page - 1)} className="rounded-2xl border border-[#d7e3ef] bg-white px-5 py-3 text-sm font-black">
                Previous
              </Link>
            ) : null}
            <span className="rounded-2xl bg-[#17304d] px-5 py-3 text-sm font-black text-white">
              Page {page} of {pagination.totalPages || 1}
            </span>
            {pagination.hasNextPage ? (
              <Link href={pageHref(basePath, category, page + 1)} className="rounded-2xl border border-[#d7e3ef] bg-white px-5 py-3 text-sm font-black">
                Next
              </Link>
            ) : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} index={index} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  const strong = index % 4 === 0
  return (
    <Link href={href} className={`group overflow-hidden rounded-[2rem] border border-[#d7e3ef] bg-white shadow-[0_16px_48px_rgba(65,101,138,0.09)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(65,101,138,0.16)] ${strong ? 'lg:col-span-2' : ''}`}>
      <div className={`grid ${strong ? 'lg:grid-cols-[0.95fr_1.05fr]' : ''}`}>
        <div className={`relative overflow-hidden bg-black/5 ${strong ? 'aspect-[16/12] lg:aspect-auto lg:min-h-[320px]' : 'aspect-[4/3]'}`}>
          <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>
        <div className="p-5 sm:p-6">
          <span className="rounded-full bg-[#edf4fb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#17304d]">{category}</span>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b0f06]">Story {String(index + 1).padStart(2, '0')}</p>
          <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em] sm:text-3xl">{post.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#6f88a1]">{getSummary(post)}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#17304d]">
            Open story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[#d7e3ef] bg-white p-5 shadow-[0_16px_48px_rgba(65,101,138,0.09)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(65,101,138,0.16)] sm:grid-cols-[140px_1fr]">
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[1.7rem] bg-[#eef5fd] ring-1 ring-[#d7e3ef]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#17304d] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          <span className="rounded-full border border-[#d7e3ef] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#56718d]">Entry {String(index + 1).padStart(2, '0')}</span>
          {location ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d7e3ef] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]">
              <MapPin className="h-3 w-3" /> {location}
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#6f88a1]">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-[#56718d] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#d7e3ef] bg-white shadow-[0_16px_48px_rgba(65,101,138,0.09)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(65,101,138,0.16)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[#17304d] p-5 text-white">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt={post.title} className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#6f88a1]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#9b0f06]">
            View listing <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[#d7e3ef] bg-white shadow-[0_16px_48px_rgba(65,101,138,0.09)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(65,101,138,0.16)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#edf4fb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]">
          <ImageIcon className="h-3 w-3" /> Visual
        </div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-[#d7e3ef] bg-white p-6 shadow-[0_16px_48px_rgba(65,101,138,0.08)] transition hover:-translate-y-1 hover:bg-[#17304d] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#d7e3ef] bg-white p-6 shadow-[0_16px_48px_rgba(65,101,138,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(65,101,138,0.16)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[#17304d] p-5 text-white">
          <FileText className="h-8 w-8" />
        </div>
        <span className="rounded-full bg-[#edf4fb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#6f88a1]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#9b0f06]">
        Open document <Download className="h-4 w-4" />
      </p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const bio = getSummary(post)
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#e6d7d2] bg-white shadow-[0_18px_54px_rgba(58,20,16,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(58,20,16,0.16)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f4ece8]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <UserRound className="absolute inset-0 m-auto h-16 w-16 opacity-35" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(37,13,11,0.82)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#5e0006]">
          Profile {String(index + 1).padStart(2, '0')}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h2 className="line-clamp-2 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          {role ? <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-white/75">{role}</p> : null}
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-3 text-sm leading-7 text-[#6d544d]">{bio}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#f8efeb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#9b0f06]">Open profile</span>
          {website ? <span className="truncate text-xs font-bold text-[#8a645d]">{website.replace(/^https?:\/\//, '')}</span> : null}
        </div>
      </div>
    </Link>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.6rem] border border-[#e6d7d2] bg-white p-4 shadow-[0_12px_30px_rgba(58,20,16,0.06)]">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a645d]">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#33120f]">{value}</p>
    </div>
  )
}
