import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import PageContainer from '../components/layout/PageContainer';

export default function Settings() {
  const { t, language, setLanguage, patients, selectedPatient, selectPatient } = useApp();

  return (
    <PageContainer title={t('settings_title')}>
      {/* Language */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px' }}>{t('settings_language')}</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['en', 'es'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 10,
                border: `2px solid ${language === lang ? colors.primary : colors.border}`,
                backgroundColor: language === lang ? colors.primaryLight : 'transparent',
                color: language === lang ? colors.primary : colors.textSecondary,
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              {lang === 'en' ? 'English' : 'Español'}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Selector */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px' }}>{t('settings_patient')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {patients.map(p => (
            <button
              key={p.patient_id}
              onClick={() => selectPatient(p.patient_id)}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `2px solid ${selectedPatient?.patient_id === p.patient_id ? colors.primary : colors.border}`,
                backgroundColor: selectedPatient?.patient_id === p.patient_id ? colors.primaryLight : 'transparent',
                color: selectedPatient?.patient_id === p.patient_id ? colors.primary : colors.textPrimary,
                fontWeight: selectedPatient?.patient_id === p.patient_id ? 700 : 400,
                fontSize: 14,
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: 44,
              }}
            >
              {p.patient_name} — {p.discharge_diagnosis}
              <span style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                {p.preferred_language} &middot; Discharged {p.discharge_date}
              </span>
            </button>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
