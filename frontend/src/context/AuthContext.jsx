import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Clear any stale localStorage token left over from previous versions
  if (localStorage.getItem('adminToken')) {
    localStorage.removeItem('adminToken')
  }

  // Use sessionStorage so the token expires when the browser tab is closed.
  // This ensures the admin must re-enter the PIN on every new session.
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem('adminToken'))
  )

  const login = (token) => {
    sessionStorage.setItem('adminToken', token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    sessionStorage.removeItem('adminToken')
    // Also clear any stale localStorage token from previous versions
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
