import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import PageContainer from '../components/layout/PageContainer';
import MedicationCard from '../components/cards/MedicationCard';
import AppointmentCard from '../components/cards/AppointmentCard';
import { Pill, Calendar } from 'lucide-react';

export default function ComingUp() {
  const { t, medications, appointments } = useApp();

  const pendingMeds = medications.filter(m => !m.taken);
  const upcomingAppts = appointments.filter(a => !a.is_past);

  return (
    <PageContainer title={t('btn_coming_up')}>
      {/* Medications to take */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Pill size={18} color={colors.primary} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
            {t('medications_title')} ({pendingMeds.length})
          </h3>
        </div>
        {pendingMeds.length > 0 ? (
          pendingMeds.map(med => <MedicationCard key={med.id} medication={med} />)
        ) : (
          <div style={{
            backgroundColor: colors.successBg,
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            color: colors.success,
            fontSize: 14,
            fontWeight: 600,
          }}>
            All medications taken!
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Calendar size={18} color={colors.primary} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
            {t('appointments_title')} ({upcomingAppts.length})
          </h3>
        </div>
        {upcomingAppts.length > 0 ? (
          upcomingAppts.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)
        ) : (
          <div style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            color: colors.textSecondary,
            fontSize: 14,
          }}>
            {t('appointments_none')}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
