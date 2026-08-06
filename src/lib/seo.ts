import { defaultLocale, locales } from '@/i18n/config';

export const SITE_URL = 'https://ancestro.ai';
export const SITE_NAME = 'Ancestro';
export const DEFAULT_OG_IMAGE = '/ancestroimage.png';

export const publicSeoPaths = [
  '',
  '/join',
  '/contact',
  '/proposal',
  '/presale',
  '/invest',
  '/team',
  '/waitlist',
  '/energy/home',
  '/energy/business',
  '/charging/home',
  '/charging/level-2',
  '/charging/level-3',
] as const;

export function absoluteUrl(path = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function canonicalUrl(lang: string, path = ''): string {
  return absoluteUrl(`/${lang}${path}`);
}

export function localizedAlternates(path = ''): Record<string, string> {
  const alternates = Object.fromEntries(
    locales.map((locale) => [locale, canonicalUrl(locale, path)])
  );

  return {
    ...alternates,
    'x-default': canonicalUrl(defaultLocale, path),
  };
}

export function openGraphLocale(lang: string): string {
  const localeMap: Record<string, string> = {
    es: 'es_LA',
    en: 'en_US',
    pt: 'pt_BR',
    zh: 'zh_CN',
    ar: 'ar',
  };

  return localeMap[lang] || localeMap.es;
}
