const BASE_URL = "http://127.0.0.1:8000"

export async function getQuotes() {
  const response = await fetch(`${BASE_URL}/quotes/`)
  if (!response.ok) {
    throw new Error('Error while fetching quotes')
  }
  return response.json()
}

export async function getDailyQuote() {
  const response = await fetch(`${BASE_URL}/quotes/daily/`)
  if (!response.ok) {
    throw new Error('Error while fetching quote of the day')
  }
  return response.json()
}

export async function getPopularQuotes() {
  const response = await fetch(`${BASE_URL}/quotes/popular/`)
  if (!response.ok) {
    throw new Error('Error while fetching quote of the day')
  }
  return response.json()
}

export async function getRecentQuotes() {
  const response = await fetch(`${BASE_URL}/quotes/recent/`)
  if (!response.ok) {
    throw new Error('Error while fetching quote of the day')
  }
  return response.json()
}

export async function incrementLike(quoteId: number) {
  const response = await fetch(`${BASE_URL}/quotes/${quoteId}/like`, { method: 'POST' });
  return response.json();
}

export async function decrementLike(quoteId: number) {
  const response = await fetch(`${BASE_URL}/quotes/${quoteId}/unlike`, { method: 'POST' });
  return response.json();
}

export async function getAuthors() {
  const response = await fetch(`${BASE_URL}/authors/`)
  if (!response.ok) {
    throw new Error('Error while fetching authors')
  }
  return response.json()
}