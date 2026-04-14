export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  return response.json()
}

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export async function saveUser(payload) {
  return postJson('/save-user', payload)
}

export async function predictFd(payload) {
  return postJson('/predict', payload)
}

export async function recommendFd(payload) {
  return postJson('/recommend', payload)
}

export async function askChatbot(message) {
  return postJson('/chatbot', { message })
}

export async function fetchAnalytics() {
  return getJson('/analytics')
}

export async function fetchEnhancedAnalytics() {
  return getJson('/analytics/enhanced')
}

export async function fetchCustomers(page = 1, pageSize = 20) {
  return getJson(`/customers?page=${page}&page_size=${pageSize}`)
}

export async function fetchCustomer(id) {
  return getJson(`/customers/${id}`)
}

export async function fetchMLStatus() {
  return getJson('/ml/status')
}

export async function loginAdmin(pin) {
  return postJson('/admin/login', { pin })
}

