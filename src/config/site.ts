/**
 * Site-wide configuration. Content (posts, projects, books, papers,
 * resume) lives in src/content/ and src/data/ — never hardcode it here
 * or in components. This file is only for identity and feature flags.
 */
export const site = {
  /** TODO: your full name (used in header, footer, resume, and meta tags) */
  name: 'Hossein',
  role: 'Software Engineer',
  tagline: 'Building cloud platforms, APIs, and AI agents.',
  description:
    'Personal site of Hossein — software engineer working on cloud platforms, Go and TypeScript services, and applied AI agents.',
  url: 'https://hosseintrz.github.io',
  github: 'https://github.com/hosseintrz',
  githubUser: 'hosseintrz',
  /** TODO: add your email if you want it shown */
  email: '',
  /** TODO: add your location if you want it shown */
  location: '',
  photo: '/images/profile.jpg',
  resumePdf: '/resume.pdf',
  ogImage: '/og/default.png',
  nav: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/library', label: 'Library' },
    { href: '/now', label: 'Now' },
    { href: '/resume', label: 'Resume' },
  ],
  features: {
    /** giscus comments on blog posts — off by default */
    comments: {
      enabled: false,
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
    },
    /** GoatCounter analytics — off by default */
    analytics: {
      enabled: false,
      code: '',
      script: 'https://gc.zgo.at/count.js',
    },
  },
} as const;

export type SiteConfig = typeof site;