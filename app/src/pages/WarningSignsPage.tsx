import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import PageContainer from '../components/layout/PageContainer';
import WarningSignItemCard from '../components/cards/WarningSignItem';
import { Phone } from 'lucide-react';

export default function WarningSignsPage() {
  const { t, warnings } = useApp();

  const sections = [
    { key: 'red' as const, title: t('warning_red_title'), desc: t('warning_red_desc'), color: colors.danger, bg: colors.dangerBg, items: warnings.red },
    { key: 'yellow' as const, title: t('warning_yellow_title'), desc: t('warning_yellow_desc'), color: colors.warning, bg: colors.warningBg, items: warnings.yellow },
    { key: 'green' as const, title: t('warning_green_title'), desc: t('warning_green_desc'), color: colors.success, bg: colors.successBg, items: warnings.green },
  ];

  return (
    <PageContainer title={t('warnings_title')}>
      {/* Emergency Call Buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <a
          href="tel:911"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 16px',
            backgroundColor: colors.danger,
            color: '#fff',
            borderRadius: 12,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 16,
            minHeight: 48,
          }}
        >
          <Phone size={20} />
          Call 911
        </a>
        <a
          href="tel:+1"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 16px',
            backgroundColor: colors.warning,
            color: '#fff',
            borderRadius: 12,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 15,
            minHeight: 48,
          }}
        >
          <Phone size={20} />
          {t('quick_action_call')}
        </a>
      </div>

      {sections.map(section => (
        <div key={section.key} style={{ marginBottom: 24 }}>
          <div style={{
            backgroundColor: section.bg,
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 10,
            borderLeft: `4px solid ${section.color}`,
          }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: section.color, margin: '0 0 2px' }}>
              {section.title}
            </h3>
            <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>
              {section.desc}
            </p>
          </div>
          {section.items.length > 0 ? (
            section.items.map((item, i) => (
              <WarningSignItemCard key={`${section.key}-${i}`} item={item} />
            ))
          ) : (
            <div style={{ fontSize: 13, color: colors.textSecondary, padding: '8px 14px' }}>
              No symptoms in this category
            </div>
          )}
        </div>
      ))}
    </PageContainer>
  );
}
