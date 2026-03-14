'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const team = [
  {
    name: 'Tarzan J. Owens',
    role: 'Founder & CEO',
    bio: 'American-Colombian renewable energy entrepreneur. After exiting a U.S.-based solar venture, he founded Ancestro to address structural inefficiencies in Latin America\'s energy markets. Leads capital formation, government partnerships, and regional expansion.',
    linkedin: '#',
    dept: 'c-suite',
  },
  {
    name: 'Uwey D. Angarita',
    role: 'CCO & Vice President',
    bio: 'Leading the global evolution of renewable infrastructure and sustainable energy ecosystems. Experienced in marketing, AI, automation, and scalable enterprise infrastructure. Building global impact from purposeful roots.',
    linkedin: '#',
    dept: 'c-suite',
  },
  {
    name: 'Juan Sebastian Trivino',
    role: 'General Project Manager',
    bio: 'Industrial Engineer specialized in process optimization, control systems, and data-driven decision-making. Leading the structuring and execution of strategic projects focused on operational excellence and sustainable growth.',
    linkedin: '#',
    dept: 'c-suite',
  },
  {
    name: 'Alain Herra',
    role: 'Fintech Developer & IT Leader',
    bio: 'Scrum master and Senior developer with 15 years of experience. Expert in Blockchain, Python, Rust, and Go. DevOps specialist leading the technology infrastructure at Ancestro.',
    linkedin: '#',
    dept: 'tech',
  },
  {
    name: 'Umair Khan',
    role: 'Strategic Technology Partner',
    bio: 'Technology architect and engineering leader with deep experience building scalable digital platforms. Expert in backend architecture, distributed systems, AWS infrastructure, and secure authentication frameworks.',
    linkedin: '#',
    dept: 'tech',
  },
  {
    name: 'Muhammad Faisal Bin Saif',
    role: 'Strategic Technology Partner',
    bio: 'Technology entrepreneur who has built and scaled digital operations across the US, UK, Europe, and MENA regions. Focuses on aligning product strategy, AI-driven systems, and operational execution with long-term growth.',
    linkedin: '#',
    dept: 'tech',
  },
  {
    name: 'Franco Bonifaz',
    role: 'AI Automation Specialist',
    bio: 'Founder of PHNTM AI. Expert in multi-agent orchestration, complex API integrations, and designing end-to-end automation pipelines. Built AI-powered platforms for e-commerce and B2B SaaS companies at scale.',
    linkedin: '#',
    dept: 'tech',
  },
  {
    name: 'Camilo Ortiz',
    role: 'Head of Construction & Development',
    bio: 'Civil engineer with 10+ years in infrastructure and sustainable urban development. CEO of Construteckcol, Skydeluxe, and Mantra Group. Integrates engineering, design, blockchain, and bioclimatic approaches.',
    linkedin: '#',
    dept: 'buildings',
  },
  {
    name: 'Mateo Ramirez',
    role: 'PropTech & Operations Lead',
    bio: 'CEO of a real estate platform integrating design, remodeling, and property management. Specialist in financial flow analysis, event production, and value-oriented asset management.',
    linkedin: '#',
    dept: 'buildings',
  },
];

const advisors = [
  {
    name: 'Emil Akesson',
    role: 'Strategic Advisor & Board Chairman',
    bio: 'Seasoned entrepreneur, investor, and board chairman. Founded, invested in, and supported hundreds of businesses across industries with ventures reaching $50M+ ARR. Strengthens Ancestro\'s strategic clarity and investor readiness.',
  },
  {
    name: 'Marlon',
    role: 'Capital Markets Advisor',
    bio: 'American-Jamaican investor and capital markets executive with extensive experience in fixed income, equity structuring, and cross-border transactions. Advises on institutional capital strategy including green bond issuance.',
  },
  {
    name: 'Bentley G. Lamar',
    role: 'Executive Coach & Advisor',
    bio: 'American entrepreneur, advisor, investor, and executive coach with diverse background spanning construction, healthcare, and service industries. Expert in team leadership, operational systems, and scalable growth.',
  },
];

const legalAndFinance = [
  {
    name: 'Miguel Antonio Andrade',
    role: 'Legal - Digital Economy',
    bio: 'Attorney focused on legal and financial structuring for digital economy businesses. Specializes in tax optimization, digital assets, corporate design, and asset protection.',
  },
  {
    name: 'Leandro Buitrago',
    role: 'Legal - Private Law',
    bio: 'Attorney with emphasis in Private Law. Experience in auditing and government contracting, combining analytical focus, professional responsibility, and strategic legal solutions.',
  },
  {
    name: 'Willson Lopez',
    role: 'Legal Counsel',
    bio: 'Legal counsel supporting Ancestro\'s corporate governance and regulatory compliance across multiple jurisdictions.',
  },
  {
    name: 'Olga A. Villamil',
    role: 'Head of Accounting & Finance',
    bio: 'CPA specialized in Finance and IFRS. Expert in financial, tax, and internal control management. Experience in outsourced services and advisory for SMEs in Colombia.',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string): string {
  const prefixes = ['Dr.', 'Mr.', 'Ms.', 'Mrs.'];
  const parts = name.split(' ').filter(n => !prefixes.includes(n));
  return parts.map(n => n[0]).join('').slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  SVG icons                                                          */
/* ------------------------------------------------------------------ */

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface TeamSectionProps {
  lang: string;
}

export default function TeamSection({ lang: _lang }: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showMore, setShowMore] = useState(false);

  /* Intersection observer for staggered reveal */
  const observerRef = useRef<IntersectionObserver | null>(null);

  const initObserver = useCallback(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const index = parseInt(el.dataset.index || '0', 10);
            setTimeout(() => el.classList.add('visible'), index * 80);
            observerRef.current?.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    const members = sectionRef.current?.querySelectorAll('.team-member, .advisor-member');
    members?.forEach((m) => observerRef.current?.observe(m));
  }, []);

  useEffect(() => {
    initObserver();
    return () => {
      observerRef.current?.disconnect();
    };
  }, [initObserver]);

  /* Re-observe newly revealed cards when "Show more" is toggled */
  useEffect(() => {
    if (showMore && sectionRef.current && observerRef.current) {
      const newMembers = sectionRef.current.querySelectorAll('#team-more .team-member, #team-more .advisor-member');
      newMembers.forEach((m) => observerRef.current?.observe(m));
    }
  }, [showMore]);

  const cSuite = team.filter(m => m.dept === 'c-suite');
  const tech = team.filter(m => m.dept === 'tech');
  const buildings = team.filter(m => m.dept === 'buildings');

  return (
    <>
      <section className="team-section" id="team" ref={sectionRef}>
        <div className="team-container">

          {/* Leadership */}
          <div className="team-dept">
            <span className="team-label">LEADERSHIP</span>
            <h2 className="team-heading">The Team Behind Ancestro</h2>
            <p className="team-subheading">24 professionals across 6 departments building LATAM&apos;s energy future</p>
          </div>

          <div className="team-grid">
            {cSuite.map((member, i) => (
              <div className="team-member team-member--featured" data-index={i} key={member.name}>
                <div className="member-top">
                  <div className="member-avatar">
                    <span className="member-initials">{getInitials(member.name)}</span>
                  </div>
                  <div className="member-identity">
                    <h3 className="member-name">{member.name}</h3>
                    <span className="member-role">{member.role}</span>
                  </div>
                  <a href={member.linkedin} className="member-linkedin" aria-label={`${member.name} LinkedIn`}>
                    <LinkedInIcon />
                  </a>
                </div>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>

          {/* Technology */}
          <h3 className="section-dept-heading">
            <MonitorIcon />
            Technology &amp; Engineering
          </h3>
          <div className="team-grid">
            {tech.map((member, i) => (
              <div className="team-member" data-index={3 + i} key={member.name}>
                <div className="member-top">
                  <div className="member-avatar">
                    <span className="member-initials">{getInitials(member.name)}</span>
                  </div>
                  <div className="member-identity">
                    <h3 className="member-name">{member.name}</h3>
                    <span className="member-role">{member.role}</span>
                  </div>
                  <a href={member.linkedin} className="member-linkedin" aria-label={`${member.name} LinkedIn`}>
                    <LinkedInIcon />
                  </a>
                </div>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>

          {/* Infrastructure & Development (hidden by default) */}
          {showMore && (
            <div id="team-more" className="team-more-section">
              <h3 className="section-dept-heading">
                <HomeIcon />
                Infrastructure &amp; Development
              </h3>
              <div className="team-grid">
                {buildings.map((member, i) => (
                  <div className="team-member" data-index={7 + i} key={member.name}>
                    <div className="member-top">
                      <div className="member-avatar">
                        <span className="member-initials">{getInitials(member.name)}</span>
                      </div>
                      <div className="member-identity">
                        <h3 className="member-name">{member.name}</h3>
                        <span className="member-role">{member.role}</span>
                      </div>
                      <a href={member.linkedin} className="member-linkedin" aria-label={`${member.name} LinkedIn`}>
                        <LinkedInIcon />
                      </a>
                    </div>
                    <p className="member-bio">{member.bio}</p>
                  </div>
                ))}
              </div>

              {/* Legal & Finance */}
              <h3 className="section-dept-heading">
                <DocIcon />
                Legal &amp; Finance
              </h3>
              <div className="advisors-grid">
                {legalAndFinance.map((member, i) => (
                  <div className="advisor-member" data-index={9 + i} key={member.name}>
                    <div className="advisor-top">
                      <div className="advisor-avatar">
                        <span className="advisor-initials">{getInitials(member.name)}</span>
                      </div>
                      <div className="advisor-identity">
                        <h4 className="advisor-name">{member.name}</h4>
                        <span className="advisor-role">{member.role}</span>
                      </div>
                    </div>
                    <p className="advisor-bio">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show More Button */}
          <div className="team-show-more-wrap">
            <button
              className={`team-show-more-btn${showMore ? ' expanded' : ''}`}
              onClick={() => setShowMore(prev => !prev)}
            >
              <span>{showMore ? 'Show less' : 'Show full team'}</span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* Advisory Board */}
          <h3 className="advisors-heading">
            <LayersIcon />
            Advisory Board
          </h3>
          <div className="advisors-grid">
            {advisors.map((advisor, i) => (
              <div className="advisor-member" data-index={13 + i} key={advisor.name}>
                <div className="advisor-top">
                  <div className="advisor-avatar">
                    <span className="advisor-initials">{getInitials(advisor.name)}</span>
                  </div>
                  <div className="advisor-identity">
                    <h4 className="advisor-name">{advisor.name}</h4>
                    <span className="advisor-role">{advisor.role}</span>
                  </div>
                </div>
                <p className="advisor-bio">{advisor.bio}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <style>{`
        .team-section {
          padding: 64px 24px;
          background: var(--color-black);
          position: relative;
        }
        .team-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-white-10), transparent);
        }
        .team-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .team-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-primary);
          margin-bottom: 16px;
        }
        .team-heading {
          font-size: 2.25rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 40px;
        }
        .team-subheading {
          font-size: 1rem;
          color: var(--color-gray);
          margin: -28px 0 40px;
          line-height: 1.5;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .team-member {
          padding: 28px;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--color-white-10);
          border-radius: 16px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .team-member.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .team-member:hover {
          background: rgba(255, 255, 255, 0.025);
          border-color: rgba(248, 176, 59, 0.15);
        }
        .team-member--featured {
          border-color: rgba(248, 176, 59, 0.12);
          background: rgba(248, 176, 59, 0.02);
        }
        .team-member--featured .member-avatar {
          background: linear-gradient(135deg, rgba(248, 176, 59, 0.18), rgba(248, 176, 59, 0.06));
          border-color: rgba(248, 176, 59, 0.35);
        }
        .member-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .member-avatar {
          width: 56px;
          height: 56px;
          min-width: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(248, 176, 59, 0.1), rgba(248, 176, 59, 0.03));
          border: 1px solid rgba(248, 176, 59, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .member-initials {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-primary);
          letter-spacing: 0.02em;
        }
        .member-identity {
          flex: 1;
          min-width: 0;
        }
        .member-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-white);
          line-height: 1.3;
          margin: 0;
        }
        .member-role {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-primary);
          margin-top: 2px;
        }
        .member-linkedin {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 6px;
          color: var(--color-gray);
          transition: color 0.2s ease, background 0.2s ease;
        }
        .member-linkedin:hover {
          color: var(--color-primary);
          background: rgba(248, 176, 59, 0.1);
        }
        .member-bio {
          font-size: 0.875rem;
          color: var(--color-gray);
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .section-dept-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.01em;
          margin-top: 48px;
          margin-bottom: 24px;
        }
        .section-dept-heading svg {
          color: var(--color-primary);
          flex-shrink: 0;
        }
        .team-more-section {
          animation: teamFadeIn 0.5s ease both;
        }
        @keyframes teamFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .team-show-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }
        .team-show-more-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(248, 176, 59, 0.08);
          border: 1px solid rgba(248, 176, 59, 0.2);
          border-radius: 12px;
          padding: 12px 28px;
          color: var(--color-primary);
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .team-show-more-btn:hover {
          background: rgba(248, 176, 59, 0.14);
          border-color: rgba(248, 176, 59, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(248, 176, 59, 0.1);
        }
        .team-show-more-btn svg {
          transition: transform 0.3s ease;
        }
        .team-show-more-btn.expanded svg {
          transform: rotate(180deg);
        }
        .advisors-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.01em;
          margin-top: 48px;
          margin-bottom: 24px;
        }
        .advisors-heading svg {
          color: var(--color-primary);
          flex-shrink: 0;
        }
        .advisors-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .advisor-member {
          padding: 24px;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--color-white-10);
          border-radius: 14px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .advisor-member.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .advisor-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .advisor-avatar {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(248, 176, 59, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .advisor-initials {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          letter-spacing: 0.02em;
        }
        .advisor-identity {
          flex: 1;
          min-width: 0;
        }
        .advisor-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-white);
          line-height: 1.3;
          margin: 0;
        }
        .advisor-role {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-primary);
          margin-top: 2px;
        }
        .advisor-bio {
          font-size: 0.875rem;
          color: var(--color-gray);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive - tablet */
        @media (max-width: 900px) {
          .team-grid { grid-template-columns: repeat(2, 1fr); }
          .advisors-grid { grid-template-columns: repeat(2, 1fr); }
          .team-heading { font-size: 1.75rem; }
        }

        /* Responsive - mobile */
        @media (max-width: 600px) {
          .team-section { padding: 40px 16px; }
          .team-dept { text-align: center; }
          .team-heading { font-size: 1.375rem; margin-bottom: 20px; }
          .team-subheading { font-size: 0.875rem; margin: -12px 0 28px; }
          .team-grid { grid-template-columns: 1fr; gap: 12px; }
          .team-member { padding: 20px 16px; }
          .member-top { gap: 12px; }
          .member-avatar { width: 44px; height: 44px; min-width: 44px; border-radius: 12px; }
          .member-initials { font-size: 0.9375rem; }
          .member-name { font-size: 0.9375rem; }
          .member-role { font-size: 0.75rem; }
          .member-bio { font-size: 0.8125rem; -webkit-line-clamp: 2; }
          .member-linkedin { width: 28px; height: 28px; min-width: 28px; }
          .section-dept-heading { font-size: 1.0625rem; margin-top: 32px; margin-bottom: 16px; }
          .advisors-grid { grid-template-columns: 1fr; gap: 12px; }
          .advisor-member { padding: 18px 16px; }
          .advisor-avatar { width: 40px; height: 40px; min-width: 40px; }
          .advisor-initials { font-size: 0.8125rem; }
          .advisor-name { font-size: 0.9375rem; }
          .advisor-role { font-size: 0.75rem; }
          .advisor-bio { font-size: 0.8125rem; -webkit-line-clamp: 2; }
          .advisors-heading { font-size: 1.1875rem; margin-top: 28px; margin-bottom: 16px; }
          .team-show-more-btn { padding: 10px 24px; font-size: 0.875rem; }
        }

        /* Responsive - very small */
        @media (max-width: 380px) {
          .team-section { padding: 32px 12px; }
          .team-heading { font-size: 1.25rem; }
          .team-member { padding: 16px 12px; }
          .member-bio { font-size: 0.75rem; }
          .advisor-member { padding: 14px 12px; }
        }
      `}</style>
    </>
  );
}
