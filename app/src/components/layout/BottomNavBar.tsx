import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Pill, HandHeart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { colors } from '../../constants/colors';

const tabs = [
  { path: '/', icon: Home, labelKey: 'nav_home' },
  { path: '/care-plan', icon: ClipboardList, labelKey: 'nav_care_plan' },
  { path: '/medications', icon: Pill, labelKey: 'nav_medications' },
  { path: '/resources', icon: HandHeart, labelKey: 'nav_resources' },
];

export default function BottomNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 64,
      backgroundColor: colors.surface,
      borderTop: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      maxWidth: 480,
      margin: '0 auto',
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              minWidth: 64,
              minHeight: 44,
              color: active ? colors.primary : colors.textSecondary,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span style={{
              fontSize: 11,
              fontWeight: active ? 700 : 400,
            }}>
              {t(tab.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
