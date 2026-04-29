import type { Medication } from '../types';

export function parseMedications(raw: string, isNew: boolean): Medication[] {
  if (!raw || raw === 'No New Prescription') return [];

  return raw.split(' | ').map((entry, idx) => {
    const parenMatch = entry.match(/^(.+?)\s*\((.+)\)$/);

    let name = entry;
    let instructions = '';
    let route = '';
    let frequency = '';
    let isPrn = false;
    let prnCondition: string | undefined;

    if (parenMatch) {
      name = parenMatch[1].trim();
      const details = parenMatch[2];
      const parts = details.split(',').map(p => p.trim());

      if (parts.length >= 1) instructions = parts[0];
      if (parts.length >= 2) route = parts[1];
      if (parts.length >= 3) {
        frequency = parts[2];
        const prnMatch = frequency.match(/(.+?)\s+PRN\s+(.*)/i);
        if (prnMatch) {
          frequency = prnMatch[1].trim();
          isPrn = true;
          prnCondition = prnMatch[2].trim();
        } else if (frequency.toLowerCase().includes('prn')) {
          isPrn = true;
        }
      }
    }

    const nameMatch = name.match(/^(.+?)\s+(\d[\d./]+ ?\w+(?:\/\d+ ?\w+)?)\s*(.*)$/);
    let medName = name;
    let dosage = '';
    let form = '';

    if (nameMatch) {
      medName = nameMatch[1].trim();
      dosage = nameMatch[2].trim();
      form = nameMatch[3].trim();
    }

    return {
      id: `med-${isNew ? 'new' : 'home'}-${idx}`,
      name: medName,
      dosage,
      form,
      instructions,
      route,
      frequency,
      is_prn: isPrn,
      prn_condition: prnCondition,
      is_new: isNew,
      taken: false,
    };
  });
}
