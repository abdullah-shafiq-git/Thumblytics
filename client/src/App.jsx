import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'))
const GeneratorPage = lazy(() => import('./pages/GeneratorPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))

// Layout
import Navbar from './components/Navbar'
import DashboardLayout from './components/DashboardLayout'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center" style={{ height: '100vh' }}><div className="spinner" /></div>
  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
        <Suspense fallback={<div className="flex items-center justify-center" style={{ height: '100vh' }}><div className="spinner" /></div>}>
            <Routes>
                {/* Public */}
                <Route path="/" element={<><Navbar /><LandingPage /></>} />
                <Route path="/pricing" element={<><Navbar /><PricingPage /></>} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* Protected */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <DashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/analyzer" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <AnalyzerPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/generator" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <GeneratorPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
