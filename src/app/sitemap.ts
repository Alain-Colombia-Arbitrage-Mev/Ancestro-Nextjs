import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { localizedAlternates, canonicalUrl, publicSeoPaths } from '@/lib/seo';

function priorityForPath(path: string): number {
  if (path === '') return 1;
  if (path.startsWith('/energy') || path.startsWith('/charging')) return 0.85;
  if (path === '/join' || path === '/proposal' || path === '/contact') return 0.8;
  return 0.65;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((lang) =>
    publicSeoPaths.map((path) => ({
      url: canonicalUrl(lang, path),
      lastModified,
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: priorityForPath(path),
      alternates: {
        languages: localizedAlternates(path),
      },
    }))
  );
}
