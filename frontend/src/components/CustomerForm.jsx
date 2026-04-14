import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictFd, recommendFd, saveUser } from '../services/api'

const initialState = {
  name: '',
  age: '',
  income: '',
  savings: '',
  riskLevel: 'Medium',
}

function CustomerForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required.'
    if (!formData.age || Number(formData.age) < 18)
      nextErrors.age = 'Age must be 18 or above.'
    if (!formData.income || Number(formData.income) <= 0)
      nextErrors.income = 'Income should be greater than 0.'
    if (!formData.savings || Number(formData.savings) < 0)
      nextErrors.savings = 'Savings cannot be negative.'
    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setApiError('')

    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      name: formData.name.trim(),
      age: Number(formData.age),
      income: Number(formData.income),
      savings: Number(formData.savings),
      riskLevel: formData.riskLevel,
    }

    const apiPayload = {
      name: payload.name,
      age: payload.age,
      income: payload.income,
      savings: payload.savings,
      risk_level: payload.riskLevel,
    }

    try {
      setIsSubmitting(true)
      const [savedUser, prediction, recommendation] = await Promise.all([
        saveUser(apiPayload),
        predictFd(apiPayload),
        recommendFd(apiPayload),
      ])

      navigate('/analysis', {
        state: {
          customer: payload,
          apiData: {
            savedUser,
            prediction,
            recommendation,
          },
        },
      })
    } catch (error) {
      setApiError('Backend connection failed. Please make sure API server is running on port 8000.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
            Customer Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-blue-200 transition focus:ring-2"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="age">
            Age
          </label>
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 32"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-blue-200 transition focus:ring-2"
          />
          {errors.age ? <p className="mt-1 text-xs text-red-600">{errors.age}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="riskLevel">
            Risk Level
          </label>
          <select
            id="riskLevel"
            name="riskLevel"
            value={formData.riskLevel}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-blue-200 transition focus:ring-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="income">
            Monthly Income (INR)
          </label>
          <input
            id="income"
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            placeholder="e.g. 85000"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-blue-200 transition focus:ring-2"
          />
          {errors.income ? <p className="mt-1 text-xs text-red-600">{errors.income}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="savings">
            Current Savings (INR)
          </label>
          <input
            id="savings"
            type="number"
            name="savings"
            value={formData.savings}
            onChange={handleChange}
            placeholder="e.g. 350000"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-blue-200 transition focus:ring-2"
          />
          {errors.savings ? (
            <p className="mt-1 text-xs text-red-600">{errors.savings}</p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Analyzing...' : 'Analyze with AI'}
      </button>
      {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}
    </form>
  )
}

export default CustomerForm
