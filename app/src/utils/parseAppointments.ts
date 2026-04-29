import type { Appointment } from '../types';

export function parseAppointments(raw: string): Appointment[] {
  if (!raw || raw === 'No scheduled appointments') return [];

  return raw.split(' | ').map((entry, idx) => {
    const match = entry.match(
      /^(\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}\s+[AP]M)\s*-\s*(.+?)\s+with\s+(Dr\.\s+\w+)\s+at\s+(.+)$/
    );

    if (match) {
      const dateStr = match[1];
      const dateParts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const apptDate = dateParts
        ? new Date(`${dateParts[3]}-${dateParts[1]}-${dateParts[2]}`)
        : new Date();

      return {
        id: `appt-${idx}`,
        date: dateParts ? `${dateParts[3]}-${dateParts[1]}-${dateParts[2]}` : '',
        time: dateStr.replace(/\d{2}\/\d{2}\/\d{4}\s*/, ''),
        description: match[2].trim(),
        provider: match[3].trim(),
        location: match[4].trim(),
        is_past: apptDate < new Date(),
      };
    }

    return {
      id: `appt-${idx}`,
      date: '',
      time: '',
      description: entry.trim(),
      provider: '',
      location: '',
      is_past: false,
    };
  });
}
