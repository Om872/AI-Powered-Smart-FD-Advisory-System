import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ChatbotWidget from './components/ChatbotWidget'

const HomePage = lazy(() => import('./pages/HomePage'))
const CustomerInputPage = lazy(() => import('./pages/CustomerInputPage'))
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const CustomersPage = lazy(() => import('./pages/CustomersPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

import { AuthProvider, useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-[#1E3A8A]" />
                <p>Loading interface...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/customer-input" element={<CustomerInputPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ChatbotWidget />
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#334155',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '12px',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
          }} 
        />
      </AuthProvider>
    </>
  )
}

export default App

