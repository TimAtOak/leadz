const API_BASE = 'http://localhost:8000/api'

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw { status: response.status, body }
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export async function apiLogin(email: string, password: string): Promise<{ token: string }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function apiCreateLead(
  token: string,
  data: {
    url: string
    domain: string
    title: string | null
    metaDescription: string | null
    h1Texts: string[]
    detectedEmails: string[]
    detectedPhones: string[]
  }
): Promise<{ id: number; domain: string }> {
  return request('/leads', { method: 'POST', body: JSON.stringify(data) }, token)
}
