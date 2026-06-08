import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial archive',
    headline: 'Feature stories, explainers, and polished reads.',
    description: 'This archive should feel like a publication desk with breathing room, stronger imagery, and confident reading cards.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Readable sections work best when the hierarchy is strong and the layout stays calm.',
    chips: ['Editorial', 'Long reads', 'Structured browsing'],
  },
  classified: {
    eyebrow: 'Open offers',
    headline: 'Listings, notices, and time-sensitive posts with faster scan value.',
    description: 'Classified content needs a practical browse flow that still feels considered and premium.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Lead with price, availability, and action cues before extra decoration.',
    chips: ['Offers', 'Fast scan', 'Action first'],
  },
  sbm: {
    eyebrow: 'Curated resources',
    headline: 'Saved links and reference pages arranged like useful shelves.',
    description: 'Bookmarks should read like a curated network of destinations instead of another generic content feed.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Collections benefit from clean text treatment and stronger grouping.',
    chips: ['Collections', 'Useful links', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Profiles that make identity and presentation feel more intentional.',
    description: 'Profile pages should highlight people, brands, or creators with trust cues and image support instead of hiding them in a plain grid.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Put identity, image, and supporting context near the top.',
    chips: ['Identity', 'Reputation', 'Discovery'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Guides, PDFs, and downloadable files in a cleaner archive.',
    description: 'Document surfaces should feel organized, scannable, and useful, with file context and quick actions.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Make file utility obvious before deep reading begins.',
    chips: ['Documents', 'Downloads', 'Archive'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Directory entries designed for comparison, trust, and action.',
    description: 'Listing pages should feel professional and useful, with direct details surfaced early in the layout.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Let location, contact details, and identity guide the page structure.',
    chips: ['Directory', 'Compare', 'Business details'],
  },
  image: {
    eyebrow: 'Visual archive',
    headline: 'Image-led posts arranged like a premium discovery gallery.',
    description: 'Image pages should open with strong visuals, roomy cards, and a layout that feels more curated than templated.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Visual rhythm matters more here than long copy density.',
    chips: ['Gallery', 'Image first', 'Visual discovery'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
