import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || '',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Discover', href: '/image' },
      
    ],
    actions: {
      primary: { label: 'Sign up', href: '/signup' },
      secondary: { label: 'Login', href: '/login' },
    },
  },
  footer: {
    tagline: '',
    description:
      '',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Images', href: '/image' },
          { label: 'Articles', href: '/article' },
          { label: 'Profiles', href: '/profile' },
          { label: 'Resources', href: '/pdf' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Designed for clear discovery, elegant browsing, and modern publishing.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
