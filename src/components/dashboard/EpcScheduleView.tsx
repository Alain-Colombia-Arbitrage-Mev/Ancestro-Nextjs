'use client';
import { useState, useEffect } from 'react';
import { t } from '@/i18n/translations';
import { api } from '@/lib/api-client';
import { Ic, btnP, calBtn } from './shared';
import { demoEpcSchedule } from '@/lib/demoData';

interface EpcEvent { day: number; top: number; h: number; color: string; title: string; name: string; sub: string; addr?: string; payout?: string; hl?: boolean }
interface EpcScheduleData {
  week_start: string | null;
  events: EpcEvent[];
  stats: { scheduled: number; completed: number; next_time: string | null; potential_usd: number };
}

export default function EpcScheduleView({ lang }: { lang: string }) {
  const [data, setData] = useState<EpcScheduleData | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    api<EpcScheduleData>('/api/dashboard/epc/schedule', { signal: controller.signal })
      .then((d) => {
        const empty = !d || (d.events?.length ?? 0) === 0;
        setData(empty ? (demoEpcSchedule as unknown as EpcScheduleData) : d);
      })
      .catch(() => setData(demoEpcSchedule as unknown as EpcScheduleData));
    return () => controller.abort();
  }, []);
  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN']; const today = 1;
  const s = data?.stats;
  const stats = [
    { icon: 'calendar' as const, label: t(lang, 'epc.schedule.thisWeek'), value: String(s?.scheduled ?? 0), sub: t(lang, 'epc.schedule.scheduled'), bg: '#FBBF2420' },
    { icon: 'check' as const,    label: t(lang, 'epc.schedule.completed'), value: String(s?.completed ?? 0), sub: t(lang, 'epc.schedule.soFar'), bg: '#A78BFA20' },
    { icon: 'clock' as const,    label: t(lang, 'epc.schedule.nextUp'),    value: s?.next_time || '—',     sub: t(lang, 'epc.schedule.today'), bg: '#10B98120' },
    { icon: 'dollar-sign' as const, label: t(lang, 'epc.schedule.potential'), value: `$${Math.round(s?.potential_usd ?? 0).toLocaleString('en-US')}`, sub: t(lang, 'epc.schedule.ifAllComplete'), bg: '#F59E0B18', hl: true },
  ];
  const events: EpcEvent[] = data?.events ?? [];
  const hourLabels = ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'];

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#848E9C', fontSize: 13 }}>{t(lang, 'epc.schedule.week')}</span>
          <span style={{ color: '#EAECEF', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{t(lang, 'epc.schedule.title')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px', height: 36, borderRadius: 9, background: '#0A0A0A', border: '1px solid #1A1A1A' }}>
            <button style={calBtn} className="dash-btn">&lt;</button>
            <button style={{ ...calBtn, background: '#1A1A1A', color: '#fff' }} className="dash-btn">{t(lang, 'epc.schedule.weekView')}</button>
            <button style={calBtn} className="dash-btn">{t(lang, 'epc.schedule.monthView')}</button>
            <button style={calBtn} className="dash-btn">&gt;</button>
          </div>
          <button style={btnP} className="dash-btn"><Ic n="plus" s={16} />{t(lang, 'epc.schedule.addJob')}</button>
        </div>
      </div>

      <div className="dash-grid-4col dash-fade-1">
        {stats.map((st, i) => (
          <div key={i} className={`dash-card ${st.hl ? 'dash-card-strong' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', height: 90, borderRadius: 14, border: st.hl ? '1.5px solid #F59E0B40' : '1px solid #1A1A1A', background: st.hl ? 'linear-gradient(135deg, #FBBF2425, #F59E0B12)' : '#0A0A0A' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n={st.icon} s={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#EAECEF', fontSize: 20, fontWeight: 800 }}>{st.value}</span>
              <span style={{ color: '#5E6673', fontSize: 11 }}>{st.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-card dash-fade-2" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #FFFFFF08, #FFFFFF03)', borderRadius: 18, border: '1px solid #1A1A1A', position: 'relative', overflow: 'hidden', minHeight: 480 }}>
        <div style={{ padding: '22px 24px 0' }}>
          <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>WEEK CALENDAR</span>
        </div>
        <div style={{ height: 1, background: '#1A1A1A', margin: '14px 0 0' }} />
        <div style={{ display: 'flex', height: 42, borderBottom: '1px solid #1A1A1A' }}>
          {days.map((d, i) => (
            <div key={i} style={{ flex: i === 6 ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === today ? '#F59E0B' : i === 6 ? '#3F3F46' : '#848E9C', fontSize: 11, fontWeight: i === today ? 800 : 700, letterSpacing: 1, borderRight: i < 6 ? '1px solid #0A0A0A' : 'none' }}>
              {d}{i === today ? ' · TODAY' : ''}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
          <div style={{ width: 80, display: 'flex', flexDirection: 'column', borderRight: '1px solid #0A0A0A' }}>
            {hourLabels.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '4px 12px 0 0' }}>
                <span style={{ color: '#5E6673', fontSize: 10, fontWeight: 600 }}>{h}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
            {events.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E6673', fontSize: 13 }}>
                {t(lang, 'dashboard.affiliate.empty')}
              </div>
            )}
            {days.map((_, di) => (
              <div key={di} style={{ flex: di === 6 ? 0.7 : 1, position: 'relative', borderRight: di < 6 ? '1px solid #0A0A0A' : 'none' }}>
                {hourLabels.map((_, hi) => (
                  <div key={hi} style={{ height: `${100 / hourLabels.length}%`, borderTop: hi > 0 ? '1px solid #FFFFFF05' : 'none' }} />
                ))}
                {events.filter(e => e.day === di).map((ev, ei) => (
                  <div key={ei} style={{ position: 'absolute', left: 2, right: 2, top: `${ev.top / 5.4}%`, height: `${ev.h / 5.4}%`, background: ev.color, borderRadius: 10, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 1, boxShadow: ev.hl ? '0 6px 24px rgba(245,158,11,0.5)' : '0 4px 16px rgba(0,0,0,0.3)', overflow: 'hidden', zIndex: ev.hl ? 2 : 1 }}>
                    <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 800, fontSize: ev.h > 100 ? 10 : 9 }}>{ev.title}</span>
                    {ev.h > 80 && <>
                      <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 800, fontSize: 11 }}>{ev.name}</span>
                      <span style={{ color: ev.color === '#F59E0B' ? '#0A061799' : '#ffffffCC', fontWeight: 600, fontSize: 10 }}>{ev.sub}</span>
                      {ev.addr && <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 700, fontSize: 9 }}>{ev.addr}</span>}
                      {ev.payout && <span style={{ color: ev.color === '#F59E0B' ? '#0A0617' : '#fff', fontWeight: 800, fontSize: 10 }}>{ev.payout}</span>}
                    </>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
