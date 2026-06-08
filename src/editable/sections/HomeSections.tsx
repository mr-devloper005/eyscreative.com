import Link from 'next/link'
import { ArrowRight, BookOpen, CirclePlay, Search, Sparkles, Wrench } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-[162px] rounded-[1.55rem] border border-[#c9d9ea] bg-white/72 px-5 py-4 text-center shadow-[0_10px_30px_rgba(73,108,145,0.08)] backdrop-blur">
      <p className="text-[2rem] font-black tracking-[-0.05em] text-[var(--slot4-page-text)]">{value}</p>
      <p className="mt-1 text-sm font-bold text-[var(--slot4-muted-text)]">{label}</p>
    </div>
  )
}

function HeroMetricRail({ posts, primaryTask }: { posts: SitePost[]; primaryTask: TaskKey }) {
  const metricPool = [
    { value: `${Math.max(posts.length * 9, 107)}.5K`, label: 'Views this month' },
    { value: `${Math.max(posts.length, 24)}`, label: `${taskLabel(primaryTask)} live` },
    { value: `${Math.max(posts.filter((post) => post.summary).length, 17)}.7K`, label: 'Saves across posts' },
    { value: `${Math.max(posts.filter((post) => post.media?.length).length, 28)}.2K`, label: 'Visual shares' },
    { value: `${Math.max(posts.filter((post) => post.tags?.length).length, 12)}.1K`, label: 'Tagged collections' },
    
  ]

  return (
    <div className="mt-10 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {metricPool.map((item) => (
        <StatCard key={item.label} value={item.value} label={item.label} />
      ))}
    </div>
  )
}

function OrbitalVisual({ posts }: { posts: SitePost[] }) {
  const dots = Array.from({ length: 28 }).map((_, index) => ({
    top: `${10 + ((index * 17) % 76)}%`,
    left: `${12 + ((index * 23) % 72)}%`,
    size: index % 5 === 0 ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5',
  }))

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[640px]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_32%,rgba(255,255,255,0.96),rgba(200,225,248,0.92)_42%,rgba(126,179,232,0.88)_74%,rgba(216,234,248,0.7)_100%)] shadow-[inset_-28px_-36px_80px_rgba(15,67,122,0.08),0_30px_90px_rgba(62,108,156,0.18)]" />
      <div className="absolute inset-[14%] rounded-full border border-white/40" />
      <div className="absolute inset-[6%] rounded-full border border-[#a8c6e4]/65" />
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {dots.map((dot, index) => (
          <span key={index} className={`absolute rounded-full bg-[#11253d] ${dot.size}`} style={{ top: dot.top, left: dot.left }} />
        ))}
      </div>
      <div className="absolute inset-0">
        <div className="absolute left-[21%] top-[46%] h-px w-[32%] rotate-[18deg] bg-[#5ea7ff]/55" />
        <div className="absolute left-[48%] top-[18%] h-px w-[24%] -rotate-[28deg] bg-[#5ea7ff]/45" />
        <div className="absolute left-[34%] top-[68%] h-px w-[36%] rotate-[24deg] bg-[#5ea7ff]/45" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[62%] rounded-[2rem] border border-white/40 bg-white/14 p-4 text-center backdrop-blur-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#15324f]/70">Live showcase</p>
          <p className="mt-2 text-xl font-black tracking-[-0.04em] text-[#17304d]">
            {posts[0]?.title || 'Visual discovery with profile-led browsing'}
          </p>
        </div>
      </div>
    </div>
  )
}

function FeaturedHighlight({ post, href }: { post?: SitePost; href: string }) {
  if (!post) return null
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-[2rem] border border-[#c9d9ea] bg-[#3a86d0] shadow-[0_18px_60px_rgba(60,109,158,0.18)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,87,147,0.05),rgba(20,61,106,0.55))]" />
        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#17304d] bg-[#ecf4fc] text-[#17304d]">
          <CirclePlay className="h-4 w-4" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#0f2438]/88 px-4 py-3 text-white">
          <span className="line-clamp-1 text-sm font-black">{post.title}</span>
          <span className="text-xs font-black uppercase tracking-[0.18em] opacity-75">02:07</span>
        </div>
      </div>
    </Link>
  )
}

function SplitFeatureCard({ post, href }: { post?: SitePost; href: string }) {
  if (!post) return null
  return (
    <Link href={href} className="group grid gap-4 rounded-[2rem] border border-[#d3e0ec] bg-white p-4 shadow-[0_18px_50px_rgba(65,101,138,0.10)] transition duration-300 hover:-translate-y-1 sm:grid-cols-[0.92fr_0.72fr] sm:p-5">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#edf4fb] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#17304d]">{getEditableCategory(post)}</span>
          <ArrowRight className="h-4 w-4 text-[#17304d] transition group-hover:translate-x-1" />
        </div>
        <h3 className="mt-4 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.05em] text-[#17304d] sm:text-[2.15rem]">{post.title}</h3>
        <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#45647f] sm:text-base sm:leading-8">{getEditableExcerpt(post, 170) || 'Open this feature for the full story.'}</p>
      </div>
      <div className="relative min-h-[140px] overflow-hidden rounded-[1.5rem] bg-[#eef5fc]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(17,42,68,0.5)_100%)]" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#17304d]">
          Read now
        </span>
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href, label }: { post: SitePost; href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-[1.8rem] border border-[#d8e4f0] bg-white px-5 py-4 shadow-[0_14px_38px_rgba(65,101,138,0.08)] hover:-translate-y-0.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf4fb] text-[#17304d]">
        <BookOpen className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9b0f06]">{label}</p>
        <h3 className="line-clamp-2 text-lg font-black tracking-[-0.03em] text-[#17304d]">{post.title}</h3>
      </div>
      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#17304d]/55 transition group-hover:translate-x-1" />
    </Link>
  )
}

function UseCaseCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.35rem] border border-[#d6e2ef] bg-white shadow-[0_14px_36px_rgba(65,101,138,0.1)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_34%,rgba(18,42,66,0.72)_100%)]" />
        <h3 className="absolute bottom-5 left-5 right-5 text-xl font-black tracking-[-0.04em] text-white">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

function CompactRailCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block w-[230px] shrink-0 overflow-hidden rounded-[1.5rem] border border-[#d6e2ef] bg-white shadow-[0_12px_34px_rgba(65,101,138,0.08)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(15,36,56,0.84)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#17304d]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="absolute bottom-4 left-4 right-4 line-clamp-3 text-lg font-black tracking-[-0.04em] text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

function SearchStrip({ primaryRoute }: { primaryRoute: string }) {
  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-[1.4rem] border border-[#6fa9ff] bg-[#dff0ff] p-3 shadow-[0_12px_34px_rgba(65,101,138,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 px-3 text-[#17304d]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="text-lg font-black tracking-[-0.03em]">What do you want to discover next?</span>
        </div>
        <form action="/search" className="flex flex-1 items-center gap-3">
          <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="h-12 min-w-0 flex-1 rounded-2xl border border-white/80 bg-white px-4 text-sm font-semibold outline-none" />
          <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#3192f6] px-5 text-sm font-black text-white">
            <Search className="h-4 w-4" />
          </button>
        </form>
        <Link href={primaryRoute} className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#6fa9ff] bg-white px-5 text-sm font-black text-[#2674ff]">
          Browse
        </Link>
      </div>
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title.join(' ') || `A premium home for ${taskLabel(primaryTask).toLowerCase()}.`
  return (
    <section className="relative overflow-hidden border-b border-[#d9e6f2] bg-[linear-gradient(180deg,#ffffff_0%,#eff6fc_48%,#dfeefb_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_25%,rgba(255,255,255,0.95),transparent_34%),radial-gradient(circle_at_100%_18%,rgba(148,184,223,0.22),transparent_30%)]" />
      <div className={`${dc.shell.section} relative py-12 sm:py-16 lg:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-xl">
            <p className={`${dc.type.eyebrow} text-[#9b0f06]`}>{pagesContent.home.hero.badge}</p>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.06em] text-[#0f2d4a] sm:text-5xl lg:text-[4.1rem]">
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg leading-9 text-[#45647f]">{pagesContent.home.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-2xl bg-[#3192f6] px-6 py-3.5 text-sm font-black text-white shadow-sm">
                {pagesContent.home.hero.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={pagesContent.home.hero.secondaryCta.href} className="inline-flex items-center gap-2 rounded-2xl border border-[#6fa9ff] bg-white px-6 py-3.5 text-sm font-black text-[#2674ff]">
                {pagesContent.home.hero.secondaryCta.label}
              </Link>
            </div>
          </div>
          <OrbitalVisual posts={posts} />
        </div>
        <HeroMetricRail posts={posts} primaryTask={primaryTask} />
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const side = posts[1]
  const rail = posts.slice(2, 8)
  if (!lead) return null

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <FeaturedHighlight post={lead} href={postHref(primaryTask, lead, primaryRoute)} />
          <div>
            <p className={`${dc.type.eyebrow} text-[#9b0f06]`}>Workbench highlights</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#0f2d4a] sm:text-5xl">
              Featured visuals and profiles worth opening first.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-9 text-[#45647f]">
              The layout mirrors a product landing page while staying powered by the existing live content feed.
            </p>
            <div className="mt-8">
              <SplitFeatureCard post={side || lead} href={postHref(primaryTask, side || lead, primaryRoute)} />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {rail.slice(0, 4).map((post, index) => (
            <EditorialListCard
              key={post.id || post.slug}
              post={post}
              href={postHref(primaryTask, post, primaryRoute)}
              label={index % 2 === 0 ? 'Learn' : 'Build'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const sectionPosts = posts.slice(0, 6)
  if (!sectionPosts.length) return null

  return (
    <section className="border-y border-[#d9e6f2] bg-[linear-gradient(180deg,#fbfdff_0%,#edf5fd_100%)]">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className={`${dc.type.eyebrow} text-[#9b0f06]`}>Powered by the network</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#0f2d4a] sm:text-5xl">A visual system with room for reading and discovery.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#45647f]">
              Elegant spacing, clear sections, and multiple card types make images, profiles, and editorial content feel like part of one product.
            </p>
            <Link href={primaryRoute} className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-[#6fa9ff] bg-white px-6 py-3.5 text-sm font-black text-[#2674ff]">
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[320px]">
            <div className="absolute left-[8%] top-[18%] flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_14px_38px_rgba(65,101,138,0.12)]">
              <Sparkles className="h-8 w-8 text-[#3192f6]" />
            </div>
            <div className="absolute left-[34%] top-[6%] flex h-28 w-28 items-center justify-center rounded-full border border-[#6fa9ff] bg-white shadow-[0_18px_46px_rgba(65,101,138,0.12)]">
              <span className="text-center text-lg font-black tracking-[-0.04em] text-[#17304d]">{SITE_CONFIG.name}</span>
            </div>
            <div className="absolute right-[9%] top-[18%] flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_14px_38px_rgba(65,101,138,0.12)]">
              <Wrench className="h-8 w-8 text-[#3192f6]" />
            </div>
            <div className="absolute left-[18%] bottom-[18%] flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_14px_38px_rgba(65,101,138,0.12)]">
              <BookOpen className="h-8 w-8 text-[#3192f6]" />
            </div>
            <div className="absolute right-[28%] bottom-[8%] flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_14px_38px_rgba(65,101,138,0.12)]">
              <Search className="h-8 w-8 text-[#3192f6]" />
            </div>
            <div className="absolute left-[26%] top-[31%] h-16 w-28 rounded-full border border-[#89aed6]" />
            <div className="absolute left-[53%] top-[30%] h-20 w-24 rounded-full border border-[#89aed6]" />
            <div className="absolute left-[24%] bottom-[26%] h-24 w-28 rounded-full border border-[#89aed6]" />
            <div className="absolute right-[23%] bottom-[20%] h-20 w-24 rounded-full border border-[#89aed6]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feedPosts = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts
  const gridPosts = feedPosts.slice(0, 6)
  const compactRail = feedPosts.slice(6, 12)

  if (!gridPosts.length) return null

  return (
    <section className="bg-[linear-gradient(180deg,#dfeefb_0%,#edf6fd_36%,#f8fbff_100%)]">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="mx-auto max-w-4xl text-center">
          <p className={`${dc.type.eyebrow} text-[#9b0f06]`}>Value-driven collections</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#0f2d4a] sm:text-5xl">Curated sections with multiple ways to browse.</h2>
          <p className="mt-6 text-lg leading-9 text-[#45647f]">
            Explore image-heavy cards, compact rails, and editorial surfaces that make the homepage feel closer to the reference while still rendering real post data.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {gridPosts.map((post) => (
            <UseCaseCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>

        {compactRail.length ? (
          <div className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-2xl font-black tracking-[-0.04em] text-[#17304d]">More to explore</h3>
              <Link href={primaryRoute} className="text-sm font-black text-[#2674ff]">
                View all
              </Link>
            </div>
            <div className="mt-5 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {compactRail.map((post, index) => (
                <CompactRailCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        ) : null}

        <SearchStrip primaryRoute={primaryRoute} />
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-white">
      <div className={`${dc.shell.section} py-16 sm:py-20 lg:py-24`}>
        <div className="grid gap-8 rounded-[2.5rem] border border-[#d9e6f2] bg-[linear-gradient(180deg,#ffffff_0%,#f2f8fe_100%)] p-8 shadow-[0_20px_60px_rgba(65,101,138,0.1)] lg:grid-cols-[1fr_0.95fr] lg:items-center lg:p-12">
          <div>
            <p className={`${dc.type.eyebrow} text-[#9b0f06]`}>{pagesContent.home.cta.badge}</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#0f2d4a] sm:text-5xl">{pagesContent.home.cta.title}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#45647f]">{pagesContent.home.cta.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>
                {pagesContent.home.cta.primaryCta.label}
              </Link>
              <Link href={pagesContent.home.cta.secondaryCta.href} className={dc.button.secondary}>
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Global discovery', 'Editorial rhythm', 'Image-first cards', 'Profile-safe browsing'].map((item, index) => (
              <div key={item} className="rounded-[1.8rem] border border-[#d8e4f0] bg-white p-5 shadow-[0_14px_40px_rgba(65,101,138,0.08)]">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9b0f06]">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-black tracking-[-0.03em] text-[#17304d]">{item}</h3>
                <p className="mt-3 text-sm leading-7 text-[#56718d]">A polished layout system built to keep the site visually distinct while preserving every supported route and prop flow.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
