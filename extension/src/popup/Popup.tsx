import { useState, useEffect, useCallback } from 'react'
import { apiLogin, apiCreateLead } from '../api/client'
import type { ScanResult } from '../types'

type Screen = 'loading' | 'login' | 'scanning' | 'result' | 'saved' | 'error'

const DASHBOARD_URL = 'http://localhost:5173'

export function Popup() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [scan, setScan] = useState<ScanResult | null>(null)
  const [savedLeadId, setSavedLeadId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    chrome.storage.local.get(['leadz_token'], (result) => {
      if (result.leadz_token) {
        setToken(result.leadz_token)
        startScan(result.leadz_token)
      } else {
        setScreen('login')
      }
    })
  }, [])

  const startScan = useCallback((authToken: string) => {
    setScreen('scanning')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (!tab?.id) {
        setScreen('error')
        return
      }
      chrome.tabs.sendMessage(tab.id, { type: 'SCAN_PAGE' }, (response) => {
        if (chrome.runtime.lastError || !response?.data) {
          chrome.scripting.executeScript(
            { target: { tabId: tab.id! }, files: ['content.js'] },
            () => {
              chrome.tabs.sendMessage(tab.id!, { type: 'SCAN_PAGE' }, (res) => {
                if (res?.data) {
                  setScan(res.data)
                  setScreen('result')
                } else {
                  setScreen('error')
                }
              })
            }
          )
        } else {
          setScan(response.data)
          setScreen('result')
        }
        void authToken
      })
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)
    try {
      const { token: newToken } = await apiLogin(email, password)
      chrome.storage.local.set({ leadz_token: newToken })
      setToken(newToken)
      startScan(newToken)
    } catch {
      setLoginError('Invalid credentials')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleSave = async () => {
    if (!scan || !token) return
    setIsSaving(true)
    setSaveError('')
    try {
      const lead = await apiCreateLead(token, scan)
      setSavedLeadId(lead.id)
      setScreen('saved')
    } catch (err: any) {
      if (err?.status === 401) {
        chrome.storage.local.remove('leadz_token')
        setToken(null)
        setScreen('login')
      } else {
        setSaveError('Failed to save lead. Please try again.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    chrome.storage.local.remove('leadz_token')
    setToken(null)
    setScan(null)
    setScreen('login')
  }

  if (screen === 'loading') {
    return (
      <div className="screen" style={{ textAlign: 'center', paddingTop: 40 }}>
        <div style={{ color: '#9ca3af', fontSize: 13 }}>Loading…</div>
      </div>
    )
  }

  if (screen === 'login') {
    return (
      <div className="screen">
        <h1>Leadz</h1>
        <div className="subtitle">Sign in to save leads</div>
        <form onSubmit={handleLogin}>
          {loginError && <div className="error">{loginError}</div>}
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
          />
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    )
  }

  if (screen === 'scanning') {
    return (
      <div className="screen" style={{ textAlign: 'center', paddingTop: 40 }}>
        <div style={{ color: '#0284c7', fontSize: 13 }}>Scanning page…</div>
      </div>
    )
  }

  if (screen === 'error') {
    return (
      <div className="screen">
        <div className="error">Could not scan this page. Try refreshing and re-opening.</div>
        <button onClick={() => token && startScan(token)}>Retry</button>
        <button className="logout" onClick={handleLogout}>Sign out</button>
      </div>
    )
  }

  if (screen === 'saved' && scan) {
    return (
      <div className="screen">
        <h1>Leadz</h1>
        <div className="success">Lead saved successfully!</div>
        <div className="info">
          <div className="domain">{scan.domain}</div>
          <div className="url">{scan.url}</div>
        </div>
        <a
          href={`${DASHBOARD_URL}/leads/${savedLeadId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', marginBottom: 8 }}
        >
          Open in Leadz →
        </a>
        <button onClick={() => token && startScan(token)} style={{ marginTop: 4 }}>
          Scan another
        </button>
        <button className="logout" onClick={handleLogout}>Sign out</button>
      </div>
    )
  }

  if (screen === 'result' && scan) {
    return (
      <div className="screen">
        <h1>Leadz</h1>
        <div className="info">
          <div className="domain">{scan.domain}</div>
          <div className="url">{scan.url}</div>
          {scan.title && (
            <div className="meta-row">
              <span className="meta-label">Title: </span>{scan.title}
            </div>
          )}
          {scan.h1Texts.length > 0 && (
            <div className="meta-row">
              <span className="meta-label">H1: </span>{scan.h1Texts[0]}
            </div>
          )}
          {scan.detectedEmails.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div className="meta-label" style={{ fontSize: 11, marginBottom: 3 }}>Emails found</div>
              <div className="chip-list">
                {scan.detectedEmails.map((e) => <span key={e} className="chip">{e}</span>)}
              </div>
            </div>
          )}
          {scan.detectedPhones.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div className="meta-label" style={{ fontSize: 11, marginBottom: 3 }}>Phones found</div>
              <div className="chip-list">
                {scan.detectedPhones.map((p) => <span key={p} className="chip">{p}</span>)}
              </div>
            </div>
          )}
        </div>
        {saveError && <div className="error">{saveError}</div>}
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save as Lead'}
        </button>
        <button className="logout" onClick={handleLogout}>Sign out</button>
      </div>
    )
  }

  return null
}
