import type { Medication } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { Pill, Check } from 'lucide-react';

interface Props {
  medication: Medication;
}

export default function MedicationCard({ medication: med }: Props) {
  const { toggleMedication, t } = useApp();

  return (
    <div style={{
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: 10,
      borderLeft: `4px solid ${med.taken ? colors.success : colors.primary}`,
      opacity: med.taken ? 0.7 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Pill size={18} color={colors.primary} />
            <span style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
              {med.name}
            </span>
            {med.is_prn && (
              <span style={{
                fontSize: 11,
                backgroundColor: colors.warningBg,
                color: '#92400E',
                padding: '2px 8px',
                borderRadius: 10,
                fontWeight: 600,
              }}>
                {t('med_prn')}
              </span>
            )}
          </div>
          {med.dosage && (
            <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 2 }}>
              {med.dosage} {med.form}
            </div>
          )}
          {med.route && (
            <div style={{ fontSize: 13, color: colors.textSecondary }}>
              {t('med_route')}: {med.route}
            </div>
          )}
          {med.frequency && (
            <div style={{ fontSize: 13, color: colors.textSecondary }}>
              {t('med_frequency')}: {med.frequency}
              {med.prn_condition && ` (${med.prn_condition})`}
            </div>
          )}
          {med.instructions && (
            <div style={{ fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 }}>
              {med.instructions}
            </div>
          )}
        </div>

        <button
          onClick={() => toggleMedication(med.id)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            border: `2px solid ${med.taken ? colors.success : colors.border}`,
            backgroundColor: med.taken ? colors.success : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: 12,
          }}
          aria-label={med.taken ? t('med_taken') : t('med_mark_taken')}
        >
          {med.taken && <Check size={22} color="#fff" strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
}
