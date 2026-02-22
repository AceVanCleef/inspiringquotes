import { Author } from "@/types/author";
import { Quote } from "@/types/quote";
import { ENV } from "@/config/env";

const BASE_URL = ENV.API_URL;

export async function getQuotes(): Promise<Quote[]> {
  const response = await fetch(`${BASE_URL}/quotes/`)
  if (!response.ok) {
    throw new Error('Error while fetching quotes')
  }
  return response.json()
}

export async function getQuote(quoteId: number): Promise<Quote> {
  const response = await fetch(`${BASE_URL}/quote/${quoteId}`);
  if (!response.ok) {
    if (response.status === 404) {
      console.warn(`Quote with ID ${quoteId} not found`);
    }
    throw new Error(`Failed to fetch quote #${quoteId}: ${response.statusText}`);
  }
  return response.json(); 
}

export async function getDailyQuote(): Promise<Quote> {
  const response = await fetch(`${BASE_URL}/quotes/daily/`)
  if (!response.ok) {
    throw new Error('Error while fetching quote of the day')
  }
  return response.json()
}

export async function getPopularQuotes(): Promise<Quote[]> {
  const response = await fetch(`${BASE_URL}/quotes/popular/`)
  if (!response.ok) {
    throw new Error('Error while fetching quote of the day')
  }
  return response.json()
}

export async function getRecentQuotes(): Promise<Quote[]> {
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

export async function getAuthors(): Promise<Author[]> {
  const response = await fetch(`${BASE_URL}/authors/`)
  if (!response.ok) {
    throw new Error('Error while fetching authors')
  }
  return response.json()
}

export async function getAuthor(id: string): Promise<Author | null> {
  const response = await fetch(`${BASE_URL}/authors/${id}`)
  if (response.status === 404) {
    // Ein 404 ist kein "Systemfehler", sondern eine klare Info: Nicht da.
    return null; 
  }

  if (!response.ok) {
    throw new Error('Error while fetching authors with ID ${id}: ${response.statusText}')
  }
  return response.json()
}

export async function getAuthorQuotes(author_id: string): Promise<Quote[]> {
  const response = await fetch(`${BASE_URL}/authors/${author_id}/quotes`)
  if (!response.ok) {
    throw new Error('Error while fetching authors with ID ${id}')
  }
  return response.json()
}