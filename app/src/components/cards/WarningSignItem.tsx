import type { WarningItem } from '../../types';
import { colors } from '../../constants/colors';
import { AlertTriangle, Phone, Eye } from 'lucide-react';

const severityConfig = {
  red: { bg: colors.dangerBg, border: colors.danger, icon: AlertTriangle },
  yellow: { bg: colors.warningBg, border: colors.warning, icon: Phone },
  green: { bg: colors.successBg, border: colors.success, icon: Eye },
};

interface Props {
  item: WarningItem;
}

export default function WarningSignItemCard({ item }: Props) {
  const config = severityConfig[item.severity];
  const Icon = config.icon;

  return (
    <div style={{
      backgroundColor: config.bg,
      borderLeft: `4px solid ${config.border}`,
      borderRadius: 8,
      padding: '12px 14px',
      marginBottom: 8,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
    }}>
      <Icon size={20} color={config.border} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 2 }}>
          {item.symptom}
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary }}>
          {item.action}
        </div>
      </div>
    </div>
  );
}
