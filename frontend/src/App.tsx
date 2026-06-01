import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { LeadDetailPage } from './pages/LeadDetailPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { SettingsPage } from './pages/SettingsPage'
import { PitchPagePublic } from './pages/PitchPagePublic'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/p/:slug" element={<PitchPagePublic />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
              />
              <Route
                path="/leads/:id"
                element={<ProtectedRoute><LeadDetailPage /></ProtectedRoute>}
              />
              <Route
                path="/templates"
                element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>}
              />
              <Route
                path="/settings"
                element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
