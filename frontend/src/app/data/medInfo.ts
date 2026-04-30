export interface MedDetail {
  purpose: string;
  withFood: string;
  sideEffects: string;
  schoolNote: string;
}

type MedMap = Record<string, { en: MedDetail; es: MedDetail }>;

export const MED_INFO: MedMap = {
  Acetaminophen: {
    en: {
      purpose: 'Brings down fever and eases mild to moderate pain. Common brand: Tylenol.',
      withFood: 'Can be given with or without food. Drink water with the dose.',
      sideEffects: 'Usually very well tolerated. Too much can hurt the liver — never exceed the dose on the bottle, and don\'t mix with other "cold & flu" products that also contain acetaminophen.',
      schoolNote: 'School needs a signed med authorization and the original bottle. The nurse usually keeps it; many schools won\'t give it just for "as needed" without a doctor\'s note.',
    },
    es: {
      purpose: 'Baja la fiebre y alivia el dolor leve a moderado. Marca común: Tylenol.',
      withFood: 'Se puede dar con o sin comida. Tómalo con agua.',
      sideEffects: 'Normalmente se tolera muy bien. Demasiado puede dañar el hígado — no pases la dosis del frasco y no lo mezcles con productos "para gripe y tos" que también traen acetaminofén.',
      schoolNote: 'La escuela necesita autorización médica firmada y el frasco original. La enfermera lo guarda; muchas escuelas no lo dan "por si lo necesita" sin orden del doctor.',
    },
  },
  Ibuprofen: {
    en: {
      purpose: 'Brings down fever and eases pain or swelling. Common brand: Motrin or Advil.',
      withFood: 'Always give with food or milk. On an empty stomach it can cause stomach pain or nausea.',
      sideEffects: 'Stomach upset is the most common. Do not give to babies under 6 months. Don\'t use if your child is dehydrated or vomiting — it can stress the kidneys.',
      schoolNote: 'School needs a signed med authorization plus the original bottle. Most schools require parent permission each day for "as needed" doses.',
    },
    es: {
      purpose: 'Baja la fiebre y alivia el dolor o la hinchazón. Marca común: Motrin o Advil.',
      withFood: 'Siempre dáselo con comida o leche. Con el estómago vacío puede causar dolor de estómago o náusea.',
      sideEffects: 'El malestar estomacal es lo más común. No dar a bebés menores de 6 meses. No usar si está deshidratado/a o vomitando — puede dañar los riñones.',
      schoolNote: 'La escuela necesita autorización médica y el frasco original. La mayoría pide permiso del papá/mamá cada día para dosis "según se necesite".',
    },
  },
  Amoxicillin: {
    en: {
      purpose: 'An antibiotic that fights bacterial infections (ear, throat, lung, urine). Does NOT work on viruses like colds or flu.',
      withFood: 'Can be given with or without food. With food helps if it upsets the stomach.',
      sideEffects: 'Diarrhea, stomach upset, or a rash. Finish the entire bottle even if your child feels better — stopping early lets the infection come back stronger. Call the doctor right away for hives, wheezing, or facial swelling.',
      schoolNote: 'If a school dose is needed, send the original pharmacy bottle (with your child\'s name) and a signed med authorization to the nurse. Refrigerate the liquid form; ask the school to keep it in the office fridge.',
    },
    es: {
      purpose: 'Un antibiótico que combate infecciones bacterianas (oído, garganta, pulmón, orina). NO sirve para virus como gripe o resfriado.',
      withFood: 'Se puede dar con o sin comida. Con comida ayuda si causa molestia estomacal.',
      sideEffects: 'Diarrea, malestar estomacal, o salpullido. Termina todo el frasco aunque ya se sienta mejor — pararlo antes hace que la infección regrese más fuerte. Llama al doctor por ronchas, silbidos al respirar o hinchazón de cara.',
      schoolNote: 'Si necesita una dosis en la escuela, manda el frasco original de la farmacia (con su nombre) y autorización médica firmada a la enfermera. La forma líquida va en el refri; pídele a la escuela que lo guarde.',
    },
  },
  Azithromycin: {
    en: {
      purpose: 'A "Z-pack" style antibiotic for some lung, throat, or skin infections.',
      withFood: 'Can be given with or without food. Some kids find it easier with a small snack.',
      sideEffects: 'Stomach upset, diarrhea, or nausea. Finish the entire course, even if your child seems fine on day 2.',
      schoolNote: 'Usually a once-a-day medicine, so school doses are rarely needed. Give in the morning at home.',
    },
    es: {
      purpose: 'Antibiótico tipo "Z-pack" para ciertas infecciones de pulmón, garganta o piel.',
      withFood: 'Se puede dar con o sin comida. A algunos niños les cae mejor con un bocadillo.',
      sideEffects: 'Malestar estomacal, diarrea o náusea. Termina todo el tratamiento, aunque ya se vea bien al segundo día.',
      schoolNote: 'Normalmente se da una vez al día, así que casi nunca se necesita en la escuela. Dáselo en la mañana en casa.',
    },
  },
  Prednisolone: {
    en: {
      purpose: 'A steroid that reduces swelling — used for asthma flare-ups, severe allergies, or croup.',
      withFood: 'Give with food or milk to protect the stomach. Try giving in the morning so it doesn\'t affect sleep.',
      sideEffects: 'Increased appetite, mood swings, trouble sleeping, and a "puffy face" are common short-term. These go away after the course finishes. Don\'t stop early without the doctor\'s OK.',
      schoolNote: 'Usually short-term (3–7 days) so school doses are rarely needed. If a midday dose is needed, send the bottle and a med authorization.',
    },
    es: {
      purpose: 'Un esteroide que baja la inflamación — para crisis de asma, alergias graves, o crup.',
      withFood: 'Dale con comida o leche para proteger el estómago. Trata de darlo en la mañana para que no afecte el sueño.',
      sideEffects: 'Más apetito, cambios de humor, problemas para dormir, y "cara hinchada" son comunes a corto plazo. Se quitan al terminar. No lo pares antes sin permiso del doctor.',
      schoolNote: 'Normalmente es corto (3–7 días), así que casi no se necesita en la escuela. Si se necesita una dosis al mediodía, manda el frasco y autorización médica.',
    },
  },
  Ondansetron: {
    en: {
      purpose: 'Stops nausea and vomiting. Common brand: Zofran.',
      withFood: 'Can be taken any time, with or without food. Dissolves on the tongue if it\'s the ODT (orally disintegrating tablet) form.',
      sideEffects: 'Headache or constipation occasionally. Stop and call the doctor if your child has irregular heartbeat or fainting.',
      schoolNote: 'Usually given at home during a stomach bug. Schools rarely need to administer this.',
    },
    es: {
      purpose: 'Detiene la náusea y el vómito. Marca común: Zofran.',
      withFood: 'Se puede tomar a cualquier hora, con o sin comida. Si es la forma ODT (que se disuelve en la lengua), no necesita agua.',
      sideEffects: 'A veces dolor de cabeza o estreñimiento. Para y llama al doctor si hay latido irregular o desmayo.',
      schoolNote: 'Normalmente se da en casa durante un virus estomacal. La escuela casi nunca lo administra.',
    },
  },
  Diphenhydramine: {
    en: {
      purpose: 'Allergy medicine for hives, itching, or allergic reactions. Common brand: Benadryl.',
      withFood: 'Can be given with or without food.',
      sideEffects: 'Causes drowsiness in most kids — but can make some kids hyper instead. Don\'t give to babies under 2 without a doctor\'s OK.',
      schoolNote: 'Schools may keep it on file as a rescue for known allergies. Send a signed action plan.',
    },
    es: {
      purpose: 'Medicina para alergias: ronchas, picazón o reacciones. Marca común: Benadryl.',
      withFood: 'Se puede dar con o sin comida.',
      sideEffects: 'Da sueño a la mayoría — pero a algunos los pone hiperactivos. No dar a bebés menores de 2 años sin orden del doctor.',
      schoolNote: 'La escuela puede tenerlo guardado como rescate para alergias conocidas. Manda un plan de acción firmado.',
    },
  },
  Cetirizine: {
    en: {
      purpose: 'Daily allergy medicine that does not usually cause sleepiness. Common brand: Zyrtec.',
      withFood: 'Can be given with or without food.',
      sideEffects: 'Mild — sometimes a small amount of drowsiness or dry mouth.',
      schoolNote: 'Once-a-day medicine. Give in the morning at home; school dose is almost never needed.',
    },
    es: {
      purpose: 'Medicina diaria para alergias que normalmente no da sueño. Marca común: Zyrtec.',
      withFood: 'Se puede dar con o sin comida.',
      sideEffects: 'Leves — a veces un poco de sueño o boca seca.',
      schoolNote: 'Una vez al día. Dáselo en la mañana en casa; casi nunca se necesita en la escuela.',
    },
  },
  Albuterol: {
    en: {
      purpose: 'Rescue inhaler for asthma — opens up the airways fast when your child is wheezing or coughing.',
      withFood: 'Not related to food. Use a spacer (with or without a mask) so the medicine actually reaches the lungs. Rinse the mouth after.',
      sideEffects: 'Shaky hands, fast heartbeat, or feeling jittery for 15–30 minutes — these are normal.',
      schoolNote: 'Send the inhaler + spacer + a signed Asthma Action Plan + a self-carry permission form (most states allow kids to keep their inhaler on them with the doctor\'s OK).',
    },
    es: {
      purpose: 'Inhalador de rescate para el asma — abre las vías respiratorias rápido cuando hay silbidos o tos.',
      withFood: 'No tiene que ver con comida. Usa un espaciador (con o sin máscara) para que la medicina llegue a los pulmones. Enjuaga la boca después.',
      sideEffects: 'Manos temblorosas, latido rápido, o sentirse nervioso/a por 15–30 minutos — es normal.',
      schoolNote: 'Manda el inhalador + espaciador + Plan de Acción de Asma firmado + permiso para que lo cargue (la mayoría de los estados permiten que el niño/a lo lleve con orden del doctor).',
    },
  },
  Fluticasone: {
    en: {
      purpose: 'Daily controller inhaler that prevents asthma flare-ups. It is NOT a rescue inhaler — won\'t help during an attack.',
      withFood: 'Not related to food. Use it twice a day every day, even when your child feels fine. Rinse mouth and spit after each use to prevent thrush.',
      sideEffects: 'Hoarse voice or oral thrush (white patches in mouth) if you skip rinsing. Slowed growth is rare and small at low doses.',
      schoolNote: 'Usually given morning and night at home, so school doses are rare.',
    },
    es: {
      purpose: 'Inhalador diario de control que previene las crisis de asma. NO es de rescate — no sirve durante un ataque.',
      withFood: 'No tiene que ver con comida. Úsalo dos veces al día siempre, aunque se sienta bien. Enjuagar la boca y escupir después de cada uso para prevenir hongos.',
      sideEffects: 'Voz ronca o hongos en la boca (manchas blancas) si no enjuaga. El crecimiento lento es raro y pequeño en dosis bajas.',
      schoolNote: 'Normalmente se da en la mañana y la noche en casa, así que casi nunca en la escuela.',
    },
  },
  Insulin: {
    en: {
      purpose: 'Replaces the insulin your child\'s body cannot make. Long-acting insulin works in the background; mealtime insulin covers carbs at meals.',
      withFood: 'Mealtime insulin must be given right before eating, matched to the carbs. Long-acting insulin is given at the same time each day, food or no food.',
      sideEffects: 'Low blood sugar (shaky, sweaty, dizzy, confused) is the biggest risk. Always carry juice or glucose tabs. Rotate injection sites to avoid lumps.',
      schoolNote: 'School needs a Diabetes Medical Management Plan (DMMP). The school nurse stores insulin, helps count carbs at lunch, and treats lows. Set this up before the first day back.',
    },
    es: {
      purpose: 'Reemplaza la insulina que el cuerpo de tu hijo/a no puede hacer. La de acción larga trabaja todo el día; la de la comida cubre los carbohidratos.',
      withFood: 'La insulina de la comida se da justo antes de comer, ajustada a los carbohidratos. La de acción larga se da a la misma hora cada día, con o sin comida.',
      sideEffects: 'El azúcar bajo (temblor, sudor, mareo, confusión) es el mayor riesgo. Lleva siempre jugo o pastillas de glucosa. Cambia el sitio de la inyección para evitar bolitas.',
      schoolNote: 'La escuela necesita un Plan de Manejo de Diabetes (DMMP). La enfermera guarda la insulina, ayuda a contar carbohidratos en el almuerzo, y trata los bajos. Organiza esto antes del primer día.',
    },
  },
  EpiPen: {
    en: {
      purpose: 'Emergency injection of epinephrine that stops a severe allergic reaction (anaphylaxis). Use first, then call 911.',
      withFood: 'Not related to food. Inject into the outer thigh — through clothes is fine. Hold for 3 seconds.',
      sideEffects: 'Fast heartbeat, shaky, pale — these are expected and short-lived.',
      schoolNote: 'School needs at least one EpiPen on file plus a signed Allergy Action Plan. Many states let older kids self-carry with a doctor\'s note. Replace before the expiration date — set a calendar reminder.',
    },
    es: {
      purpose: 'Inyección de emergencia de epinefrina que detiene una reacción alérgica grave (anafilaxia). Úsalo primero, luego llama al 911.',
      withFood: 'No tiene que ver con comida. Inyecta en el muslo por fuera — a través de la ropa está bien. Sostén por 3 segundos.',
      sideEffects: 'Latido rápido, temblor, palidez — son esperados y duran poco.',
      schoolNote: 'La escuela necesita al menos un EpiPen y un Plan de Acción para Alergias firmado. Muchos estados dejan que los más grandes lo carguen con orden del doctor. Reemplázalo antes de la fecha de vencimiento — pon un recordatorio.',
    },
  },
  Diastat: {
    en: {
      purpose: 'Rescue medicine for a seizure that lasts longer than 5 minutes. Given rectally — comes as a pre-loaded gel applicator.',
      withFood: 'Not related to food. Follow the Seizure Action Plan exactly. Call 911 after giving it.',
      sideEffects: 'Sleepiness, slow breathing — that\'s why 911 is called after.',
      schoolNote: 'School needs the medicine on file with a Seizure Action Plan, plus a signed permission form for trained staff to give it.',
    },
    es: {
      purpose: 'Medicina de rescate para una convulsión que dura más de 5 minutos. Se da por el recto — viene en un aplicador de gel ya cargado.',
      withFood: 'No tiene que ver con comida. Sigue exactamente el Plan de Acción de Convulsiones. Llama al 911 después.',
      sideEffects: 'Sueño, respiración lenta — por eso se llama al 911 después.',
      schoolNote: 'La escuela necesita la medicina y un Plan de Acción de Convulsiones, más permiso firmado para que el personal entrenado la dé.',
    },
  },
  Omeprazole: {
    en: {
      purpose: 'Lowers stomach acid for reflux, ulcers, or stomach-protecting therapy.',
      withFood: 'Best on an empty stomach, 30 minutes before breakfast. Swallow capsules whole.',
      sideEffects: 'Headache, stomach pain, or constipation occasionally. Long-term use can lower vitamin B12 — ask the doctor at follow-ups.',
      schoolNote: 'Once-a-day before breakfast — give at home; school dose is rarely needed.',
    },
    es: {
      purpose: 'Baja el ácido del estómago para reflujo, úlceras o protección estomacal.',
      withFood: 'Mejor con el estómago vacío, 30 minutos antes del desayuno. Las cápsulas se tragan enteras.',
      sideEffects: 'A veces dolor de cabeza, dolor de estómago o estreñimiento. El uso largo puede bajar la vitamina B12 — pregunta al doctor en las citas.',
      schoolNote: 'Una vez al día antes del desayuno — se da en casa; casi nunca en la escuela.',
    },
  },
  'Polyethylene glycol': {
    en: {
      purpose: 'Stool softener / laxative for constipation. Common brand: MiraLAX.',
      withFood: 'Mix the powder into 4–8 oz of water, juice, or milk. Drink within 30 minutes.',
      sideEffects: 'Loose stools, gas, or stomach cramping. Lower the dose if stools get too watery.',
      schoolNote: 'Usually given once a day at home. School doses rarely needed.',
    },
    es: {
      purpose: 'Suavizante de heces / laxante para el estreñimiento. Marca común: MiraLAX.',
      withFood: 'Mezcla el polvo en 4–8 oz de agua, jugo o leche. Tómalo en 30 minutos.',
      sideEffects: 'Heces sueltas, gases o cólicos. Baja la dosis si se vuelve muy líquida.',
      schoolNote: 'Normalmente una vez al día en casa. Casi nunca en la escuela.',
    },
  },
  hydrocortisone: {
    en: {
      purpose: 'Mild steroid cream that reduces itching and inflammation from rashes, eczema, or bug bites.',
      withFood: 'Cream — apply to clean dry skin, a thin layer 1–2 times a day. Wash hands after.',
      sideEffects: 'Skin thinning if used too long in one spot. Don\'t use on the face for more than a few days unless the doctor says so.',
      schoolNote: 'Topical creams usually need a doctor\'s authorization to be applied at school. Most parents apply at home.',
    },
    es: {
      purpose: 'Crema con esteroide leve que baja la picazón y la inflamación de salpullidos, eczema o picaduras.',
      withFood: 'Crema — aplica en piel limpia y seca, una capa fina 1–2 veces al día. Lava las manos después.',
      sideEffects: 'La piel se puede adelgazar si se usa mucho tiempo en un solo lugar. No usar en la cara más de unos días sin permiso del doctor.',
      schoolNote: 'Las cremas normalmente requieren autorización médica para aplicarse en la escuela. La mayoría de los papás lo aplican en casa.',
    },
  },
  Multivitamin: {
    en: {
      purpose: 'Daily vitamins to fill in any gaps in nutrition. Not a replacement for a balanced diet.',
      withFood: 'Give with breakfast for best absorption and to avoid stomach upset. Keep out of reach — many kids eat too many gummies.',
      sideEffects: 'Usually none. Iron-containing vitamins can cause stomach upset or dark stools.',
      schoolNote: 'Take at home — schools generally do not give vitamins.',
    },
    es: {
      purpose: 'Vitaminas diarias para llenar huecos en la alimentación. No reemplazan una dieta balanceada.',
      withFood: 'Dale con el desayuno para mejor absorción y para evitar molestias. Guarda fuera del alcance — muchos niños se comen las gomitas de más.',
      sideEffects: 'Normalmente ninguno. Las que tienen hierro pueden causar molestia estomacal o heces oscuras.',
      schoolNote: 'Se toma en casa — las escuelas normalmente no dan vitaminas.',
    },
  },
  'Vitamin D': {
    en: {
      purpose: 'Vitamin D drops or chews — helps bones grow strong. Especially important for breastfed babies and kids who spend little time in the sun.',
      withFood: 'With or without food. Babies: place drops on the nipple before feeding or directly into the mouth.',
      sideEffects: 'Very rare at recommended doses.',
      schoolNote: 'Take at home — schools generally do not give vitamins.',
    },
    es: {
      purpose: 'Gotas o tabletas masticables de vitamina D — ayudan a que los huesos crezcan fuertes. Especialmente importante para bebés con pecho o niños que toman poco sol.',
      withFood: 'Con o sin comida. Bebés: pon las gotas en el pezón antes de la toma o directo en la boca.',
      sideEffects: 'Muy raros en las dosis recomendadas.',
      schoolNote: 'Se toma en casa — las escuelas normalmente no dan vitaminas.',
    },
  },
};

const GENERIC: { en: MedDetail; es: MedDetail } = {
  en: {
    purpose: 'Follow the doctor\'s instructions on the bottle. The label tells you what this medicine is for and how often to give it.',
    withFood: 'Read the label — some medicines work best with food, others on an empty stomach. If the label doesn\'t say, give with a small snack to be safe.',
    sideEffects: 'Most kids tolerate medicines well. Watch for rash, swelling, vomiting, or any unusual behavior, and call the doctor or pharmacist with questions.',
    schoolNote: 'For school doses, send the original pharmacy bottle (with your child\'s name) and a signed Medication Authorization form to the school nurse.',
  },
  es: {
    purpose: 'Sigue las instrucciones del doctor en el frasco. La etiqueta dice para qué es y qué tan seguido dar.',
    withFood: 'Lee la etiqueta — algunas medicinas funcionan mejor con comida, otras con el estómago vacío. Si no dice, dáselo con un bocadillo pequeño para estar seguros.',
    sideEffects: 'La mayoría tolera bien las medicinas. Vigila salpullido, hinchazón, vómito o cualquier conducta extraña, y llama al doctor o farmacéutico.',
    schoolNote: 'Para dosis en la escuela, manda el frasco original de la farmacia (con su nombre) y autorización médica firmada a la enfermera.',
  },
};

export function getMedInfo(rawName: string, plainName: string, lang: 'en' | 'es'): MedDetail {
  const haystacks = [rawName, plainName].map((s) => (s ?? '').toLowerCase());
  for (const key of Object.keys(MED_INFO)) {
    const k = key.toLowerCase();
    if (haystacks.some((h) => h.includes(k))) return MED_INFO[key][lang];
  }
  return GENERIC[lang];
}
