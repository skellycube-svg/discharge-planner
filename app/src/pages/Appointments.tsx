import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import PageContainer from '../components/layout/PageContainer';
import AppointmentCard from '../components/cards/AppointmentCard';

export default function Appointments() {
  const { t, appointments } = useApp();

  const upcoming = appointments.filter(a => !a.is_past);
  const past = appointments.filter(a => a.is_past);

  return (
    <PageContainer title={t('appointments_title')}>
      {appointments.length === 0 ? (
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
          color: colors.textSecondary,
          fontSize: 15,
        }}>
          {t('appointments_none')}
        </div>
      ) : (
        <>
          {upcoming.map(appt => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
          {past.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, color: colors.textSecondary, margin: '20px 0 10px' }}>
                {t('appointments_past')}
              </h3>
              {past.map(appt => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
