import { MetadataRoute } from 'next';
import { getAuthors, getQuotes } from '@/lib/api'; // Angenommene BFF-Funktionen

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://inspiringquotes.ch';

  // 1. Statische Routen definieren
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily', // Der Feed ändert sich oft
      priority: 1.0,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    /* terms of service is impressum so far. 
        change it once ToS is clearly defiend on a seperate page. */
  ];

  try {
    // 2. Dynamische Daten parallel über das BFF-Layer abfragen
    const [authors, quotes] = await Promise.all([
      getAuthors(),
      getQuotes(),
    ]);

    // 3. Dynamische Autoren-Routen generieren
    const authorRoutes: MetadataRoute.Sitemap = (authors || []).map((author) => ({
      url: `${baseUrl}/authors/${author.id}`,
      lastModified: new Date(), // Ideal wäre author.updated_at
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 4. Dynamische Zitat-Routen generieren
    const quoteRoutes: MetadataRoute.Sitemap = (quotes || []).map((quote) => ({
      url: `${baseUrl}/quotes/${quote.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Ein einmal erfasstes Zitat ändert sich selten
      priority: 0.6,
    }));

    // Alles zu einer einzigen Sitemap verschmelzen
    return [...staticRoutes, ...authorRoutes, ...quoteRoutes];

  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
    // Robustes Fail-Safe: Wenn die API down ist, liefern wir zumindest die statischen Seiten aus
    return staticRoutes;
  }
}