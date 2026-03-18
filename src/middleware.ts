import { NextRequest, NextResponse } from 'next/server';

const locales = ['es', 'en', 'pt', 'zh', 'ar'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  const preferred = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim().slice(0, 2));

  for (const lang of preferred) {
    if (locales.includes(lang)) {
      return lang;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // AML branch: redirect all pages to /invest (keep auth pages and API routes)
  const allowedPaths = ['/invest', '/login', '/register', '/verify', '/forgot-password', '/reset-password'];
  const localePrefix = pathname.split('/')[1]; // e.g. 'en', 'es'
  const pathWithoutLocale = pathname.replace(`/${localePrefix}`, '') || '/';

  if (pathnameHasLocale && !allowedPaths.includes(pathWithoutLocale) && pathWithoutLocale !== '/invest') {
    return NextResponse.redirect(new URL(`/${localePrefix}/invest`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg|.*\\..*).*)'],
};
