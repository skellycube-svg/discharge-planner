import type { WarningSigns, WarningItem } from '../types';
import { getSymptomSeverity, getActionForSeverity } from '../constants/warningMappings';

export function categorizeWarnings(seekMedicalAttentionFor: string): WarningSigns {
  const result: WarningSigns = { red: [], yellow: [], green: [] };

  if (!seekMedicalAttentionFor) return result;

  const symptoms = seekMedicalAttentionFor.split(',').map(s => s.trim()).filter(Boolean);

  for (const symptom of symptoms) {
    const severity = getSymptomSeverity(symptom);
    const item: WarningItem = {
      symptom,
      action: getActionForSeverity(severity),
      severity,
    };
    result[severity].push(item);
  }

  return result;
}
