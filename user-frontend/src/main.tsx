import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage     from './pages/DashboardPage'
import ProfilePage       from './pages/ProfilePage'
import AdminPage         from './pages/AdminPage'
import NotFoundPage      from './pages/NotFoundPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

import './i18n'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login"            element={<LoginPage />} />
        <Route path="/register"         element={<RegisterPage />} />
        <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: 'transparent' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: 'transparent' } },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
