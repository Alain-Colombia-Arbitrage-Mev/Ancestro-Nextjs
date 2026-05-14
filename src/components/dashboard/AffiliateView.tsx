'use client';
import { useState, useEffect } from 'react';
import { t } from '@/i18n/translations';
import { api } from '@/lib/api-client';
import { Ic, Card, StatCard, btnP, btnG, glassBg, goldGrad, fmtMoney } from './shared';
import { UserMenu } from './UserMenu';
import { useDashboardData } from './DashboardDataProvider';
import { demoTopAffiliates, demoMyAffiliateRank } from '@/lib/demoData';

type Tab = 'overview' | 'referrals' | 'earnings' | 'reports';

interface TopAffiliate { rank: number; name: string; refs: number }

export default function AffiliateView({ lang, user }: { lang: string; user: { name: string; email: string; id?: string } }) {
  const [copied, setCopied] = useState(false);
  const { refUrl, stats } = useDashboardData();
  const [top, setTop] = useState<TopAffiliate[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const firstName = (user.name || user.email).split(/\s+|@/)[0];

  // Only the affiliate-specific extras are fetched here; refCode + stats come from the shared provider.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const [topRes, lbRes] = await Promise.all([
          api<{ rows: TopAffiliate[] }>('/api/dashboard/affiliate/top', { signal: controller.signal }).catch(() => ({ rows: [] })),
          api<{ rows: Array<{ rank: number; isYou?: boolean }> }>('/api/referrals/leaderboard?limit=100', { signal: controller.signal }).catch(() => ({ rows: [] })),
        ]);
        const realTop = topRes.rows || [];
        setTop(realTop.length > 0 ? realTop : demoTopAffiliates);
        const me = (lbRes.rows || []).find(r => r.isYou);
        setMyRank(me?.rank ?? demoMyAffiliateRank);
      } catch (e) {
        if ((e as { name?: string })?.name !== 'AbortError') {
          console.warn('[Dashboard.Affiliate] fetch failed', e);
        }
      }
    })();
    return () => controller.abort();
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: t(lang, 'dashboard.tabs.overview') },
    { id: 'referrals', label: t(lang, 'dashboard.tabs.referrals') },
    { id: 'earnings', label: t(lang, 'dashboard.tabs.earnings') },
    { id: 'reports', label: t(lang, 'dashboard.tabs.reports') },
  ];

  function doCopy() {
    if (!refUrl) return;
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13, fontWeight: 500 }}>{t(lang, 'dashboard.affiliate.welcome')}</span>
          <h1 style={{ color: '#F5F3FF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
            {firstName} <span style={{ color: '#FBBF24' }}>👋</span>
          </h1>
          <span style={{ color: '#5E6673', fontSize: 13 }}>{t(lang, 'dashboard.affiliate.subtitleNew')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 22, color: '#5E6673', fontSize: 13 }}>
            <Ic n="link" s={14} c="#5E6673" />
            <span>{t(lang, 'dashboard.search')}</span>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#0A0A0A', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Ic n="bell" s={18} c="#A1A1AA" />
            <span style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, background: '#F59E0B' }} />
          </div>
          <UserMenu lang={lang} />
        </div>
      </div>

      <div className="dash-header dash-fade-1" style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 40, padding: '0 4px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10 }}>
          {tabs.map(tt => (
            <button key={tt.id} onClick={() => setTab(tt.id)} className="dash-btn" style={{
              height: 32, padding: '0 16px', borderRadius: 8, border: 'none', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: tab === tt.id ? '#F59E0B' : 'transparent',
              color: tab === tt.id ? '#0A0617' : '#848E9C',
            }}>{tt.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="dash-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10, color: '#A1A1AA', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
            <Ic n="calendar" s={14} c="#A1A1AA" /> {t(lang, 'dashboard.range')}
            <Ic n="chevron-down" s={12} c="#5E6673" />
          </button>
          <button className="dash-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 10, color: '#A1A1AA', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
            <Ic n="arrow-right" s={14} c="#A1A1AA" /> {t(lang, 'dashboard.export')}
          </button>
          <button onClick={doCopy} className="dash-btn" style={{ ...btnP, height: 40 }}>
            <Ic n="copy" s={14} /> {copied ? t(lang, 'dashboard.affiliate.copied') : t(lang, 'dashboard.affiliate.showLink')}
          </button>
        </div>
      </div>

      <div className="dash-grid-4col dash-fade-2">
        <StatCard icon="link" label={t(lang, 'dashboard.affiliate.clicks')} value={(stats?.clicks ?? 0).toLocaleString('en-US')} sub={t(lang, 'dashboard.affiliate.clicksSub')} />
        <StatCard icon="users" label={t(lang, 'dashboard.affiliate.signups')} value={(stats?.signups ?? 0).toLocaleString('en-US')} sub={`${(stats?.conversion ?? 0)}% ${t(lang, 'dashboard.affiliate.conversion').toLowerCase()}`} />
        <StatCard icon="star" label={t(lang, 'dashboard.affiliate.salesShort')} value={(stats?.recent?.filter(r => r.status === 'paid').length ?? 0).toLocaleString('en-US')} sub={t(lang, 'dashboard.affiliate.closed')} />
        <StatCard icon="dollar-sign" label={t(lang, 'dashboard.affiliate.totalEarnings')} value={fmtMoney(stats?.commission_total ?? 0)} sub={t(lang, 'dashboard.affiliate.commissionsSub')} tone="gold" />
      </div>

      <div className="dash-fade-3 dash-stack-1080" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) minmax(0, 1fr) minmax(220px, 260px)', gap: 16 }}>
        <Card glass style={{ gap: 16 }} >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'dashboard.affiliate.linkLabel').toUpperCase()}</span>
            <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 700 }}>{t(lang, 'dashboard.affiliate.share')}</span>
            <span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'dashboard.affiliate.shareSub')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 54, background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 12 }}>
            <Ic n="link" s={16} c="#F59E0B" />
            <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{refUrl || '...'}</span>
            <button disabled={!refUrl} onClick={doCopy} style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: refUrl ? 'pointer' : 'default', padding: 4, display: 'flex' }}>
              <Ic n="copy" s={16} c="#A1A1AA" />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={doCopy} disabled={!refUrl} style={{ ...btnP, flex: 1, height: 48, justifyContent: 'center', opacity: refUrl ? 1 : 0.5 }}>
              <Ic n="copy" s={14} /> {copied ? t(lang, 'dashboard.affiliate.copied') : t(lang, 'dashboard.affiliate.copyLink')}
            </button>
            <button style={{ flex: 1, height: 48, background: '#0A0A0A', border: '1.5px solid #02C07680', borderRadius: 12, color: '#02C076', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Ic n="arrow-right" s={14} /> {t(lang, 'dashboard.affiliate.shareBtn')}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#848E9C', fontSize: 12 }}>
            <Ic n="shield-check" s={14} c="#5E6673" /> {t(lang, 'dashboard.affiliate.activeIn')}
          </div>
        </Card>

        <Card glass style={{ gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{t(lang, 'dashboard.affiliate.perf')}</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 700 }}>{t(lang, 'dashboard.affiliate.conversionsVsClicks')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 32, background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 8 }}>
              <span style={{ color: '#F5F3FF', fontSize: 12, fontWeight: 600 }}>{t(lang, 'dashboard.affiliate.last30')}</span>
              <Ic n="chevron-down" s={12} c="#A1A1AA" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, paddingLeft: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#848E9C', fontSize: 12 }}>
              <span style={{ width: 14, height: 3, background: '#F59E0B', borderRadius: 2 }} /> {t(lang, 'dashboard.affiliate.conversionsLegend')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#848E9C', fontSize: 12 }}>
              <span style={{ width: 14, height: 3, background: '#02C076', borderRadius: 2 }} /> {t(lang, 'dashboard.affiliate.clicks')}
            </span>
          </div>
          <SparkChart clicks={stats?.clicks ?? 0} signups={stats?.signups ?? 0} />
        </Card>

        <Card glass style={{ gap: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>{t(lang, 'dashboard.affiliate.topAffiliates')}</span>
            <a href={`/${lang}/leaderboard`} style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{t(lang, 'dashboard.affiliate.viewAll')}</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {top.length === 0 && (
              <div style={{ padding: 16, color: '#5E6673', fontSize: 12, textAlign: 'center' }}>
                {t(lang, 'dashboard.affiliate.empty')}
              </div>
            )}
            {top.map((row) => (
              <div key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8 }}>
                <span style={{ color: '#5E6673', fontSize: 12, fontWeight: 700, width: 18 }}>#{row.rank}</span>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: '#FBBF2420', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', fontSize: 11, fontWeight: 800 }}>{(row.name || '?')[0].toUpperCase()}</div>
                <span style={{ color: '#F5F3FF', fontSize: 12, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                <span style={{ color: '#A1A1AA', fontSize: 11, fontWeight: 700 }}>{row.refs}</span>
              </div>
            ))}
            {myRank !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, background: '#F59E0B18', border: '1px solid #F59E0B40' }}>
                <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 800, width: 18 }}>#{myRank}</span>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: goldGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0617', fontSize: 11, fontWeight: 800 }}>{firstName[0]?.toUpperCase()}</div>
                <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, flex: 1 }}>{t(lang, 'dashboard.affiliate.you')}</span>
                <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800 }}>{stats?.signups ?? 0}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="dash-fade-4 dash-stack-1080" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 264px) minmax(220px, 240px)', gap: 16, alignItems: 'stretch' }}>
        <Card style={{ gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#F5F3FF', fontSize: 16, fontWeight: 800 }}>{t(lang, 'dashboard.affiliate.earningsBreakdown')}</span>
              <span style={{ color: '#5E6673', fontSize: 12 }}>{t(lang, 'dashboard.affiliate.lifetime')}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 96, padding: '0 18px', background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.pending').toUpperCase()}</span>
                <span style={{ color: '#F5F3FF', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>{fmtMoney(stats?.commission_pending ?? 0)}</span>
              </div>
              <Ic n="clock" s={28} c="#F59E0B" />
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 96, padding: '0 18px', background: '#0A0A0A', border: '1px solid #02C07640', borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#02C076', fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.paid').toUpperCase()}</span>
                <span style={{ color: '#F5F3FF', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>{fmtMoney(stats?.commission_paid ?? 0)}</span>
              </div>
              <Ic n="check" s={28} c="#02C076" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#5E6673', fontSize: 11 }}>{t(lang, 'dashboard.affiliate.avg')}</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{fmtMoney((stats?.commission_total ?? 0) / Math.max(stats?.signups ?? 1, 1))}</span>
            </div>
            <button style={{ ...btnG, height: 40 }}>{t(lang, 'dashboard.affiliate.requestPayout')}</button>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: 'linear-gradient(135deg, #10B98115 0%, #10B98105 100%)', border: '1px solid #02C07640', borderRadius: 18 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#02C076', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>
              <Ic n="calendar" s={14} c="#02C076" /> {t(lang, 'dashboard.affiliate.nextPayout').toUpperCase()}
            </span>
            <span style={{ color: '#F5F3FF', fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>—</span>
            <span style={{ color: '#848E9C', fontSize: 12 }}>{t(lang, 'dashboard.affiliate.payoutSub')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>
              <Ic n="credit-card" s={14} c="#A78BFA" /> {t(lang, 'dashboard.affiliate.payoutMethod').toUpperCase()}
            </span>
            <span style={{ color: '#F5F3FF', fontSize: 16, fontWeight: 600 }}>{t(lang, 'dashboard.affiliate.addPayout') || 'Add payout method'}</span>
            <span style={{ color: '#848E9C', fontSize: 12 }}>{t(lang, 'dashboard.affiliate.wireUsd')}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 18, background: glassBg, border: '1px solid #1A1A1A', borderRadius: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.rank').toUpperCase()}</span>
                <span style={{ color: '#F5F3FF', fontSize: 20, fontWeight: 800 }}>{myRank ? `#${myRank}` : '—'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, background: 'linear-gradient(135deg, #FBBF2425 0%, #F59E0B15 100%)', border: '1.5px solid #F59E0B60', borderRadius: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ color: '#F59E0B', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>{t(lang, 'dashboard.affiliate.tier').toUpperCase()}</span>
              <span style={{ color: '#F5F3FF', fontSize: 18, fontWeight: 800 }}>{stats?.tier ?? 'Bronze'}</span>
            </div>
          </div>
        </div>
      </div>

      <Card style={{ background: glassBg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#F5F3FF', fontSize: 16, fontWeight: 800 }}>{t(lang, 'dashboard.affiliate.referrals')}</span>
          <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t(lang, 'dashboard.affiliate.viewAll')}</span>
        </div>
        <div style={{ height: 1, background: '#1A1A1A' }} />
        {(stats?.recent ?? []).length === 0 && (
          <div style={{ padding: 24, color: '#5E6673', fontSize: 13, textAlign: 'center' }}>{t(lang, 'dashboard.affiliate.empty')}</div>
        )}
        {(stats?.recent ?? []).map((r, i, arr) => {
          const date = new Date(r.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' });
          const initial = (r.email || '?')[0].toUpperCase();
          const statusColor = r.status === 'paid' ? '#02C076' : r.status === 'pending' ? '#F59E0B' : '#848E9C';
          return (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 8px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: '#FBBF2420', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', fontSize: 13, fontWeight: 800 }}>{initial}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 600 }}>{r.email}</span>
                  <span style={{ color: '#5E6673', fontSize: 11 }}>{date} · <span style={{ color: statusColor }}>{r.status}</span></span>
                </div>
                <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 800, width: 100, textAlign: 'right' }}>{fmtMoney(r.commission)}</span>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: '#0A0A0A' }} />}
            </div>
          );
        })}
      </Card>
    </>
  );
}

function SparkChart({ clicks, signups }: { clicks: number; signups: number }) {
  const N = 14, W = 480, H = 160;
  const seedA = clicks || 100;
  const seedB = signups || 25;
  const pts = (seed: number) => Array.from({ length: N }, (_, i) => {
    const ti = i / (N - 1);
    const wave = Math.sin(i * 1.1 + seed * 0.001) * 0.18 + 0.55 + ti * 0.35;
    return Math.max(0.05, Math.min(0.95, wave + (Math.sin(i * 2.3) * 0.05)));
  });
  const a = pts(seedA), b = pts(seedB);
  const toPath = (arr: number[]) => arr.map((v, i) => {
    const x = (i / (N - 1)) * W;
    const y = H - v * H;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div style={{ width: '100%', height: 160, position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} style={{ display: 'block' }}>
        {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
          <line key={i} x1={0} x2={W} y1={H * p} y2={H * p} stroke="#FFFFFF08" strokeWidth={1} />
        ))}
        <path d={toPath(b)} stroke="#02C076" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={toPath(a)} stroke="#F59E0B" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={W} cy={H - a[N - 1] * H} r={6} fill="#F59E0B" stroke="#0A0A0A" strokeWidth={2} />
      </svg>
    </div>
  );
}
