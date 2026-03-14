export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

interface KycStatusBadgeProps {
  status: KycStatus;
  lang: string;
}

const labels: Record<string, Record<KycStatus, string>> = {
  es: { not_started: 'Sin verificar', pending: 'En proceso', verified: 'Verificado', rejected: 'Rechazado' },
  en: { not_started: 'Not verified', pending: 'In progress', verified: 'Verified', rejected: 'Rejected' },
  pt: { not_started: 'Nao verificado', pending: 'Em processo', verified: 'Verificado', rejected: 'Rejeitado' },
  zh: { not_started: '未验证', pending: '处理中', verified: '已验证', rejected: '已拒绝' },
  ar: { not_started: 'غير محقق', pending: 'قيد التنفيذ', verified: 'تم التحقق', rejected: 'مرفوض' },
};

const icons: Record<KycStatus, string> = {
  not_started: '🔒',
  pending: '⏳',
  verified: '✅',
  rejected: '❌',
};

const colors: Record<KycStatus, string> = {
  not_started: 'rgba(248,176,59,0.15)',
  pending: 'rgba(234,179,8,0.15)',
  verified: 'rgba(34,197,94,0.15)',
  rejected: 'rgba(239,68,68,0.15)',
};

const textColors: Record<KycStatus, string> = {
  not_started: '#f8b03b',
  pending: '#eab308',
  verified: '#22c55e',
  rejected: '#ef4444',
};

export default function KycStatusBadge({ status, lang }: KycStatusBadgeProps) {
  const l = labels[lang] || labels.en;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      background: colors[status],
      color: textColors[status],
    }}>
      {icons[status]} {l[status]}
    </span>
  );
}
