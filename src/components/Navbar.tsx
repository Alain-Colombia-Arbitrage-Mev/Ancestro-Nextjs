'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '@/i18n/translations';
import { useAuth } from '@/lib/auth-context';
import { CDN_URL } from '@/lib/cdn';

interface NavbarProps {
  lang: string;
}

interface MegaMenuCard {
  title: string;
  image: string;
  href: string;
}

interface MegaMenuLink {
  label: string;
  href: string;
}

interface MegaMenuData {
  cards: MegaMenuCard[];
  links: MegaMenuLink[];
}

const megaMenuData: Record<string, MegaMenuData> = {
  energy: {
    cards: [
      { title: 'Home', image: `${CDN_URL}/megamenu/energy-home.png`, href: '/LANG/energy/home' },
      { title: 'Business', image: `${CDN_URL}/megamenu/energy-business.png`, href: '/LANG/energy/business' },
    ],
    links: [
      { label: 'Get a Proposal', href: '/LANG/join' },
      { label: 'Incentives', href: '/LANG/coming-soon' },
      { label: 'Partner with Ancestro', href: '/LANG/join?profile=strategic' },
      { label: 'Host land or roof', href: '/LANG/join?profile=host' },
      { label: 'Equipment', href: '/LANG/coming-soon' },
    ],
  },
  charging: {
    cards: [
      { title: 'Level 3\nFast Charger', image: `${CDN_URL}/megamenu/charging-l3.webp`, href: '/LANG/charging/level-3' },
      { title: 'Level 2\nFast Charger', image: `${CDN_URL}/megamenu/charging-l2.webp`, href: '/LANG/charging/level-2' },
      { title: 'Home Charging', image: `${CDN_URL}/megamenu/charging-home.webp`, href: '/LANG/charging/home' },
    ],
    links: [
      { label: 'Download Charging App', href: '/LANG/coming-soon' },
      { label: 'Help Me Charge', href: '/LANG/coming-soon' },
      { label: 'Charging Calculator', href: '/LANG/coming-soon' },
      { label: 'Ancestro Charging Map', href: '/LANG/coming-soon' },
      { label: 'Host a Charger', href: '/LANG/join?profile=host' },
      { label: 'Incentives', href: '/LANG/coming-soon' },
      { label: 'Equipment', href: '/LANG/coming-soon' },
    ],
  },
  vehicles: {
    cards: [
      { title: 'Cars', image: `${CDN_URL}/megamenu/vehicles-cars.webp`, href: '/LANG/coming-soon' },
      { title: 'Trucks', image: `${CDN_URL}/megamenu/vehicles-trucks.webp`, href: '/LANG/coming-soon' },
      { title: 'Bus', image: `${CDN_URL}/megamenu/vehicles-bus.webp`, href: '/LANG/coming-soon' },
      { title: 'e-Motorcycle', image: `${CDN_URL}/megamenu/vehicles-motorcycle.webp`, href: '/LANG/coming-soon' },
      { title: 'e-Scooter', image: `${CDN_URL}/megamenu/vehicles-scooter.webp`, href: '/LANG/coming-soon' },
      { title: 'Golf Cart', image: `${CDN_URL}/megamenu/vehicles-golf.webp`, href: '/LANG/coming-soon' },
    ],
    links: [
      { label: 'Trade-in', href: '/LANG/coming-soon' },
      { label: 'Find Collision Center', href: '/LANG/coming-soon' },
      { label: 'Financing', href: '/LANG/coming-soon' },
      { label: 'Find a Charger', href: '/LANG/coming-soon' },
      { label: 'Fleet', href: '/LANG/coming-soon' },
      { label: 'Incentives', href: '/LANG/coming-soon' },
      { label: 'Semi', href: '/LANG/coming-soon' },
      { label: 'Insurance', href: '/LANG/coming-soon' },
    ],
  },
  shop: {
    cards: [
      { title: 'Stays', image: `${CDN_URL}/megamenu/shop-stays.webp`, href: '/LANG/coming-soon' },
      { title: 'Experiences', image: `${CDN_URL}/megamenu/shop-experiences.png`, href: '/LANG/coming-soon' },
      { title: 'Health', image: `${CDN_URL}/megamenu/shop-health.webp`, href: '/LANG/coming-soon' },
      { title: 'Lifestyle', image: `${CDN_URL}/megamenu/shop-lifestyle.webp`, href: '/LANG/coming-soon' },
      { title: 'Dining', image: `${CDN_URL}/megamenu/shop-dining.webp`, href: '/LANG/coming-soon' },
    ],
    links: [],
  },
};

export default function Navbar({ lang }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const megaMenuKeys = ['energy', 'charging', 'vehicles'];

  const navItems = [
    { label: t(lang, 'nav.energy'), href: '#energy', key: 'energy' },
    { label: t(lang, 'nav.charging'), href: '#charging', key: 'charging' },
    { label: t(lang, 'nav.vehicles'), href: '#vehicles', key: 'vehicles' },
    // { label: t(lang, 'nav.shop'), href: '#shop', key: 'shop' },
    { label: t(lang, 'nav.team'), href: `/${lang}/team`, key: 'team' },
    { label: t(lang, 'nav.join'), href: `/${lang}/join`, key: 'join' },
    { label: t(lang, 'nav.waitlist'), href: `/${lang}/waitlist`, key: 'waitlist' },
    { label: t(lang, 'nav.contact'), href: `/${lang}/contact`, key: 'contact' },
  ];

  const languages = [
    { code: 'es', name: 'Español', flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><mask id="fes"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#fes)"><path fill="#ffda44" d="M0 128h512v256H0z"/><path fill="#d80027" d="M0 0h512v128H0zm0 384h512v128H0z"/></g></svg> },
    { code: 'en', name: 'English', flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><mask id="fen"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#fen)"><path fill="#eee" d="M256 0h256v64l-32 32 32 32v64l-32 32 32 32v64l-32 32 32 32v64l-256 32L0 448v-64l32-32-32-32v-64z"/><path fill="#d80027" d="M224 64h288v64H224Zm0 128h288v64H256ZM0 320h512v64H0Zm0 128h512v64H0Z"/><path fill="#0052b4" d="M0 0h256v256H0Z"/><g fill="#eee"><path d="m187 243 57-41h-70l57 41-22-67zm-81 0 57-41H93l57 41-22-67zm-81 0 57-41H12l57 41-22-67zm162-81 57-41h-70l57 41-22-67zm-81 0 57-41H93l57 41-22-67zm-81 0 57-41H12l57 41-22-67Zm162-82 57-41h-70l57 41-22-67Zm-81 0 57-41H93l57 41-22-67Zm-81 0 57-41H12l57 41-22-67Z"/></g></g></svg> },
    { code: 'pt', name: 'Português', flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><mask id="fpt"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#fpt)"><path fill="#6da544" d="M0 0h512v512H0z"/><path fill="#ffda44" d="M256 100.2 467.5 256 256 411.8 44.5 256z"/><circle cx="256" cy="256" r="89" fill="#eee"/><path fill="#0052b4" d="M211.5 250a89 89 0 0 0-44.5 6.3 89 89 0 0 0 178 0 89 89 0 0 0-133.5-6.3z"/></g></svg> },
    { code: 'zh', name: '中文', flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><mask id="fzh"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#fzh)"><path fill="#d80027" d="M0 0h512v512H0z"/><path fill="#ffda44" d="m140.1 155.8 22.1 68h71.5l-57.8 42.1 22.1 68-57.9-42-57.9 42 22.2-68-57.9-42.1H118z"/></g></svg> },
    { code: 'ar', name: 'العربية', flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><mask id="far"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#far)"><path fill="#6da544" d="M0 0h512v512H0z"/><g fill="#eee"><path d="M144.7 306v-89h22.3v66.8h111.3V195h22.3v111zM367 306v-89h22.3v88.9zM166.8 239.1h111.5v22.3H166.8z"/><path d="M211.5 217h22.3v67h-22.3zm67 0h22.3v67h-22.3zm67 67h22.3v22h-22.3z"/><path d="M144.7 306h244.6v22.3H144.7z"/></g></g></svg> },
  ];

  const handleMegaMenuEnter = useCallback((key: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setActiveMegaMenu(key);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  }, []);

  function toggleMenu() {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    setIsOpen(false);
    setMobileExpanded(null);
    document.body.style.overflow = '';
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024 && isOpen) closeMenu();
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeMenu(); setLangDropdownOpen(false); setUserDropdownOpen(false); setActiveMegaMenu(null); }
    }
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleEscape);
    return () => { window.removeEventListener('resize', handleResize); document.removeEventListener('keydown', handleEscape); };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.lang-switcher')) setLangDropdownOpen(false);
      if (!target.closest('.nav-user-menu')) setUserDropdownOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  async function handleLogout() {
    await logout();
    window.location.href = `/${lang}`;
  }

  const currentRoute = pathname.replace(/^\/(es|en|pt|zh|ar)/, '') || '/';

  const currentMegaMenu = activeMegaMenu ? megaMenuData[activeMegaMenu] : null;

  return (
    <>
      <nav className="navbar" ref={navbarRef}>
        <div className="navbar-inner">
          <Link href={`/${lang}`} className="logo">
            <img src={`${CDN_URL}/logo.svg`} alt="Ancestro Logo" className="logo-img" width={200} height={40} />
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links-desktop">
            {navItems.map((item) => {
              const hasMegaMenu = megaMenuKeys.includes(item.key);
              const isActive = activeMegaMenu === item.key;

              const linkProps = {
                className: `nav-link ${item.key === 'join' ? 'nav-link-highlight' : ''} ${isActive ? 'nav-link-active' : ''}`,
                ...(hasMegaMenu ? {
                  onMouseEnter: () => handleMegaMenuEnter(item.key),
                  onMouseLeave: handleMegaMenuLeave,
                } : {}),
              };

              return item.href.startsWith('#') ? (
                <a key={item.key} href={item.href} {...linkProps}>
                  {item.label}
                  {hasMegaMenu && (
                    <svg className={`nav-link-arrow ${isActive ? 'rotated' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </a>
              ) : (
                <Link key={item.key} href={item.href} {...linkProps}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="nav-right-desktop">
            {/* Language Switcher */}
            <div className={`lang-switcher ${langDropdownOpen ? 'open' : ''}`}>
              <button className="lang-trigger" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
                <span className="flag-icon">{languages.find(l => l.code === lang)?.flag}</span>
                <span className="lang-code">{lang.toUpperCase()}</span>
                <svg className="lang-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="lang-dropdown">
                {languages.map((l) => (
                  <Link key={l.code} href={`/${l.code}${currentRoute}`} className={`lang-option ${l.code === lang ? 'active' : ''}`} onClick={() => setLangDropdownOpen(false)}>
                    <span className="flag-icon flag-icon-lg">{l.flag}</span>
                    <span className="lang-name">{l.name}</span>
                    {l.code === lang && (
                      <svg className="lang-check" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="nav-user-menu">
                <button className="nav-user-trigger" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  <span className="nav-user-avatar">{(user.name || user.email)[0].toUpperCase()}</span>
                  <span className="nav-user-name">{user.name || user.email.split('@')[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`nav-user-dropdown ${userDropdownOpen ? 'active' : ''}`}>
                  <Link href={`/${lang}/dashboard`} className="nav-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {t(lang, 'auth.dashboard')}
                  </Link>
                  <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    {t(lang, 'auth.logout')}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Mobile */}
          <div className="nav-right-mobile">
            <div className={`lang-switcher ${langDropdownOpen ? 'open' : ''}`}>
              <button className="lang-trigger" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
                <span className="flag-icon">{languages.find(l => l.code === lang)?.flag}</span>
                <svg className="lang-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="lang-dropdown">
                {languages.map((l) => (
                  <Link key={l.code} href={`/${l.code}${currentRoute}`} className={`lang-option ${l.code === lang ? 'active' : ''}`} onClick={() => { setLangDropdownOpen(false); closeMenu(); }}>
                    <span className="flag-icon flag-icon-lg">{l.flag}</span>
                    <span className="lang-name">{l.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mega Menu Panel */}
        <div
          className={`megamenu-panel ${activeMegaMenu ? 'active' : ''}`}
          onMouseEnter={() => { if (activeMegaMenu) handleMegaMenuEnter(activeMegaMenu); }}
          onMouseLeave={handleMegaMenuLeave}
        >
          {currentMegaMenu && (
            <div className="megamenu-content">
              <div className="megamenu-cards">
                {currentMegaMenu.cards.map((card) => (
                  <a key={card.title} href={card.href.replace('/LANG/', `/${lang}/`)} className="megamenu-card">
                    <div className="megamenu-card-image">
                      <img src={card.image} alt={card.title} loading="lazy" />
                    </div>
                    <div className="megamenu-card-info">
                      <span className="megamenu-card-title">{card.title}</span>
                      <div className="megamenu-card-actions">
                        <span>Learn More</span>
                        <span className="megamenu-card-divider"></span>
                        <span>Order</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {currentMegaMenu.links.length > 0 && (
                <>
                  <div className="megamenu-divider"></div>
                  <div className="megamenu-links">
                    {currentMegaMenu.links.map((link) => (
                      <a key={link.label} href={link.href.replace('/LANG/', `/${lang}/`)} className="megamenu-link">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <div className="mobile-nav-links">
              {navItems.map((item) => {
                const hasMegaMenu = megaMenuKeys.includes(item.key);
                const isExpanded = mobileExpanded === item.key;
                const menuData = hasMegaMenu ? megaMenuData[item.key] : null;

                if (hasMegaMenu && menuData) {
                  return (
                    <div key={item.key} className={`mobile-nav-group ${isExpanded ? 'expanded' : ''}`}>
                      <button
                        className="mobile-nav-link mobile-nav-trigger"
                        onClick={() => setMobileExpanded(isExpanded ? null : item.key)}
                        aria-expanded={isExpanded}
                      >
                        {item.label}
                        <svg className="mobile-nav-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <div className="mobile-nav-panel">
                        <div className="mobile-nav-cards">
                          {menuData.cards.map((card) => (
                            <a key={card.title} href={card.href.replace('/LANG/', `/${lang}/`)} className="mobile-nav-card" onClick={closeMenu}>
                              <div className="mobile-nav-card-image">
                                <img src={card.image} alt={card.title} loading="lazy" />
                              </div>
                              <span className="mobile-nav-card-title">{card.title}</span>
                            </a>
                          ))}
                        </div>
                        {menuData.links.length > 0 && (
                          <div className="mobile-nav-sublinks">
                            {menuData.links.map((link) => (
                              <a key={link.label} href={link.href.replace('/LANG/', `/${lang}/`)} className="mobile-nav-sublink" onClick={closeMenu}>
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return item.href.startsWith('#') ? (
                  <a key={item.key} href={item.href} className="mobile-nav-link" onClick={closeMenu}>
                    {item.label}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                ) : (
                  <Link key={item.key} href={item.href} className="mobile-nav-link" onClick={closeMenu}>
                    {item.label}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                );
              })}
            </div>

            {user ? (
              <div className="mobile-cta" style={{display:'block'}}>
                <Link href={`/${lang}/dashboard`} className="mobile-nav-link" style={{opacity:1,transform:'none'}} onClick={closeMenu}>
                  {t(lang, 'auth.dashboard')}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <button className="mobile-logout-btn" onClick={handleLogout}>{t(lang, 'auth.logout')}</button>
              </div>
            ) : null}

            <div className="mobile-footer">
              <p>{t(lang, 'nav.mobile.tagline')}</p>
              <div className="mobile-socials">
                <a href={`/${lang}/coming-soon`} aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
                <a href={`/${lang}/coming-soon`} aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="6" r="1" fill="currentColor"/></svg></a>
                <a href={`/${lang}/coming-soon`} aria-label="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2"/><rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2"/><circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2"/></svg></a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Megamenu overlay to close on click outside */}
      {activeMegaMenu && (
        <div className="megamenu-overlay" onClick={() => setActiveMegaMenu(null)} />
      )}

      <style>{`
        .navbar{position:fixed;top:0;left:0;right:0;height:79px;background-color:var(--color-black-50);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);z-index:1000}
        .navbar-inner{display:flex;align-items:center;justify-content:space-between;height:100%;max-width:1920px;margin:0 auto;padding:0 30px}
        .logo{display:flex;align-items:center;text-decoration:none;transition:opacity 0.2s ease;position:relative;z-index:1002}
        .logo:hover{opacity:0.9}
        .logo-img{height:40px;width:auto;object-fit:contain}
        .nav-links-desktop{display:flex;align-items:center;gap:4px;position:absolute;left:50%;transform:translateX(-50%)}
        .nav-link{display:flex;align-items:center;gap:4px;padding:10px;font-size:14px;font-weight:600;color:var(--color-white);text-decoration:none;transition:all var(--transition-fast);border-radius:8px;white-space:nowrap;cursor:pointer}
        .nav-link:hover{opacity:0.8}
        .nav-link-active{background:rgba(255,255,255,0.1);color:#f8b03b}
        .nav-link-highlight{color:var(--color-primary)}
        .nav-link-arrow{transition:transform 0.3s ease;opacity:0.6;margin-left:2px}
        .nav-link-arrow.rotated{transform:rotate(180deg);opacity:1}
        .nav-right-desktop{display:flex;align-items:center;gap:12px}
        .flag-icon{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;overflow:hidden;flex-shrink:0}
        .flag-icon svg{width:100%;height:100%}
        .flag-icon-lg{width:24px;height:24px}
        .lang-switcher{position:relative;z-index:100}
        .lang-trigger{display:flex;align-items:center;gap:6px;padding:8px 12px;background:rgba(255,255,255,0.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:var(--color-white);font-size:14px;font-weight:500;cursor:pointer;transition:all 0.3s ease}
        .lang-trigger:hover{background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.2)}
        .lang-switcher.open .lang-trigger{background:rgba(255,255,255,0.15);border-color:rgba(248,176,59,0.4)}
        .lang-code{font-size:13px;letter-spacing:0.5px}
        .lang-arrow{transition:transform 0.3s ease;opacity:0.7}
        .lang-switcher.open .lang-arrow{transform:rotate(180deg)}
        .lang-dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:180px;background:rgba(20,20,20,0.95);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:8px;opacity:0;visibility:hidden;transform:translateY(-10px) scale(0.95);transition:all 0.3s cubic-bezier(0.16,1,0.3,1);box-shadow:0 20px 50px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05) inset}
        .lang-switcher.open .lang-dropdown{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
        .lang-option{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;color:var(--color-white);text-decoration:none;transition:all 0.2s ease}
        .lang-option:hover{background:rgba(255,255,255,0.08)}
        .lang-option.active{background:rgba(248,176,59,0.15)}
        .lang-name{flex:1;font-size:14px;font-weight:500}
        .lang-check{color:var(--color-primary)}
        .nav-user-menu{position:relative}
        .nav-user-trigger{display:flex;align-items:center;gap:8px;padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:12px;cursor:pointer;color:var(--color-white);font-family:var(--font-family);font-size:14px;font-weight:600;transition:all 0.2s ease}
        .nav-user-trigger:hover{background:rgba(255,255,255,0.15)}
        .nav-user-avatar{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(248,176,59,0.2);color:var(--color-primary);font-weight:700;font-size:13px}
        .nav-user-dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:180px;background:rgba(20,20,20,0.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:6px;opacity:0;visibility:hidden;transform:translateY(-8px);transition:all 0.2s ease;z-index:1010}
        .nav-user-dropdown.active{opacity:1;visibility:visible;transform:translateY(0)}
        .nav-dropdown-item{display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;background:none;border:none;border-radius:8px;color:var(--color-white);font-family:var(--font-family);font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;transition:background 0.15s ease}
        .nav-dropdown-item:hover{background:rgba(255,255,255,0.08)}
        .nav-dropdown-logout{color:#ef4444}

        /* Mega Menu */
        .megamenu-panel{position:absolute;top:79px;left:0;right:0;max-height:0;overflow:hidden;opacity:0;transition:max-height 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.3s ease;z-index:999;pointer-events:none}
        .megamenu-panel.active{max-height:600px;opacity:1;pointer-events:auto}
        .megamenu-content{display:flex;align-items:stretch;gap:40px;max-width:1920px;margin:0 auto;padding:20px 60px;background:rgba(10,10,10,0.92);backdrop-filter:blur(30px) saturate(140%);-webkit-backdrop-filter:blur(30px) saturate(140%);border:1px solid rgba(255,255,255,0.12);border-radius:20px;margin-left:20px;margin-right:20px;box-shadow:0 30px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04) inset}
        .megamenu-cards{display:flex;align-items:center;justify-content:center;gap:24px;flex:1;padding:30px 0;flex-wrap:wrap}
        .megamenu-card{display:flex;flex-direction:column;align-items:center;gap:14px;text-decoration:none;width:170px;transition:transform 0.3s ease}
        .megamenu-card:hover{transform:translateY(-4px)}
        .megamenu-card-image{width:170px;height:140px;display:flex;align-items:center;justify-content:center;transition:transform 0.3s ease;position:relative}
        .megamenu-card:hover .megamenu-card-image{transform:scale(1.05)}
        .megamenu-card-image img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}
        .megamenu-card-info{display:flex;flex-direction:column;align-items:center;gap:6px}
        .megamenu-card-title{font-family:Inter,sans-serif;font-size:15px;font-weight:600;color:#fff;text-align:center;white-space:pre-line;line-height:1.25;letter-spacing:-0.01em}
        .megamenu-card-actions{display:flex;align-items:center;gap:10px}
        .megamenu-card-actions span{font-family:Inter,sans-serif;font-size:11px;font-weight:500;color:rgba(255,255,255,0.7);transition:color 0.2s ease}
        .megamenu-card:hover .megamenu-card-actions span:not(.megamenu-card-divider){color:#f8b03b}
        .megamenu-card-divider{width:1px;height:12px;background:rgba(255,255,255,0.25)}
        .megamenu-divider{width:1px;align-self:stretch;margin:30px 0;background:rgba(255,255,255,0.15);flex-shrink:0}
        .megamenu-links{display:flex;flex-direction:column;justify-content:center;gap:0;flex-shrink:0;min-width:180px;padding:30px 0}
        .megamenu-link{font-family:Inter,sans-serif;font-size:14px;font-weight:500;color:rgba(255,255,255,0.85);text-decoration:none;line-height:2.3;transition:color 0.2s ease;white-space:nowrap}
        .megamenu-link:hover{color:#f8b03b}
        .megamenu-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:998}

        @media(min-width:1440px){
          .megamenu-content{padding:20px 120px;gap:50px}
          .megamenu-cards{gap:36px}
          .megamenu-card,.megamenu-card-image{width:190px}
          .megamenu-card-image{height:160px}
          .megamenu-card-title{font-size:16px}
        }
        @media(min-width:1700px){
          .megamenu-content{padding:20px 180px}
          .megamenu-cards{gap:48px}
          .megamenu-card,.megamenu-card-image{width:210px}
          .megamenu-card-image{height:175px}
          .megamenu-card-title{font-size:18px}
          .megamenu-card-actions span{font-size:12px}
        }

        .nav-right-mobile{display:none}
        .hamburger{display:none}
        .mobile-menu{display:none}
        @media(max-width:1024px){
          .navbar-inner{padding:0 16px}
          .logo-img{height:35px}
          .nav-links-desktop,.nav-right-desktop,.megamenu-panel,.megamenu-overlay{display:none}
          .nav-right-mobile{display:flex;align-items:center;gap:12px;z-index:1002}
          .hamburger{display:flex;flex-direction:column;justify-content:center;align-items:center;width:44px;height:44px;padding:10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:12px;cursor:pointer;transition:all 0.3s ease}
          .hamburger:hover{background:rgba(255,255,255,0.15)}
          .hamburger-line{display:block;width:20px;height:2px;background-color:var(--color-white);border-radius:2px;transition:all 0.3s cubic-bezier(0.68,-0.6,0.32,1.6)}
          .hamburger-line:nth-child(1){margin-bottom:5px}
          .hamburger-line:nth-child(3){margin-top:5px}
          .hamburger.active{background:rgba(248,176,59,0.2);border-color:rgba(248,176,59,0.3)}
          .hamburger.active .hamburger-line:nth-child(1){transform:translateY(7px) rotate(45deg)}
          .hamburger.active .hamburger-line:nth-child(2){opacity:0;transform:scaleX(0)}
          .hamburger.active .hamburger-line:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
          .mobile-menu{display:block;position:fixed;top:0;left:0;right:0;width:100%;height:100vh;height:100dvh;background:rgba(5,5,5,0.97);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);opacity:0;visibility:hidden;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);z-index:1001;overflow-y:auto}
          .mobile-menu.active{opacity:1;visibility:visible}
          .mobile-menu-content{display:flex;flex-direction:column;min-height:100%;padding:100px 24px 40px;max-width:500px;margin:0 auto}
          .mobile-nav-links{display:flex;flex-direction:column;gap:12px;flex:1}
          .mobile-nav-group{display:flex;flex-direction:column;gap:0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;opacity:0;transform:translateY(20px);transition:all 0.3s ease}
          .mobile-menu.active .mobile-nav-group{opacity:1;transform:translateY(0)}
          .mobile-nav-group .mobile-nav-link.mobile-nav-trigger{background:transparent;border:none;opacity:1;transform:none;width:100%;cursor:pointer;font-family:inherit}
          .mobile-nav-group.expanded{background:rgba(248,176,59,0.06);border-color:rgba(248,176,59,0.25)}
          .mobile-nav-chevron{transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);color:var(--color-gray);flex-shrink:0}
          .mobile-nav-group.expanded .mobile-nav-chevron{transform:rotate(180deg);color:var(--color-primary)}
          .mobile-nav-panel{max-height:0;overflow:hidden;transition:max-height 0.4s cubic-bezier(0.16,1,0.3,1);padding:0 20px}
          .mobile-nav-group.expanded .mobile-nav-panel{max-height:1200px;padding:0 20px 20px}
          .mobile-nav-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;padding-top:8px}
          .mobile-nav-card{display:flex;flex-direction:column;align-items:center;gap:10px;padding:14px 8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-decoration:none;color:var(--color-white);transition:all 0.25s ease}
          .mobile-nav-card:active{background:rgba(248,176,59,0.1);border-color:rgba(248,176,59,0.35);transform:scale(0.97)}
          .mobile-nav-card-image{width:100%;height:70px;display:flex;align-items:center;justify-content:center}
          .mobile-nav-card-image img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}
          .mobile-nav-card-title{font-size:13px;font-weight:600;text-align:center;line-height:1.2;white-space:pre-line}
          .mobile-nav-sublinks{display:flex;flex-direction:column;gap:2px;margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08)}
          .mobile-nav-sublink{display:flex;align-items:center;padding:12px 6px;color:rgba(255,255,255,0.85);font-size:15px;font-weight:500;text-decoration:none;border-radius:8px;transition:all 0.2s ease}
          .mobile-nav-sublink:active{background:rgba(255,255,255,0.06);color:var(--color-primary);padding-left:12px}
          .mobile-nav-link{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;color:var(--color-white);font-size:18px;font-weight:600;text-decoration:none;transition:all 0.3s ease;opacity:0;transform:translateY(20px)}
          .mobile-menu.active .mobile-nav-links > *{opacity:1;transform:translateY(0)}
          .mobile-menu.active .mobile-nav-links > *:nth-child(1){transition-delay:0.05s}
          .mobile-menu.active .mobile-nav-links > *:nth-child(2){transition-delay:0.1s}
          .mobile-menu.active .mobile-nav-links > *:nth-child(3){transition-delay:0.15s}
          .mobile-menu.active .mobile-nav-links > *:nth-child(4){transition-delay:0.2s}
          .mobile-menu.active .mobile-nav-links > *:nth-child(5){transition-delay:0.25s}
          .mobile-menu.active .mobile-nav-links > *:nth-child(6){transition-delay:0.3s}
          .mobile-menu.active .mobile-nav-links > *:nth-child(7){transition-delay:0.35s}
          .mobile-menu.active .mobile-nav-links > *:nth-child(8){transition-delay:0.4s}
          .mobile-nav-link:hover,.mobile-nav-link:active{background:rgba(255,255,255,0.08);border-color:rgba(248,176,59,0.4);transform:scale(1.02)}
          .mobile-nav-link svg{color:var(--color-gray);transition:all 0.3s ease}
          .mobile-nav-link:hover svg{color:var(--color-primary);transform:translateX(4px)}
          .mobile-cta{margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);opacity:0;transform:translateY(20px);transition:all 0.4s ease 0.35s}
          .mobile-menu.active .mobile-cta{opacity:1;transform:translateY(0)}
          .mobile-footer{margin-top:32px;text-align:center;opacity:0;transform:translateY(20px);transition:all 0.4s ease 0.4s}
          .mobile-menu.active .mobile-footer{opacity:1;transform:translateY(0)}
          .mobile-footer p{font-size:14px;color:var(--color-gray);margin-bottom:16px}
          .mobile-socials{display:flex;justify-content:center;gap:16px}
          .mobile-socials a{display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:var(--color-gray);transition:all 0.3s ease}
          .mobile-socials a:hover{background:rgba(248,176,59,0.15);border-color:rgba(248,176,59,0.4);color:var(--color-primary);transform:translateY(-3px)}
          .mobile-logout-btn{width:100%;margin-top:12px;padding:16px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:14px;color:#ef4444;font-family:var(--font-family);font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease}
          .mobile-logout-btn:hover{background:rgba(239,68,68,0.2)}
          .lang-dropdown{position:fixed;top:70px;right:16px;left:auto;bottom:auto;min-width:200px;max-width:calc(100vw - 32px);max-height:70vh;overflow-y:auto;transform:translateY(-10px);z-index:10000}
          .lang-switcher.open .lang-dropdown{transform:translateY(0)}
          .lang-code{display:none}
          .lang-trigger{padding:10px 12px;min-height:44px;min-width:44px}
        }
        @media(max-width:380px){
          .mobile-menu-content{padding:90px 20px 30px}
          .mobile-nav-link{padding:18px 20px;font-size:17px}
        }
      `}</style>
    </>
  );
}
