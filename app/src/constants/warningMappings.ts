type Severity = 'red' | 'yellow' | 'green';

const redSymptoms = new Set([
  'Breathing Difficulties',
  'Difficulty breathing',
  'Fingers turning blue or white',
  'Blood sugar > 300 or < 70',
  'Rapid breathing',
  'Swelling of face/lips/tongue',
  'Self-injurious behavior',
  'Seizure activity',
  'New or Worsened Seizures',
]);

const greenSymptoms = new Set([
  'Lethargy',
  'Cast damage',
  'Nasal flaring',
]);

export function getSymptomSeverity(symptom: string): Severity {
  const trimmed = symptom.trim();
  if (redSymptoms.has(trimmed)) return 'red';
  if (greenSymptoms.has(trimmed)) return 'green';
  return 'yellow';
}

export function getActionForSeverity(severity: Severity): string {
  switch (severity) {
    case 'red': return 'Call 911 immediately';
    case 'yellow': return 'Call your doctor today';
    case 'green': return 'Monitor at home and watch for changes';
  }
}
