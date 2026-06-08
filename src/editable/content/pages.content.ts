import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Visual stories, profiles, and curated discovery',
      description: 'Explore image-led posts, standout profiles, and editorial collections through a polished premium interface.',
      openGraphTitle: 'Visual stories, profiles, and curated discovery',
      openGraphDescription: 'Browse image-first posts, profiles, and curated resources through a premium discovery layout.',
      keywords: ['image sharing', 'visual stories', 'profiles', 'content discovery'],
    },
    hero: { 
      badge: '',
      title: ['A premium hub for visual stories and connected discovery.'],
      description:
        'Browse image-first posts and curated sections through a calm large-format layout built for exploring what is worth opening next.',
      primaryCta: { label: 'Start exploring', href: '/image' },
      secondaryCta: { label: 'Learn more', href: '/about' },
      searchPlaceholder: 'Search visuals, profiles, stories, and resources',
      focusLabel: 'Focus',
      featureCardBadge: 'featured signal',
      featureCardTitle: 'Fresh visual posts lead the experience without breaking the live feed.',
      featureCardDescription: 'The homepage keeps real content at the center while feeling more like a premium product than a generic blog.',
    },
    intro: {
      badge: 'About the platform',
      title: 'Built for elegant browsing across images, people, and useful resources.',
      paragraphs: [
        'The site brings image sharing, profile discovery, and editorial content into one connected visual system.',
        'Visitors can move from standout visuals to creators, guides, listings, and saved resources without losing context.',
        'The result is a public-facing experience that feels structured, modern, and worth exploring for longer.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Image-led discovery with calm premium spacing.',
        'Profile and resource pages that feel part of the same product.',
        'Clear navigation without overcrowding the homepage.',
        'Multiple post card styles for more natural browsing rhythm.',
      ],
      primaryLink: { label: 'Browse images', href: '/image' },
      secondaryLink: { label: 'See profiles', href: '/profile' },
    },
    cta: {
      badge: 'Build your path',
      title: 'Find the next visual, profile, or resource worth opening.',
      description:
        'Move between images, reading pieces, and saved resources through one coordinated premium interface.',
      primaryCta: { label: 'Browse images', href: '/image' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About the network',
    title: 'A clearer way to browse image-first content and profile-led discovery.',
    description: `${slot4BrandConfig.siteName} brings image sharing, profiles, and supporting content together inside one refined browsing experience.`,
    paragraphs: [
      'Instead of treating every content type like the same feed, the site gives images, profiles, and longer reads their own rhythm while keeping the experience connected.',
      'That makes it easier for visitors to discover visuals, learn more about people or brands, and keep exploring related sections naturally.',
    ],
    values: [
      {
        title: 'Image-first discovery',
        description: 'Visual posts take the lead when they should, without hiding the rest of the content system.',
      },
      {
        title: 'Premium page structure',
        description: 'Large-format layouts, clean rails, and stronger hierarchy make browsing feel intentional.',
      },
      {
        title: 'Connected destinations',
        description: 'Profiles, resources, stories, listings, and documents stay within one coherent interface.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Use one direct channel for collaborations, questions, and publishing support.',
    description:
      'Reach out about submissions, partnerships, profile pages, visual features, or general support. We keep the contact experience simple and useful.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search images, profiles, posts, topics, and resources across the site.',
    },
    hero: {
      badge: 'Search the network',
      title: 'Find visuals, profiles, and resources faster.',
      description: 'Use keywords, categories, and content types to move through every active section from one search surface.',
      placeholder: 'Search by keyword, category, title, or content type',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing workspace.',
      description: 'Use your account to prepare visual posts, profiles, resources, and supporting content from one clean editor.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content across every live section.',
      description: 'Choose a content type, add key details, and save a clean draft with title, summary, links, imagery, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Return to your publishing and discovery workspace.',
      description: 'Login to continue browsing, managing drafts, and creating new submissions through your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Create access',
      title: 'Open your account and start publishing.',
      description: 'Create an account to access the publishing workspace, keep your details, and prepare content for the live sections.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit site',
    },
  },
} as const
