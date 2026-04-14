import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAdmin } from '../services/api'

function SecurityPinPage() {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs[0].current) inputRefs[0].current.focus()
  }, [])

  const handleChange = (index, value) => {
    // Only accept numbers
    if (value !== '' && !/^[0-9]+$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value

    setPin(newPin)
    setError('')

    // Move to next input automatically
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus()
    }

    // Auto submit if all 4 are filled
    if (newPin.every((digit) => digit !== '')) {
      handleSubmit(newPin.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && index > 0 && pin[index] === '') {
      inputRefs[index - 1].current.focus()
    }
  }

  const handleSubmit = async (fullPin) => {
    try {
      setLoading(true)
      setError('')
      const data = await loginAdmin(fullPin)
      login(data.token)
      navigate('/admin')
    } catch (err) {
      setError('Invalid PIN')
      setPin(['', '', '', '']) // reset
      if (inputRefs[0].current) inputRefs[0].current.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl transition-all">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-500 ${error ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 text-slate-800'}`}>
            {error ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><line x1="12" y1="15" x2="12" y2="15.01" /></svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Security Unlock</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your 4-digit master PIN to access the intelligence control center.</p>
        </div>

        <div className="mb-6 flex justify-center gap-3">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className={`h-14 w-14 rounded-2xl border text-center text-2xl font-bold transition-all focus:outline-none focus:ring-2 ${
                error 
                  ? 'border-rose-300 bg-rose-50 text-rose-600 focus:ring-rose-500' 
                  : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500'
              } ${loading ? 'opacity-50' : 'opacity-100'}`}
            />
          ))}
        </div>

        <div className="h-6 text-center">
          {error ? (
            <p className="animate-pulse text-sm font-semibold text-rose-500">{error}</p>
          ) : loading ? (
             <p className="animate-bounce text-sm font-semibold text-blue-500">Verifying...</p>
          ) : null}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-[#1E3A8A] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SecurityPinPage
