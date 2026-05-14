'use client';
import { useEffect, useState } from 'react';
import { t } from '@/i18n/translations';
import { api } from '@/lib/api-client';
import { Ic, Skeleton } from '@/components/dashboard/shared';
import { demoAdminUsers } from '@/lib/demoData';

interface UserRow {
  id: number;
  cognito_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'client' | 'installer' | 'investor' | 'admin' | string;
  created_at: string;
}

type Filter = 'users' | 'customers' | 'epcs' | 'investors';

const FILTER_TO_ROLE: Record<Filter, string | null> = {
  users:     null,
  customers: 'client',
  epcs:      'installer',
  investors: 'investor',
};

export function AdminUsersTable({ lang, filter }: { lang: string; filter: Filter }) {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const role = FILTER_TO_ROLE[filter];
    const url = `/api/users?limit=100${role ? `&role=${role}` : ''}`;
    api<UserRow[]>(url, { signal: controller.signal })
      .then((real) => {
        const list = (!real || real.length === 0) ? (demoAdminUsers as unknown as UserRow[]) : real;
        const filtered = role ? list.filter(u => u.role === role) : list;
        setRows(filtered);
      })
      .catch(() => {
        const filtered = role ? demoAdminUsers.filter(u => u.role === role) : demoAdminUsers;
        setRows(filtered as unknown as UserRow[]);
      });
    return () => controller.abort();
  }, [filter]);

  const filtered = (rows ?? []).filter(r => {
    if (!q.trim()) return true;
    const k = q.toLowerCase();
    return (r.email || '').toLowerCase().includes(k)
        || (r.full_name || '').toLowerCase().includes(k);
  });

  return (
    <>
      <div className="dash-header dash-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>
            {t(lang, `sidebar.adm.${filter}`).toUpperCase()}
          </span>
          <h1 style={{ color: '#F5F3FF', fontSize: 28, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
            {t(lang, `admin.${filter}.title`)}
          </h1>
          <span style={{ color: '#5E6673', fontSize: 13 }}>
            {rows == null ? '—' : `${filtered.length} ${t(lang, 'admin.users.total')}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 10 }}>
            <Ic n="search" s={14} c="#5E6673" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t(lang, 'admin.users.search')}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#F5F3FF', fontSize: 13, fontFamily: 'inherit', width: 220,
              }}
            />
          </div>
          <button className="dash-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 10, color: '#A1A1AA', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
            <Ic n="download" s={14} /> {t(lang, 'admin.users.export')}
          </button>
        </div>
      </div>

      <div className="dash-card dash-fade-1" style={{ display: 'flex', flexDirection: 'column', background: '#0E0E10', border: '1px solid #1A1A1A', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 80px', gap: 12, padding: '14px 20px', borderBottom: '1px solid #1A1A1A', color: '#5E6673', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          <span>{t(lang, 'admin.users.col.user')}</span>
          <span>{t(lang, 'admin.users.col.email')}</span>
          <span>{t(lang, 'admin.users.col.role')}</span>
          <span>{t(lang, 'admin.users.col.created')}</span>
          <span style={{ textAlign: 'right' }}>{t(lang, 'admin.users.col.actions')}</span>
        </div>

        {rows == null && (
          <div style={{ padding: 20 }}>
            <Skeleton h={48} style={{ marginBottom: 8 }} />
            <Skeleton h={48} style={{ marginBottom: 8 }} />
            <Skeleton h={48} />
          </div>
        )}
        {rows != null && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#5E6673', fontSize: 13 }}>
            {t(lang, 'admin.users.empty')}
          </div>
        )}
        {filtered.map((u, i) => (
          <div key={u.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 120px 120px 80px', gap: 12,
            padding: '14px 20px', alignItems: 'center',
            borderBottom: i < filtered.length - 1 ? '1px solid #0A0A0A' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: roleColor(u.role) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColor(u.role), fontSize: 13, fontWeight: 800 }}>
                {(u.full_name || u.email || '?')[0].toUpperCase()}
              </div>
              <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.full_name || '—'}
              </span>
            </div>
            <span style={{ color: '#848E9C', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start', padding: '2px 8px', borderRadius: 6,
              background: roleColor(u.role) + '18', color: roleColor(u.role),
              fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            }}>
              {u.role}
            </span>
            <span style={{ color: '#5E6673', fontSize: 12 }}>
              {new Date(u.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <button className="dash-btn" title={t(lang, 'admin.users.action.edit')} style={iconBtn}>
                <Ic n="edit" s={14} c="#A1A1AA" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  background: '#0A0A0A', border: '1px solid #1A1A1A',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

function roleColor(role: string): string {
  switch (role) {
    case 'admin':     return '#F59E0B';
    case 'installer': return '#A78BFA';
    case 'investor':  return '#02C076';
    case 'client':    return '#FBBF24';
    default:          return '#848E9C';
  }
}
