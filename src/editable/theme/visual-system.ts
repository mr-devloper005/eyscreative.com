import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'premium-network'
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'visual-gallery'

export const visualPresets = {
  'premium-network': {
    label: 'Premium Network',
    mood: 'airy, polished, institutional, trustworthy',
    fontDirection: 'bold geometric headings with clean sans body copy',
    colors: {
      background: '#f7fbff',
      foreground: '#17304d',
      muted: '#83a0bb',
      primary: '#17304d',
      accent: '#9b0f06',
      surface: '#ffffff',
    },
    shape: 'soft cards, large sections, rounded stats, clean dividers',
  },
  'editorial-paper': {
    label: 'Editorial Paper',
    mood: 'calm magazine authority',
    fontDirection: 'serif headlines with quiet sans body',
    colors: {
      background: '#f7efe3',
      foreground: '#201711',
      muted: '#7b6253',
      primary: '#261811',
      accent: '#b76e45',
      surface: '#fffaf2',
    },
    shape: 'soft editorial cards with fine borders',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'premium, restrained, polished',
    fontDirection: 'high-contrast display headings with spacious tracking',
    colors: {
      background: '#0f1110',
      foreground: '#f6ead8',
      muted: '#b8aa94',
      primary: '#d7b56d',
      accent: '#7f1d1d',
      surface: '#181a17',
    },
    shape: 'large dark panels, gold hairlines, generous negative space',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, immersive',
    fontDirection: 'minimal sans with oversized display moments',
    colors: {
      background: '#07101f',
      foreground: '#f8fbff',
      muted: '#a9b6c8',
      primary: '#8df0c8',
      accent: '#f2a0ff',
      surface: '#101b2d',
    },
    shape: 'dark cards, large media, glass overlays',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset: 'premium-network',
  radius: {
    sm: '0.9rem',
    md: '1.4rem',
    lg: '2rem',
    xl: '2.8rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-300 hover:-translate-y-1 hover:shadow-xl',
    softHover: 'transition duration-300 hover:opacity-85',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'text-5xl font-black tracking-[-0.06em] sm:text-6xl lg:text-7xl',
    sectionTitle: 'text-3xl font-black tracking-[-0.04em] sm:text-4xl',
    body: 'text-base leading-8',
    caption: 'text-xs font-bold uppercase tracking-[0.18em]',
  },
  surfaces: {
    glass: 'border border-white/30 bg-white/55 backdrop-blur-xl',
    paper: 'border border-[#c9d9ea] bg-white shadow-[0_20px_55px_rgba(65,101,138,0.12)]',
    quiet: 'border border-[#d5e2ef] bg-[#f4f8fc]',
    dark: 'border border-white/10 bg-[#17304d] shadow-[0_24px_70px_rgba(14,34,58,0.28)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
    cardGrid: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
