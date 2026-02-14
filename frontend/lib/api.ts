const BASE_URL = "http://127.0.0.1:8000"

export async function getQuotes() {
  const response = await fetch(`${BASE_URL}/quotes/`)
  if (!response.ok) {
    throw new Error('Error while fetching quotes')
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