import { useState } from 'react';
import type { Program } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { Phone, MapPin, Clock, ChevronDown, ChevronUp, Globe, Baby, Accessibility } from 'lucide-react';

const categoryColors: Record<string, string> = {
  food: '#EA580C',
  transportation: '#2563EB',
  therapy: '#7C3AED',
  housing: '#059669',
};

interface Props {
  program: Program;
}

export default function ResourceCard({ program: prog }: Props) {
  const { t } = useApp();
  const [expanded, setExpanded] = useState(false);

  const statusColor = prog.availability_status === 'open'
    ? colors.success
    : prog.availability_status === 'limited'
      ? colors.warning
      : colors.danger;

  const statusLabel = prog.availability_status === 'open'
    ? t('resource_available')
    : prog.availability_status === 'limited'
      ? t('resource_limited')
      : t('resource_full');

  const catColor = categoryColors[prog.category] || colors.primary;

  const dayAbbrs = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const langMap: Record<string, string> = {
    en: 'English', es: 'Spanish', vi: 'Vietnamese', zh: 'Chinese',
    ko: 'Korean', ar: 'Arabic', hy: 'Armenian', tl: 'Tagalog',
    fa: 'Farsi', km: 'Khmer',
  };

  return (
    <div style={{
      backgroundColor: colors.surface,
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: 12,
      overflow: 'hidden',
    }}>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 11,
                backgroundColor: catColor + '18',
                color: catColor,
                padding: '2px 8px',
                borderRadius: 10,
                fontWeight: 600,
                textTransform: 'capitalize',
              }}>
                {prog.category}
              </span>
              <span style={{
                fontSize: 11,
                backgroundColor: statusColor + '18',
                color: statusColor,
                padding: '2px 8px',
                borderRadius: 10,
                fontWeight: 600,
              }}>
                {statusLabel}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>
              {prog.name}
            </div>
          </div>
        </div>

        {prog.cost === 0 && (
          <span style={{
            fontSize: 12,
            color: colors.success,
            fontWeight: 600,
          }}>
            {t('resource_free')}
          </span>
        )}
        {prog.cost > 0 && (
          <span style={{ fontSize: 12, color: colors.textSecondary }}>
            {t('resource_cost')}: ${prog.cost}
          </span>
        )}

        {prog.wait_time_days > 0 && (
          <span style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 12 }}>
            {t('resource_wait')}: {prog.wait_time_days} {t('resource_days')}
          </span>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <a
            href={`tel:${prog.phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              minHeight: 40,
            }}
          >
            <Phone size={16} />
            {t('resource_call')}
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(prog.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: colors.primaryLight,
              color: colors.primary,
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              minHeight: 40,
            }}
          >
            <MapPin size={16} />
            {t('resource_directions')}
          </a>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: '8px',
          background: colors.background,
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          color: colors.textSecondary,
        }}
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {expanded ? 'Less' : 'More Details'}
      </button>

      {expanded && (
        <div style={{ padding: '0 14px 14px', fontSize: 13, color: colors.textSecondary }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <MapPin size={14} />
            {prog.address}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Phone size={14} />
            {prog.phone}
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontWeight: 600 }}>
              <Clock size={14} />
              {t('resource_hours')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '2px 8px', fontSize: 12 }}>
              {dayAbbrs.map((day, i) => (
                <div key={day} style={{ display: 'contents' }}>
                  <span style={{ fontWeight: 600 }}>{dayLabels[i]}</span>
                  <span>{prog.hours[day]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Globe size={14} />
            {t('resource_languages')}: {prog.languages.map(l => langMap[l] || l).join(', ')}
          </div>

          {prog.accepted_insurance.length > 0 && prog.accepted_insurance[0] !== '' && (
            <div style={{ marginBottom: 6 }}>
              {t('resource_insurance')}: {prog.accepted_insurance.join(', ')}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            {prog.child_friendly && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: colors.success }}>
                <Baby size={14} /> {t('resource_child_friendly')}
              </span>
            )}
            {prog.ada_accessible && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: colors.primary }}>
                <Accessibility size={14} /> {t('resource_ada')}
              </span>
            )}
          </div>

          {prog.available_slots > 0 && (
            <div style={{ marginTop: 6, fontSize: 12, color: colors.success, fontWeight: 600 }}>
              {prog.available_slots} {t('resource_slots')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
