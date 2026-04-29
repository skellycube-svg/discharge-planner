import type { Appointment } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../constants/colors';
import { Calendar, MapPin, Car } from 'lucide-react';

interface Props {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment: appt }: Props) {
  const { t } = useApp();
  const navigate = useNavigate();

  const formattedDate = appt.date
    ? new Date(appt.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div style={{
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: 10,
      opacity: appt.is_past ? 0.5 : 1,
      borderLeft: `4px solid ${appt.is_past ? colors.textSecondary : colors.primary}`,
    }}>
      {appt.is_past && (
        <span style={{
          fontSize: 11,
          backgroundColor: colors.background,
          color: colors.textSecondary,
          padding: '2px 8px',
          borderRadius: 10,
          fontWeight: 600,
          marginBottom: 6,
          display: 'inline-block',
        }}>
          {t('appointments_past')}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Calendar size={18} color={colors.primary} />
        <span style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>
          {formattedDate} {appt.time && `at ${appt.time}`}
        </span>
      </div>
      <div style={{ fontSize: 14, color: colors.textPrimary, marginBottom: 2, fontWeight: 600 }}>
        {appt.description}
      </div>
      {appt.provider && (
        <div style={{ fontSize: 13, color: colors.textSecondary }}>
          {appt.provider}
        </div>
      )}
      {appt.location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
          <MapPin size={14} />
          {appt.location}
        </div>
      )}
      {!appt.is_past && (
        <button
          onClick={() => navigate('/resources?category=transportation')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 10,
            background: colors.primaryLight,
            color: colors.primary,
            border: 'none',
            borderRadius: 8,
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            minHeight: 36,
          }}
        >
          <Car size={16} />
          {t('appointments_find_ride')}
        </button>
      )}
    </div>
  );
}
