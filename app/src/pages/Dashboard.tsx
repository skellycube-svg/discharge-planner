import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import PageContainer from '../components/layout/PageContainer';
import ChecklistItemCard from '../components/cards/ChecklistItemCard';
import { AlertTriangle, Phone, FileText, Calendar, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { t, selectedPatient, checklist, medications, appointments } = useApp();
  const navigate = useNavigate();

  if (!selectedPatient) {
    return <PageContainer><div style={{ textAlign: 'center', padding: 40, color: colors.textSecondary }}>Loading...</div></PageContainer>;
  }

  const p = selectedPatient;
  const completedCount = checklist.filter(i => i.completed).length;
  const totalCount = checklist.length;

  return (
    <PageContainer>
      {/* Patient Info Header + Warning Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary, margin: '0 0 6px' }}>
            {p.patient_name}
          </h2>
          <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
            <div><strong>{t('patient_diagnosis')}:</strong> {p.discharge_diagnosis}</div>
            <div><strong>{t('patient_discharged')}:</strong> {p.discharge_date}</div>
            <div><strong>{t('patient_doctor')}:</strong> {p.primary_care_physician}</div>
            <div><strong>{t('patient_condition')}:</strong> {p.condition_on_discharge}</div>
          </div>
        </div>

        {/* Warning Signs Button — top right */}
        <button
          onClick={() => navigate('/warnings')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '12px',
            backgroundColor: colors.dangerBg,
            border: `2px solid ${colors.danger}`,
            borderRadius: 12,
            cursor: 'pointer',
            minWidth: 64,
            minHeight: 64,
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          <AlertTriangle size={24} color={colors.danger} />
          <span style={{ fontSize: 10, fontWeight: 700, color: colors.danger, textAlign: 'center' }}>
            {t('quick_action_warning')}
          </span>
        </button>
      </div>

      {/* 4 Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 20,
      }}>
        <ActionButton
          icon={<FileText size={22} color={colors.primary} />}
          label={t('btn_instructions')}
          onClick={() => navigate('/care-plan')}
          bg={colors.primaryLight}
          color={colors.primary}
        />
        <ActionButton
          icon={<Phone size={22} color="#7C3AED" />}
          label={t('btn_call_doctor')}
          onClick={() => {
            const doctorName = p.primary_care_physician;
            if (doctorName) navigate('/appointments');
          }}
          bg="#F3E8FF"
          color="#7C3AED"
        />
        <ActionButton
          icon={<Calendar size={22} color="#059669" />}
          label={t('btn_coming_up')}
          sublabel={`${medications.filter(m => !m.taken).length} meds, ${appointments.filter(a => !a.is_past).length} appts`}
          onClick={() => navigate('/coming-up')}
          bg={colors.successBg}
          color="#059669"
        />
        <ActionButton
          icon={<ClipboardList size={22} color="#EA580C" />}
          label={t('btn_care_summary')}
          onClick={() => navigate('/care-plan')}
          bg="#FFF7ED"
          color="#EA580C"
        />
      </div>

      {/* Today's Checklist */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
            {t('dashboard_today')}
          </h3>
          <span style={{ fontSize: 13, color: colors.textSecondary }}>
            {completedCount}/{totalCount} {t('checklist_complete')}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: 6,
          backgroundColor: colors.border,
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 12,
        }}>
          <div style={{
            width: totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%',
            height: '100%',
            backgroundColor: colors.success,
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {checklist.map(item => (
          <ChecklistItemCard key={item.id} item={item} />
        ))}
      </div>
    </PageContainer>
  );
}

function ActionButton({ icon, label, sublabel, onClick, bg, color }: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  bg: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '16px 10px',
        backgroundColor: bg,
        border: 'none',
        borderRadius: 14,
        cursor: 'pointer',
        minHeight: 80,
      }}
    >
      {icon}
      <span style={{ fontSize: 13, fontWeight: 700, color, textAlign: 'center' }}>
        {label}
      </span>
      {sublabel && (
        <span style={{ fontSize: 11, color: colors.textSecondary, textAlign: 'center' }}>
          {sublabel}
        </span>
      )}
    </button>
  );
}
