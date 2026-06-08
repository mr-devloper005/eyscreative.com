import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = {
    '--detail-bg': preset.colors.background,
    '--detail-text': preset.colors.foreground,
    '--detail-surface': preset.colors.surface,
    '--detail-accent': 'var(--slot4-accent-fill)',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-2xl border border-[#d7e3ef] bg-white px-4 py-2 text-sm font-black">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="min-w-0 overflow-hidden rounded-[2.7rem] border border-[#d7e3ef] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.09)]">
        <div className="border-b border-[#d7e3ef] bg-[linear-gradient(180deg,#ffffff_0%,#eef5fc_100%)] p-5 sm:p-8 lg:p-12">
          <BackLink task="article" />
          <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">{categoryOf(post, 'Article')}</p>
          <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-5xl lg:text-7xl">{post.title}</h1>
          {summaryText(post) ? <p className="mt-6 max-w-3xl text-lg leading-9 text-[#45647f]">{summaryText(post)}</p> : null}
        </div>
        {images[0] ? <img src={images[0]} alt={post.title} className="max-h-[660px] w-full object-cover" /> : null}
        <div className="p-5 sm:p-8 lg:p-12">
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </div>
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.8rem] border border-[#d7e3ef] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.09)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[#eef5fd] ring-1 ring-[#d7e3ef]">
              {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">Business listing</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#56718d]">{summaryText(post)}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[1440px] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
      <aside className="rounded-[2.5rem] border border-[#d7e3ef] bg-[#17304d] p-7 text-white shadow-xl lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-white/60">Classified notice</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-5xl">{post.title}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#17304d]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-2xl border border-white/25 px-5 py-3 text-sm font-black">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.7rem] border border-[#d7e3ef] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-9">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0] || '/placeholder.svg?height=1200&width=1600'
  const secondaryImages = images.slice(1, 6)
  const category = categoryOf(post, 'Visual')
  const title = post.title || 'Untitled visual'
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_360px]">
        <article className="min-w-0 overflow-hidden rounded-[3rem] border border-[#d7e3ef] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.09)]">
          <div className="relative bg-[#eef5fd]">
            <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#17304d] shadow-sm">
              <Camera className="h-4 w-4" /> {category}
            </div>
            
            <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
              <div className="relative overflow-hidden rounded-[2.1rem] bg-[#dfeaf5] shadow-[0_18px_60px_rgba(65,101,138,0.16)]">
                <img src={heroImage} alt={title} className="h-full min-h-[420px] w-full object-cover sm:min-h-[520px]" />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(17,42,68,0.86)_100%)] px-5 py-5 text-white sm:px-6">
                  <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">{title}</h1>
                 </div>
              </div>
              
            </div>
          </div>

          {secondaryImages.length ? (
            <div className="border-t border-[#d7e3ef] p-5 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-black tracking-[-0.04em]">More frames</h2>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#56718d]">{secondaryImages.length} more images</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {secondaryImages.map((image, index) => (
                  <figure key={`${image}-${index}`} className="overflow-hidden rounded-[1.6rem] border border-[#d7e3ef] bg-white shadow-[0_14px_36px_rgba(65,101,138,0.08)]">
                    <img src={image} alt={`${title} ${index + 2}`} className="aspect-[4/3] w-full object-cover" />
                  </figure>
                ))}
              </div>
            </div>
          ) : null}

          <div className="border-t border-[#d7e3ef] p-5 sm:p-6 lg:p-8">
            <BodyContent post={post} />
          </div>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

          <RelatedPanel task="image" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#d7e3ef] bg-white px-4 py-3">
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#56718d]">{label}</span>
      <span className="truncate text-sm font-black text-[#17304d]">{value}</span>
    </div>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.7rem] border border-[#d7e3ef] bg-white p-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-10">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#17304d] text-white">
          <Bookmark className="h-9 w-9" />
        </div>
        <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-[#56718d]">{summaryText(post)}</p>
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#17304d] px-5 py-3 text-sm font-black text-white">
            Open saved resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.7rem] border border-[#d7e3ef] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-9">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[#17304d] text-white">
            <FileText className="h-12 w-12" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">PDF resource</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#d7e3ef] bg-[#eef5fd]">
            <div className="flex items-center justify-between gap-3 border-b border-[#d7e3ef] bg-white p-4">
              <span className="text-sm font-black">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-[#17304d] px-4 py-2 text-xs font-black text-white">
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const location = getField(post, ['location', 'city', 'address'])
  const avatar = images[0]
  const galleryCount = Math.max(images.length, 1)
  const relatedCount = Math.max(related.length, 0)
  const profileScore = [role, website, email, location].filter(Boolean).length
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="overflow-hidden rounded-[3rem] border border-[#e6d7d2] bg-white shadow-[0_30px_90px_rgba(58,20,16,0.09)]">
        <div className="bg-[linear-gradient(135deg,#3a1410_0%,#7f1d1d_45%,#f7f2ed_100%)] px-5 py-5 text-white sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2.2rem] border border-white/12 bg-white/12 shadow-[0_16px_46px_rgba(0,0,0,0.22)]">
              {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
            </div>
            <div className="min-w-0">
              <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {role ? <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">{role}</span> : null}
                {location ? <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">{location}</span> : null}
              </div>
              
            </div>
          </div>
        </div>

        <div className="border-b border-[#eadfdb] bg-[#fffaf8] px-5 sm:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {['Overview'].map((tab, index) => (
              <span
                key={tab}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${
                  index === 0 ? 'bg-[#5e0006] text-white' : 'bg-white text-[#6d544d] ring-1 ring-[#e6d7d2]'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.8fr] lg:p-10">
          <article className="space-y-6">
            <section className="rounded-[2.1rem] border border-[#e6d7d2] bg-white p-6 shadow-[0_18px_46px_rgba(58,20,16,0.07)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black tracking-[-0.04em]">About Me</h2>
              </div>
              <div className="mt-5 rounded-[1.8rem] border border-[#e6d7d2] bg-[linear-gradient(180deg,#fffaf8_0%,#ffffff_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <p className="text-sm leading-8 text-[#6d544d] sm:text-base sm:leading-9">
                  {summaryText(post) || 'Profile details and background are shown here in a cleaner dashboard layout.'}
                </p>
              </div>
            </section>

            
            <section className="rounded-[2.1rem] border border-[#e6d7d2] bg-white p-6 shadow-[0_18px_46px_rgba(58,20,16,0.07)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black tracking-[-0.04em]">Gallery</h2>
                 </div>
              <div className="mt-5">
                <ImageStrip images={images.slice(0, 6)} label="Profile gallery" large />
              </div>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
           
              <ContactAction website={website} email={email} />
            </aside>
        </div>
      </div>
    </section>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[#e6d7d2] bg-[#fffaf8] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a645d]">{label}</p>
      <p className="mt-2 text-sm leading-7 text-[#33120f]">{value}</p>
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} opacity-85`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[#d7e3ef] bg-[#f6faff] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#56718d]">
            <Icon className="h-4 w-4" /> {label}
          </div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[#17304d]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--detail-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={label} className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[#d7e3ef]" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#d7e3ef] bg-white shadow-sm">
      <div className="flex items-center gap-2 p-4 text-sm font-black">
        <MapPin className="h-4 w-4" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-[#d7e3ef] bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#56718d]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-[#17304d] px-4 py-2 text-sm font-black text-white">
            Website <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-2xl border border-[#d7e3ef] px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-2xl border border-[#d7e3ef] px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm">
      <span className="font-black uppercase tracking-[0.16em] text-white/60">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-[#d7e3ef] bg-white/80 p-5 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#56718d]">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[#56718d]">
            <p className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}
            </p>
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}
            </p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[#d7e3ef] bg-white/80 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[#56718d]">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => (
              <RelatedCard key={item.id || item.slug} task={task} post={item} />
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-[#d7e3ef] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
      {image && task !== 'sbm' ? (
        <img src={image} alt={post.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#eef5fd]">
          <FileText className="h-6 w-6 opacity-45" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#56718d]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[#d7e3ef] bg-[#f7fbff] p-5">
      <div className="flex items-center gap-2 text-lg font-black">
        <MessageCircle className="h-5 w-5" /> Comments
      </div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-[#d7e3ef] bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-[#56718d]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[#56718d]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
