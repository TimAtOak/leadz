export interface ScanResult {
  url: string
  domain: string
  title: string | null
  metaDescription: string | null
  h1Texts: string[]
  detectedEmails: string[]
  detectedPhones: string[]
}

export interface AuthState {
  token: string | null
  userEmail: string | null
}

export type MessageType =
  | { type: 'SCAN_PAGE' }
  | { type: 'SCAN_RESULT'; data: ScanResult }
  | { type: 'GET_AUTH' }
  | { type: 'AUTH_STATE'; data: AuthState }
