import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f8fbff',
  '--slot4-page-text': '#17304d',
  '--slot4-panel-bg': '#eef5fd',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#56718d',
  '--slot4-soft-muted-text': '#6f88a1',
  '--slot4-accent': '#9b0f06',
  '--slot4-accent-fill': '#5e0006',
  '--slot4-accent-soft': '#eed9b9',
  '--slot4-dark-bg': '#17304d',
  '--slot4-dark-text': '#f9fbff',
  '--slot4-media-bg': '#dbe8f6',
  '--slot4-cream': '#fffdf8',
  '--slot4-warm': '#f4f8fd',
  '--slot4-lavender': '#e9f2fc',
  '--slot4-gray': '#eef4fa',
  '--slot4-body-gradient':
    'radial-gradient(circle at 0% 18%, rgba(213, 62, 15, 0.07), transparent 28%), radial-gradient(circle at 100% 0%, rgba(94, 0, 6, 0.08), transparent 20%), linear-gradient(180deg, #fdfefe 0%, #f1f7fd 42%, #e9f2fb 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[#c9d9ea]',
  darkBorder: 'border-white/15',
  shadow: 'shadow-[0_18px_50px_rgba(65,101,138,0.12)]',
  shadowStrong: 'shadow-[0_30px_90px_rgba(41,79,116,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(16,46,74,0.02),rgba(16,46,74,0.7))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[200px] shrink-0 snap-start sm:w-[230px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'text-4xl font-black leading-[1.02] tracking-[-0.06em] sm:text-5xl lg:text-[4.4rem]',
    sectionTitle: 'text-3xl font-black tracking-[-0.05em] sm:text-4xl lg:text-[3rem]',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent)]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-2xl border ${editablePalette.border} bg-white px-6 py-3.5 text-sm font-black ${editablePalette.surfaceText} transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-panel-bg)]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--slot4-dark-bg)] px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-90`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.6rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(41,79,116,0.16)]',
    fade: 'transition duration-300 hover:opacity-88',
  },
} as const

export const aiLayoutRules = [
  'Keep every redesign inside src/editable so core routing, data, and backend behavior remain untouched.',
  'Use pale editorial surfaces, strong navy text, and restrained burgundy actions to mirror the premium network reference.',
  'Keep homepage structure large-format: hero, metrics rail, split sections, visual blocks, and a wide footer.',
  'Create visible card variety instead of repeating one template across every surface.',
  'Keep dynamic post fetching intact; do not replace real post feeds with static mock arrays.',
  'Always link posts with postHref() or buildPostUrl() so supported routes keep working.',
] as const
