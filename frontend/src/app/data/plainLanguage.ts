export const diagnosisPlainMap: Record<string, { en: string; es: string; what: { en: string; es: string } }> = {
  'Autism Spectrum Disorder - Evaluation': {
    en: 'Autism check-up',
    es: 'Evaluación de autismo',
    what: {
      en: 'Your child was checked for autism. The doctors looked at how they learn, talk, and play.',
      es: 'Su hijo/a fue evaluado(a) por autismo. Los doctores observaron cómo aprende, habla y juega.',
    },
  },
  'Fracture - Upper Extremity': {
    en: 'Broken arm',
    es: 'Brazo fracturado',
    what: {
      en: 'Your child broke a bone in their arm. The doctors set the bone and put on a cast or splint.',
      es: 'Su hijo/a se rompió un hueso del brazo. Los doctores acomodaron el hueso y le pusieron un yeso o férula.',
    },
  },
  Pneumonia: {
    en: 'Lung infection',
    es: 'Infección en los pulmones',
    what: {
      en: 'Your child had an infection in their lungs. They got medicine to clear it.',
      es: 'Su hijo/a tuvo una infección en los pulmones. Recibió medicina para curarla.',
    },
  },
  'Type 1 Diabetes - New Onset': {
    en: 'New diabetes',
    es: 'Diabetes nueva',
    what: {
      en: 'Your child was just diagnosed with diabetes. They will need insulin and check their blood sugar every day.',
      es: 'A su hijo/a le acaban de diagnosticar diabetes. Necesitará insulina y revisar su azúcar en la sangre cada día.',
    },
  },
  'Appendectomy - Post-operative': {
    en: 'Surgery to remove appendix',
    es: 'Cirugía para quitar el apéndice',
    what: {
      en: 'Your child had surgery to remove their appendix. They are healing now.',
      es: 'Su hijo/a tuvo una cirugía para quitar el apéndice. Ahora se está recuperando.',
    },
  },
  'Allergic Reaction': {
    en: 'Allergy attack',
    es: 'Reacción alérgica',
    what: {
      en: 'Your child had a bad allergy. They need to stay away from what caused it and carry their EpiPen.',
      es: 'Su hijo/a tuvo una alergia fuerte. Debe evitar lo que la causó y llevar siempre su EpiPen.',
    },
  },
  'Seizure Disorder': {
    en: 'Seizures',
    es: 'Convulsiones',
    what: {
      en: 'Your child has seizures. The doctors gave medicine to help control them.',
      es: 'Su hijo/a tiene convulsiones. Los doctores le dieron medicina para ayudar a controlarlas.',
    },
  },
  'Asthma Exacerbation': {
    en: 'Asthma flare-up',
    es: 'Crisis de asma',
    what: {
      en: 'Your child had trouble breathing because of asthma. They need to use their inhaler as told.',
      es: 'Su hijo/a tuvo problemas para respirar por el asma. Necesita usar su inhalador como le dijeron.',
    },
  },
  'Acute Gastroenteritis': {
    en: 'Stomach bug',
    es: 'Infección estomacal',
    what: {
      en: 'Your child had a stomach bug with vomiting or diarrhea. Make sure they drink plenty of fluids.',
      es: 'Su hijo/a tuvo una infección del estómago con vómito o diarrea. Asegúrese de que tome muchos líquidos.',
    },
  },
  Bronchiolitis: {
    en: 'Chest cold (lungs)',
    es: 'Infección en los bronquios',
    what: {
      en: 'Your child had a chest cold that made it hard to breathe. Use saline drops and a humidifier at home.',
      es: 'Su hijo/a tuvo un resfriado en el pecho que le dificultó respirar. Use gotas salinas y un humidificador en casa.',
    },
  },
};

export function plainDiagnosis(dx: string, lang: 'en' | 'es' = 'en'): string {
  return diagnosisPlainMap[dx]?.[lang] ?? dx;
}

export function plainWhatHappened(dx: string, lang: 'en' | 'es' = 'en'): string {
  return (
    diagnosisPlainMap[dx]?.what[lang] ??
    (lang === 'es'
      ? `Su hijo/a estuvo en el hospital por: ${dx}.`
      : `Your child was in the hospital for: ${dx}.`)
  );
}

const symptomPlainMap: Record<string, { en: string; es: string }> = {
  'Persistent Temp > 100.4 F': { en: 'Fever over 100.4°F that won\'t go down', es: 'Fiebre de más de 100.4°F que no baja' },
  'Worsening cough': { en: 'Cough is getting worse', es: 'La tos está empeorando' },
  'Breathing Difficulties': { en: 'Hard time breathing', es: 'Dificultad para respirar' },
  'Chest pain': { en: 'Chest pain', es: 'Dolor en el pecho' },
  Lethargy: { en: 'Very tired or hard to wake up', es: 'Muy cansado o difícil de despertar' },
  'Increased swelling': { en: 'More swelling than before', es: 'Más hinchazón que antes' },
  'Numbness or tingling in fingers': { en: 'Fingers feel numb or tingle', es: 'Los dedos se sienten dormidos o con hormigueo' },
  'Fingers turning blue or white': { en: 'Fingers turn blue or white', es: 'Los dedos se ponen azules o blancos' },
  'Severe pain not relieved by medication': { en: 'Bad pain that medicine doesn\'t help', es: 'Dolor fuerte que la medicina no quita' },
  'Cast damage': { en: 'Cast is broken or wet', es: 'El yeso está roto o mojado' },
  'Significant behavioral changes': { en: 'Big changes in behavior', es: 'Cambios grandes en el comportamiento' },
  'Self-injurious behavior': { en: 'Hurting themselves', es: 'Se hace daño a sí mismo(a)' },
  'Regression of skills': { en: 'Losing skills they had', es: 'Pierde habilidades que ya tenía' },
  'Seizure activity': { en: 'A seizure', es: 'Una convulsión' },
  'New or Worsened Seizures': { en: 'New seizures or worse than before', es: 'Convulsiones nuevas o peores' },
  'Persistent Vomiting': { en: 'Throwing up that won\'t stop', es: 'Vómito que no para' },
  'Increased abdominal pain': { en: 'Belly pain getting worse', es: 'Dolor de barriga empeorando' },
  'Redness/drainage from incision sites': { en: 'Red or oozing where the cut is', es: 'Rojo o secreción en la herida' },
  'Unable to tolerate liquids': { en: 'Can\'t keep liquids down', es: 'No puede tomar líquidos sin vomitar' },
  'Difficulty breathing': { en: 'Hard time breathing', es: 'Dificultad para respirar' },
  'Swelling of face/lips/tongue': { en: 'Face, lips, or tongue swelling up', es: 'Cara, labios o lengua hinchados' },
  'Hives spreading': { en: 'Hives spreading on the body', es: 'Ronchas que se extienden' },
  Dizziness: { en: 'Feeling dizzy', es: 'Mareos' },
  'Repeated vomiting': { en: 'Throwing up over and over', es: 'Vómito repetido' },
  Wheezing: { en: 'Whistling sound when breathing', es: 'Sonido de silbido al respirar' },
  'Shortness of Breath': { en: 'Can\'t catch their breath', es: 'No puede recuperar el aliento' },
  'Persistent Cough': { en: 'Cough that won\'t go away', es: 'Tos que no se quita' },
  'Blood sugar > 300 or < 70': { en: 'Blood sugar over 300 or under 70', es: 'Azúcar en la sangre arriba de 300 o abajo de 70' },
  'Fruity breath odor': { en: 'Breath smells like fruit', es: 'Aliento con olor a fruta' },
  'Rapid breathing': { en: 'Breathing very fast', es: 'Respiración muy rápida' },
  'Blood in stool': { en: 'Blood in poop', es: 'Sangre en la caca' },
  'Persistent Vomiting > 24 hours': { en: 'Vomiting for more than a day', es: 'Vómito por más de un día' },
  'Signs of dehydration': { en: 'Signs of dehydration (dry mouth, no tears, no pee)', es: 'Señas de deshidratación (boca seca, sin lágrimas, sin orinar)' },
  'Severe abdominal pain': { en: 'Very bad belly pain', es: 'Dolor de barriga muy fuerte' },
  'Poor feeding': { en: 'Won\'t eat or drink well', es: 'No come o bebe bien' },
  'Nasal flaring': { en: 'Nostrils flaring when breathing', es: 'Aletas de la nariz se mueven al respirar' },
};

export function plainSymptom(s: string, lang: 'en' | 'es' = 'en'): string {
  return symptomPlainMap[s]?.[lang] ?? s;
}

const EMERGENCY_KEYWORDS = [
  'breathing',
  'chest pain',
  'seizure',
  'seizures',
  'lethargy',
  'unresponsive',
  '> 300',
  'fruity breath',
  'rapid breathing',
  'swelling of face',
  'difficulty breathing',
  'blood in stool',
  'dehydration',
  'self-injurious',
  'unable to tolerate liquids',
];

export function classifyWarning(symptom: string): 'emergency' | 'warning' {
  const s = symptom.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => s.includes(kw)) ? 'emergency' : 'warning';
}
