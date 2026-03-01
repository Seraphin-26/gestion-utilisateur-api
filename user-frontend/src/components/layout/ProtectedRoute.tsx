import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}