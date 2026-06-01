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
  designTemplate: DesignTemplate
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

export interface CompanyInfo {
  companyName: string | null
  phone: string | null
  email: string | null
  address: string | null
  primaryColor: string
}

export type BlockType = 'header' | 'hero' | 'text' | 'split' | 'features' | 'services' | 'team' | 'cta' | 'footer' | 'pitch'

export interface PageBlock {
  id: number
  type: BlockType
  position: number
  content: Record<string, unknown>
}

export interface PublicPitchPage {
  primaryColor: string
  designTemplate: DesignTemplate
  blocks: PageBlock[]
}

export interface PitchBlockContent {
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
