import { useApp } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { User, AlertCircle } from 'lucide-react';

export default function PatientCard() {
  const { selectedPatient: p, t } = useApp();
  if (!p) return null;

  const allergyDisplay = p.allergies === 'NKA' ? t('no_known_allergies') : p.allergies;

  return (
    <div style={{
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primaryLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <User size={24} color={colors.primary} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>
            {p.patient_name}
          </div>
          <div style={{ fontSize: 13, color: colors.textSecondary }}>
            MRN: {p.mrn} &middot; {p.weight_kg} kg
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        fontSize: 13,
      }}>
        <div>
          <span style={{ color: colors.textSecondary }}>{t('patient_diagnosis')}: </span>
          <span style={{ fontWeight: 600 }}>{p.discharge_diagnosis}</span>
        </div>
        <div>
          <span style={{ color: colors.textSecondary }}>{t('patient_discharged')}: </span>
          <span style={{ fontWeight: 600 }}>{p.discharge_date}</span>
        </div>
        <div>
          <span style={{ color: colors.textSecondary }}>{t('patient_condition')}: </span>
          <span style={{ fontWeight: 600 }}>{p.condition_on_discharge}</span>
        </div>
        <div>
          <span style={{ color: colors.textSecondary }}>{t('patient_doctor')}: </span>
          <span style={{ fontWeight: 600 }}>{p.primary_care_physician}</span>
        </div>
      </div>

      {p.allergies !== 'NKA' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 10,
          padding: '6px 10px',
          backgroundColor: colors.dangerBg,
          borderRadius: 8,
          color: colors.danger,
          fontSize: 13,
          fontWeight: 600,
        }}>
          <AlertCircle size={16} />
          {t('patient_allergies')}: {allergyDisplay}
        </div>
      )}
    </div>
  );
}
