import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const { loginWithMRN, t } = useApp();
  const [mrn, setMrn] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = mrn.trim();
    if (!trimmed) {
      setError(t('login_error_empty'));
      return;
    }
    const success = loginWithMRN(trimmed);
    if (!success) {
      setError(t('login_error_not_found'));
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.primary,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <ShieldCheck size={36} color="#fff" />
        </div>

        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>
          {t('app_name')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 0 32px' }}>
          {t('login_subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}>
          <label style={{
            display: 'block',
            textAlign: 'left',
            fontSize: 14,
            fontWeight: 600,
            color: colors.textPrimary,
            marginBottom: 6,
          }}>
            {t('login_mrn_label')}
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={mrn}
            onChange={e => { setMrn(e.target.value); setError(''); }}
            placeholder={t('login_mrn_placeholder')}
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 18,
              fontWeight: 600,
              border: `2px solid ${error ? colors.danger : colors.border}`,
              borderRadius: 12,
              outline: 'none',
              textAlign: 'center',
              letterSpacing: 2,
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              color: colors.danger,
              fontSize: 13,
              fontWeight: 500,
            }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
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
            {t('login_submit')}
          </button>
        </form>

        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 12,
          marginTop: 20,
          lineHeight: 1.4,
        }}>
          {t('login_help_text')}
        </p>
      </div>
    </div>
  );
}
