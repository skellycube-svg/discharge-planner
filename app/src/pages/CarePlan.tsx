import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import PageContainer from '../components/layout/PageContainer';
import ChecklistItemCard from '../components/cards/ChecklistItemCard';

export default function CarePlan() {
  const { t, selectedPatient, checklist } = useApp();
  const [tab, setTab] = useState<'summary' | 'checklist'>('summary');

  if (!selectedPatient) return null;
  const p = selectedPatient;

  const completedCount = checklist.filter(i => i.completed).length;
  const progressPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const tabs = [
    { key: 'summary' as const, label: t('discharge_summary') },
    { key: 'checklist' as const, label: t('recovery_checklist') },
  ];

  return (
    <PageContainer title={t('care_plan_title')}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map(tb => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: tab === tb.key ? colors.primary : colors.surface,
              color: tab === tb.key ? '#fff' : colors.textSecondary,
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              minHeight: 44,
            }}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'summary' && (
        <div style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <InfoRow label={t('patient_name')} value={p.patient_name} />
          <InfoRow label="MRN" value={p.mrn} />
          <InfoRow label={t('patient_diagnosis')} value={p.discharge_diagnosis} />
          <InfoRow label={t('patient_admitted')} value={p.admission_date} />
          <InfoRow label={t('patient_discharged')} value={p.discharge_date} />
          <InfoRow label={t('patient_condition')} value={p.condition_on_discharge} />
          <InfoRow label={t('patient_doctor')} value={p.primary_care_physician} />
          <InfoRow label={t('patient_consulting')} value={p.consulting_physicians} />
          <InfoRow label={t('patient_allergies')} value={p.allergies === 'NKA' ? t('no_known_allergies') : p.allergies} />
          <InfoRow label={t('patient_diet')} value={p.diet} />

          {p.procedures && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary, marginBottom: 6 }}>
                {t('patient_procedures')}
              </div>
              {p.procedures.split('; ').map((proc, i) => (
                <div key={i} style={{ fontSize: 14, color: colors.textPrimary, padding: '4px 0', borderBottom: `1px solid ${colors.border}` }}>
                  {proc}
                </div>
              ))}
            </div>
          )}

          {p.special_instructions && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary, marginBottom: 6 }}>
                {t('patient_instructions')}
              </div>
              {p.special_instructions.split('. ').filter(Boolean).map((inst, i) => (
                <div key={i} style={{
                  fontSize: 14,
                  color: colors.textPrimary,
                  padding: '8px 12px',
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  marginBottom: 6,
                  lineHeight: 1.4,
                }}>
                  {inst.trim().replace(/\.$/, '')}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'checklist' && (
        <>
          <div style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{t('dashboard_progress')}</span>
              <span style={{ fontSize: 14, color: colors.textSecondary }}>{progressPct}%</span>
            </div>
            <div style={{
              width: '100%',
              height: 8,
              backgroundColor: colors.background,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progressPct}%`,
                height: '100%',
                backgroundColor: colors.success,
                borderRadius: 4,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          {checklist.map(item => (
            <ChecklistItemCard key={item.id} item={item} />
          ))}
        </>
      )}
    </PageContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
      <span style={{ width: 130, fontSize: 13, fontWeight: 600, color: colors.textSecondary, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: colors.textPrimary }}>
        {value}
      </span>
    </div>
  );
}
