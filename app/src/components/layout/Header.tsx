import { useApp } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { Globe, LogOut } from 'lucide-react';

export default function Header() {
  const { t, language, setLanguage, logout } = useApp();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: colors.primary,
      color: '#fff',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
        {t('app_name')}
      </h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 20,
            padding: '6px 10px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            minHeight: 32,
            minWidth: 44,
          }}
        >
          <Globe size={14} />
          {language === 'en' ? 'ES' : 'EN'}
        </button>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 20,
            padding: '6px 10px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            minHeight: 32,
            minWidth: 44,
          }}
          aria-label={t('logout')}
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
