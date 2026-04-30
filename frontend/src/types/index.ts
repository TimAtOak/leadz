export type LeadStatus =
  | 'new'
  | 'reviewed'
  | 'page_created'
  | 'contacted'
  | 'opened'
  | 'responded'
  | 'won'
  | 'lost'

export interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

export interface WebsiteScan {
  url: string
  domain: string
  title: string | null
  metaDescription: string | null
  h1Texts: string[]
  detectedEmails: string[]
  detectedPhones: string[]
  faviconUrl: string | null
  ogImageUrl: string | null
  logoUrl: string | null
  scannedAt: string
}

export type DesignTemplate = 'modern' | 'colorful' | 'corporate' | 'minimal'

export interface PitchPage {
  id: number
  subject: string
  body: string
  publicSlug: string
  viewCount: number
  publishedAt: string
  templateId: number | null
  designTemplate: DesignTemplate
  shareUrl: string
}

export interface Lead {
  id: number
  url: string
  domain: string
  title: string | null
  companyName: string | null
  contactEmail: string | null
  contactPhone: string | null
  status: LeadStatus
  notes: string | null
  hasPitchPage: boolean
  pitchPageSlug: string | null
  createdAt: string
  updatedAt: string
  websiteScan?: WebsiteScan
  pitchPage?: PitchPage
}

export interface Template {
  id: number
  name: string
  subject: string
  body: string
  isDefault: boolean
  isGlobal: boolean
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface PublicPitchPage {
  subject: string
  body: string
  domain: string
  companyName: string | null
  publishedAt: string
  designTemplate: DesignTemplate
  faviconUrl: string | null
  ogImageUrl: string | null
  logoUrl: string | null
}
