import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import PageContainer from '../components/layout/PageContainer';
import ResourceCard from '../components/cards/ResourceCard';
import type { ScreeningResult } from '../types';

export default function Resources() {
  const { t, programs } = useApp();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [screeningDone, setScreeningDone] = useState(!!initialCategory);
  const [screening, setScreening] = useState<ScreeningResult>({
    needs_food: false,
    needs_transportation: initialCategory === 'transportation',
    needs_therapy: false,
    needs_housing: false,
  });
  const [activeFilter, setActiveFilter] = useState<string>(initialCategory || 'all');

  const filteredPrograms = useMemo(() => {
    let result = [...programs];

    if (screeningDone && !initialCategory) {
      const cats: string[] = [];
      if (screening.needs_food) cats.push('food');
      if (screening.needs_transportation) cats.push('transportation');
      if (screening.needs_therapy) cats.push('therapy');
      if (screening.needs_housing) cats.push('housing');
      if (cats.length > 0) {
        result = result.filter(p => cats.includes(p.category));
      }
    }

    if (activeFilter !== 'all') {
      result = result.filter(p => p.category === activeFilter);
    }

    const statusOrder: Record<string, number> = { open: 0, limited: 1, full: 2 };
    result.sort((a, b) => (statusOrder[a.availability_status] ?? 3) - (statusOrder[b.availability_status] ?? 3));

    return result;
  }, [programs, screening, screeningDone, activeFilter, initialCategory]);

  const categories = [
    { key: 'all', label: t('filter_all') },
    { key: 'food', label: t('filter_food') },
    { key: 'transportation', label: t('filter_transportation') },
    { key: 'therapy', label: t('filter_therapy') },
    { key: 'housing', label: t('filter_housing') },
  ];

  if (!screeningDone) {
    return (
      <PageContainer title={t('screening_title')}>
        <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>
          {t('screening_subtitle')}
        </p>

        <ScreeningQ
          question={t('screening_food')}
          value={screening.needs_food}
          onChange={v => setScreening(s => ({ ...s, needs_food: v }))}
          t={t}
        />
        <ScreeningQ
          question={t('screening_transport')}
          value={screening.needs_transportation}
          onChange={v => setScreening(s => ({ ...s, needs_transportation: v }))}
          t={t}
        />
        <ScreeningQ
          question={t('screening_therapy')}
          value={screening.needs_therapy}
          onChange={v => setScreening(s => ({ ...s, needs_therapy: v }))}
          t={t}
        />
        <ScreeningQ
          question={t('screening_housing')}
          value={screening.needs_housing}
          onChange={v => setScreening(s => ({ ...s, needs_housing: v }))}
          t={t}
        />

        <button
          onClick={() => setScreeningDone(true)}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 16,
            minHeight: 48,
          }}
        >
          {t('screening_submit')}
        </button>

        <button
          onClick={() => { setScreeningDone(true); setActiveFilter('all'); }}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: colors.primary,
            border: `2px solid ${colors.primary}`,
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            marginTop: 10,
            minHeight: 44,
          }}
        >
          {t('screening_skip')}
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={t('resources_title')}>
      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        marginBottom: 16,
        paddingBottom: 4,
      }}>
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            style={{
              padding: '8px 14px',
              backgroundColor: activeFilter === cat.key ? colors.primary : colors.surface,
              color: activeFilter === cat.key ? '#fff' : colors.textSecondary,
              border: 'none',
              borderRadius: 20,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              whiteSpace: 'nowrap',
              minHeight: 36,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: colors.textSecondary }}>
          {filteredPrograms.length} resources found
        </span>
        <button
          onClick={() => { setScreeningDone(false); setActiveFilter('all'); }}
          style={{
            background: 'none',
            border: 'none',
            color: colors.primary,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t('screening_retake')}
        </button>
      </div>

      {filteredPrograms.slice(0, 20).map(prog => (
        <ResourceCard key={prog.id} program={prog} />
      ))}

      {filteredPrograms.length > 20 && (
        <div style={{ textAlign: 'center', padding: 16, color: colors.textSecondary, fontSize: 13 }}>
          Showing 20 of {filteredPrograms.length} resources. Use filters to narrow results.
        </div>
      )}
    </PageContainer>
  );
}

function ScreeningQ({
  question,
  value,
  onChange,
  t,
}: {
  question: string;
  value: boolean;
  onChange: (v: boolean) => void;
  t: (key: string) => string;
}) {
  return (
    <div style={{
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 10 }}>
        {question}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => onChange(true)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 10,
            border: `2px solid ${value ? colors.primary : colors.border}`,
            backgroundColor: value ? colors.primaryLight : 'transparent',
            color: value ? colors.primary : colors.textSecondary,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          {t('screening_yes')}
        </button>
        <button
          onClick={() => onChange(false)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 10,
            border: `2px solid ${!value ? colors.primary : colors.border}`,
            backgroundColor: !value ? colors.primaryLight : 'transparent',
            color: !value ? colors.primary : colors.textSecondary,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          {t('screening_no')}
        </button>
      </div>
    </div>
  );
}
