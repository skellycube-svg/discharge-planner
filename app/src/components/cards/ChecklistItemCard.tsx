import type { ChecklistItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { Check, Pill, Calendar, FileText } from 'lucide-react';

const categoryIcons = {
  medication: Pill,
  appointment: Calendar,
  instruction: FileText,
  general: Check,
};

interface Props {
  item: ChecklistItem;
}

export default function ChecklistItemCard({ item }: Props) {
  const { toggleChecklistItem } = useApp();
  const Icon = categoryIcons[item.category];

  return (
    <button
      onClick={() => toggleChecklistItem(item.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        backgroundColor: colors.surface,
        border: 'none',
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 8,
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        border: `2px solid ${item.completed ? colors.success : colors.border}`,
        backgroundColor: item.completed ? colors.success : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {item.completed && <Check size={16} color="#fff" strokeWidth={3} />}
      </div>
      <Icon size={16} color={colors.textSecondary} style={{ flexShrink: 0 }} />
      <span style={{
        fontSize: 14,
        color: item.completed ? colors.textSecondary : colors.textPrimary,
        textDecoration: item.completed ? 'line-through' : 'none',
        lineHeight: 1.3,
      }}>
        {item.text}
      </span>
    </button>
  );
}
