import type { ReactNode } from 'react';
import { colors } from '../../constants/colors';

interface Props {
  title?: string;
  children: ReactNode;
}

export default function PageContainer({ title, children }: Props) {
  return (
    <div style={{
      padding: '16px 16px 80px',
      maxWidth: 480,
      margin: '0 auto',
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 52px)',
    }}>
      {title && (
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          color: colors.textPrimary,
          margin: '0 0 16px',
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
