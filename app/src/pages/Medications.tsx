import { useApp } from '../context/AppContext';
import PageContainer from '../components/layout/PageContainer';
import MedicationCard from '../components/cards/MedicationCard';
import { colors } from '../constants/colors';

export default function Medications() {
  const { t, medications } = useApp();

  const homeMeds = medications.filter(m => !m.is_new);
  const newMeds = medications.filter(m => m.is_new);

  return (
    <PageContainer title={t('medications_title')}>
      {homeMeds.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: '0 0 10px' }}>
            {t('medications_home')}
          </h3>
          {homeMeds.map(med => (
            <MedicationCard key={med.id} medication={med} />
          ))}
        </>
      )}

      <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: '20px 0 10px' }}>
        {t('medications_new')}
      </h3>
      {newMeds.length > 0 ? (
        newMeds.map(med => (
          <MedicationCard key={med.id} medication={med} />
        ))
      ) : (
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          color: colors.textSecondary,
          fontSize: 14,
        }}>
          {t('medications_none_new')}
        </div>
      )}
    </PageContainer>
  );
}
