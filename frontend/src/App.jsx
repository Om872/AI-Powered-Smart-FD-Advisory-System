import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import ChatbotWidget from './components/ChatbotWidget'

// Eagerly preload Login + Admin so first click is instant (no chunk download delay)
const HomePage = lazy(() => import('./pages/HomePage'))
const CustomerInputPage = lazy(() => import('./pages/CustomerInputPage'))
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

// Start preloading Login and Admin chunks immediately on app mount
import('./pages/LoginPage')
import('./pages/AdminPage')

// AuthContext is now synchronous — no isLoading needed
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-[#1E3A8A]" />
                <p className="text-sm">Loading...</p>
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
