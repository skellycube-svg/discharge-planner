export interface ConditionDetail {
  whatItIs: string;
  recovery: string;
  schoolReturn: string;
  callDoctor: string;
}

type ConditionMap = Record<string, { en: ConditionDetail; es: ConditionDetail }>;

export const CONDITION_INFO: ConditionMap = {
  'Acute Gastroenteritis': {
    en: {
      whatItIs:
        'Acute gastroenteritis is a stomach bug — usually a virus — that causes vomiting and/or diarrhea. It is very common and almost always gets better on its own.',
      recovery:
        'Most kids feel much better in 2 to 3 days and fully recover within a week. The most important thing is to keep them drinking small sips often (Pedialyte, breast milk, or water) so they do not get dehydrated. Start with bland foods (toast, rice, banana, applesauce) when they want to eat.',
      schoolReturn:
        'Wait until your child has had no vomiting and no diarrhea for 24 full hours, is eating normally, and has energy for a full day. Wash hands often — the bug spreads easily.',
      callDoctor:
        'Call the doctor if your child has no wet diapers or pee for 8+ hours, no tears when crying, a sunken soft spot (babies), blood in vomit or stool, fever over 102°F (39°C), or just seems much weaker than normal.',
    },
    es: {
      whatItIs:
        'La gastroenteritis aguda es un virus estomacal que causa vómito y/o diarrea. Es muy común y casi siempre se cura solo.',
      recovery:
        'La mayoría de los niños se siente mucho mejor en 2 a 3 días y se recupera por completo en una semana. Lo más importante es darle sorbitos pequeños seguido (Pedialyte, leche materna o agua) para que no se deshidrate. Empieza con comida suave (pan tostado, arroz, plátano, manzana) cuando quiera comer.',
      schoolReturn:
        'Espera a que tu hijo/a lleve 24 horas completas sin vómito ni diarrea, esté comiendo normal y con energía para todo el día. Laven las manos seguido — el virus se contagia fácil.',
      callDoctor:
        'Llama al doctor si lleva 8 o más horas sin orinar, no hay lágrimas al llorar, la mollera se ve hundida (bebés), hay sangre en el vómito o en las heces, fiebre arriba de 102°F (39°C), o se ve mucho más débil de lo normal.',
    },
  },

  'Allergic Reaction': {
    en: {
      whatItIs:
        'An allergic reaction happens when the body reacts to something it sees as harmful — a food, medicine, insect sting, or other trigger. Reactions can be mild (hives, itching) or severe (trouble breathing, swelling of face/lips/tongue), called anaphylaxis.',
      recovery:
        'Mild reactions usually settle within a few hours with antihistamines like Benadryl or Zyrtec. Severe reactions need an EpiPen and 911 right away. Avoid the trigger completely until you see an allergist.',
      schoolReturn:
        'Your child can return to school the day after symptoms fully resolve and they feel back to normal. Bring the EpiPen and a written allergy action plan to the school nurse — every classroom and the cafeteria need to know about the trigger.',
      callDoctor:
        'Call 911 for trouble breathing, swelling of the face/lips/tongue, throat tightness, fainting, or repeated vomiting after the trigger. Use the EpiPen first, then call. For mild hives that keep spreading or last more than 24 hours, call the doctor.',
    },
    es: {
      whatItIs:
        'Una reacción alérgica ocurre cuando el cuerpo reacciona a algo que ve como dañino — una comida, medicina, picadura o algún disparador. Pueden ser leves (ronchas, picazón) o graves (dificultad para respirar, hinchazón de cara/labios/lengua), llamadas anafilaxia.',
      recovery:
        'Las reacciones leves suelen calmarse en unas horas con antihistamínicos como Benadryl o Zyrtec. Las graves necesitan EpiPen y 911 de inmediato. Evita por completo el disparador hasta ver al alergólogo.',
      schoolReturn:
        'Tu hijo/a puede regresar al día siguiente de que los síntomas se quiten y se sienta normal. Lleva el EpiPen y un plan de acción escrito a la enfermera de la escuela — cada salón y la cafetería deben saber del disparador.',
      callDoctor:
        'Llama al 911 si hay dificultad para respirar, hinchazón de cara/labios/lengua, garganta cerrada, desmayo o vómitos repetidos después del disparador. Usa el EpiPen primero, luego llama. Para ronchas leves que siguen extendiéndose o duran más de 24 horas, llama al doctor.',
    },
  },

  'Appendectomy - Post-operative': {
    en: {
      whatItIs:
        'An appendectomy is surgery to remove the appendix (a small pouch attached to the intestine). It was likely inflamed or burst, and removing it solves the problem completely.',
      recovery:
        'Most kids go home 1–2 days after surgery and feel mostly back to normal in 1–2 weeks. Keep the incision clean and dry, no tub baths or swimming for 1 week (showers are fine after 48 hours), and no heavy lifting or rough play for 2–4 weeks. Pain medicine helps the first few days.',
      schoolReturn:
        'Most kids go back to school 1 week after surgery if they feel well, are off prescription pain medicine, and can sit through class. Skip PE, recess running, and sports for 2–4 weeks until the surgeon clears them at the follow-up.',
      callDoctor:
        'Call the surgeon for fever above 101°F (38.3°C), redness or pus around the incision, increasing belly pain, vomiting that won\'t stop, or no bowel movement for 3+ days.',
    },
    es: {
      whatItIs:
        'Una apendicectomía es la cirugía para sacar el apéndice (una bolsita pegada al intestino). Probablemente estaba inflamado o reventado, y quitarlo soluciona el problema por completo.',
      recovery:
        'La mayoría regresa a casa 1–2 días después y se siente casi normal en 1–2 semanas. Mantén la herida limpia y seca, sin baño de tina ni alberca por 1 semana (las duchas están bien después de 48 horas), y sin cargar cosas pesadas ni juegos bruscos por 2–4 semanas. La medicina para el dolor ayuda los primeros días.',
      schoolReturn:
        'La mayoría regresa a la escuela 1 semana después si se siente bien, ya no necesita medicina recetada para el dolor y puede estar sentado/a en clase. Sin educación física, correr en el recreo ni deportes por 2–4 semanas hasta que el cirujano los autorice en la cita de seguimiento.',
      callDoctor:
        'Llama al cirujano por fiebre arriba de 101°F (38.3°C), enrojecimiento o pus alrededor de la herida, dolor abdominal que aumenta, vómito que no para, o si no ha tenido evacuación en 3 o más días.',
    },
  },

  'Asthma Exacerbation': {
    en: {
      whatItIs:
        'An asthma exacerbation (or "flare-up") is when the airways in the lungs swell up and tighten, making it hard to breathe. Common triggers are colds, allergies, smoke, exercise, or cold air.',
      recovery:
        'With the rescue inhaler (albuterol) and steroid medicine, breathing usually improves within hours and is fully back to normal in 5–10 days. Use the daily controller inhaler every day even when your child feels fine — it prevents the next flare-up.',
      schoolReturn:
        'Your child can return when they can breathe easily, sleep through the night, and play without coughing or wheezing — usually 1–3 days. Send the rescue inhaler to school with a signed Asthma Action Plan and a self-carry form so they can use it during class or PE.',
      callDoctor:
        'Call 911 for blue lips, ribs sucking in with each breath, can\'t talk in full sentences, or no improvement after a rescue inhaler treatment. Call the doctor for a cough that wakes them up, needing the rescue inhaler more than every 4 hours, or fever over 101°F (38.3°C).',
    },
    es: {
      whatItIs:
        'Una crisis de asma es cuando las vías respiratorias en los pulmones se hinchan y se cierran, haciendo difícil respirar. Los disparadores comunes son resfriados, alergias, humo, ejercicio o aire frío.',
      recovery:
        'Con el inhalador de rescate (albuterol) y la medicina con esteroide, la respiración mejora en horas y vuelve a la normalidad en 5–10 días. Usa el inhalador diario aunque tu hijo/a se sienta bien — eso previene la próxima crisis.',
      schoolReturn:
        'Puede regresar cuando respira fácil, duerme toda la noche y juega sin toser ni silbar — normalmente 1–3 días. Manda el inhalador de rescate a la escuela con un Plan de Acción de Asma firmado y un permiso para que lo cargue, así puede usarlo en clase o en educación física.',
      callDoctor:
        'Llama al 911 si los labios se ven azules, las costillas se hunden al respirar, no puede hablar oraciones completas, o no mejora después del inhalador de rescate. Llama al doctor por tos que lo/la despierta, si necesita el inhalador más seguido que cada 4 horas, o fiebre arriba de 101°F (38.3°C).',
    },
  },

  'Autism Spectrum Disorder - Evaluation': {
    en: {
      whatItIs:
        'Autism Spectrum Disorder (ASD) is a difference in how the brain develops that affects how a child communicates, learns, and connects with others. There is no "cure" — but the right therapies and supports help kids thrive.',
      recovery:
        'This is a lifelong condition, not an illness to recover from. The most important next step is starting therapies early — speech, occupational, and applied behavior analysis (ABA). Early support makes a big difference.',
      schoolReturn:
        'Your child can attend school normally. Ask the school for an evaluation for an IEP (Individualized Education Program) or 504 plan — these legal supports give your child accommodations like a quiet room, extra time, or a one-on-one aide. Bring the evaluation report to the meeting.',
      callDoctor:
        'Call the doctor if your child has new self-injurious behavior, sudden loss of skills they had before, severe sleep problems, or if you cannot find or afford the recommended therapies — they can refer you to free programs.',
    },
    es: {
      whatItIs:
        'El Trastorno del Espectro Autista (TEA) es una diferencia en cómo se desarrolla el cerebro que afecta cómo un niño/a se comunica, aprende y se conecta con otros. No tiene "cura" — pero las terapias correctas y el apoyo lo/la ayudan a prosperar.',
      recovery:
        'Es una condición de por vida, no una enfermedad de la que se recupera. El siguiente paso más importante es empezar terapias temprano — de habla, ocupacional, y análisis aplicado del comportamiento (ABA). El apoyo temprano hace una gran diferencia.',
      schoolReturn:
        'Tu hijo/a puede ir a la escuela normalmente. Pídele a la escuela una evaluación para un IEP (Plan Educativo Individual) o un plan 504 — estos apoyos legales le dan adaptaciones como un cuarto tranquilo, tiempo extra, o un asistente uno-a-uno. Lleva el reporte de evaluación a la reunión.',
      callDoctor:
        'Llama al doctor si tu hijo/a tiene nueva conducta de autolesión, pérdida repentina de habilidades que ya tenía, problemas graves de sueño, o si no puedes encontrar o pagar las terapias recomendadas — pueden referirte a programas gratis.',
    },
  },

  Bronchiolitis: {
    en: {
      whatItIs:
        'Bronchiolitis is a viral infection (most often RSV) of the small airways in the lungs. It is very common in babies under 2 and causes wheezing, coughing, and trouble breathing.',
      recovery:
        'The cough can last 2–3 weeks, but the worst breathing trouble is in days 3–5 and then gets steadily better. Keep the baby drinking (breastmilk, formula, or fluids), use saline nose drops with a bulb suction before feeds and sleep, and run a cool-mist humidifier.',
      schoolReturn:
        'Most babies in daycare can return when they have been fever-free for 24 hours, are eating and drinking normally, and breathing comfortably. The cough alone is OK as long as it is improving.',
      callDoctor:
        'Call 911 for blue lips, very fast breathing, ribs sucking in with each breath, or pauses in breathing. Call the doctor for fewer than 4 wet diapers in 24 hours, fever over 100.4°F (38°C) in a baby under 3 months, or worsening breathing on day 5+ instead of better.',
    },
    es: {
      whatItIs:
        'La bronquiolitis es una infección viral (más seguido por VSR/RSV) de las vías pequeñas de los pulmones. Es muy común en bebés menores de 2 años y causa silbidos al respirar, tos y dificultad para respirar.',
      recovery:
        'La tos puede durar 2–3 semanas, pero la peor dificultad para respirar es en los días 3–5 y luego mejora poco a poco. Mantén al bebé tomando líquidos (leche materna, fórmula), usa gotas de solución salina con perita de succión antes de comer y dormir, y un humidificador de vapor frío.',
      schoolReturn:
        'La mayoría puede regresar a la guardería cuando lleva 24 horas sin fiebre, come y toma normal y respira cómodamente. La tos sola está bien si va mejorando.',
      callDoctor:
        'Llama al 911 si los labios se ven azules, respira muy rápido, las costillas se hunden al respirar, o tiene pausas al respirar. Llama al doctor si tiene menos de 4 pañales mojados en 24 horas, fiebre arriba de 100.4°F (38°C) en bebé menor de 3 meses, o si la respiración empeora del día 5 en adelante en vez de mejorar.',
    },
  },

  'Fracture - Upper Extremity': {
    en: {
      whatItIs:
        'A fracture means a bone broke or cracked — most often the wrist, forearm, or elbow from a fall. Kids\' bones heal faster and stronger than adults\'.',
      recovery:
        'Most arm fractures heal in 4–6 weeks in a cast or splint. Keep the cast clean and completely dry (cover with a plastic bag in the shower), don\'t stick anything inside it, and elevate the arm above the heart for the first few days to reduce swelling. Use ice over the cast for short periods if it hurts.',
      schoolReturn:
        'Your child can usually return to school in 1–3 days once pain is controlled and they can sit through class. No PE, recess sports, climbing equipment, or wrestling for the entire cast time. Ask the teacher to help with writing if the dominant arm is in a cast.',
      callDoctor:
        'Call the doctor right away for fingers that turn cold, blue, white, or numb; fingers you can\'t move; new severe pain that pain medicine doesn\'t help; the cast feels too tight or too loose; or a bad smell or wetness coming from the cast.',
    },
    es: {
      whatItIs:
        'Una fractura significa que un hueso se rompió o se fisuró — más seguido la muñeca, antebrazo o codo por una caída. Los huesos de los niños sanan más rápido y más fuertes que los de los adultos.',
      recovery:
        'La mayoría de las fracturas de brazo sanan en 4–6 semanas con yeso o férula. Mantén el yeso limpio y completamente seco (cubre con bolsa de plástico al bañarse), no metas nada adentro, y eleva el brazo arriba del corazón los primeros días para bajar la hinchazón. Usa hielo sobre el yeso por ratos cortos si duele.',
      schoolReturn:
        'Normalmente puede regresar a la escuela en 1–3 días cuando el dolor está controlado y puede estar sentado/a en clase. Sin educación física, deportes en el recreo, juegos de trepar ni lucha durante todo el tiempo del yeso. Pídele al maestro/a que le ayude a escribir si el yeso es del brazo dominante.',
      callDoctor:
        'Llama al doctor de inmediato si los dedos se ponen fríos, azules, blancos o entumidos; si no puede moverlos; si hay dolor nuevo y fuerte que la medicina no quita; si el yeso se siente muy apretado o muy flojo; o si sale mal olor o humedad del yeso.',
    },
  },

  Pneumonia: {
    en: {
      whatItIs:
        'Pneumonia is an infection (bacterial or viral) in the lungs that fills the air sacs with fluid, making breathing harder. It causes fever, cough, and fast or labored breathing.',
      recovery:
        'With antibiotics (if bacterial), kids usually feel better within 48 hours and recover in 1–2 weeks, though the cough can linger for 3–4 weeks. Finish every dose of antibiotic even if they feel fine. Push fluids and rest. Use a cool-mist humidifier at night.',
      schoolReturn:
        'Your child can return after at least 24 hours fever-free without medicine, when they have energy for a full school day, and the breathing rate is back to normal — usually 5–7 days. The cough alone is fine if it is improving.',
      callDoctor:
        'Call 911 for blue lips, ribs sucking in with each breath, or no improvement at all 48 hours after starting antibiotics. Call the doctor for fever returning after it had gone away, increased breathing rate, or refusing all fluids.',
    },
    es: {
      whatItIs:
        'La neumonía es una infección (por bacteria o virus) en los pulmones que llena los sacos de aire con líquido, haciendo más difícil respirar. Causa fiebre, tos, y respiración rápida o trabajosa.',
      recovery:
        'Con antibióticos (si es bacteriana), normalmente se sienten mejor en 48 horas y se recuperan en 1–2 semanas, aunque la tos puede durar 3–4 semanas. Termina cada dosis del antibiótico aunque ya se sienta bien. Líquidos y descanso. Humidificador de vapor frío en la noche.',
      schoolReturn:
        'Puede regresar después de al menos 24 horas sin fiebre y sin medicina, cuando tiene energía para todo el día y la respiración volvió a ser normal — normalmente 5–7 días. La tos sola está bien si va mejorando.',
      callDoctor:
        'Llama al 911 si los labios se ven azules, las costillas se hunden al respirar, o no mejora nada 48 horas después de empezar el antibiótico. Llama al doctor si la fiebre regresa después de haberse ido, respira más rápido, o si rechaza todos los líquidos.',
    },
  },

  'Seizure Disorder': {
    en: {
      whatItIs:
        'A seizure is a sudden burst of unusual electrical activity in the brain. It can look like staring spells, jerking movements, stiffness, or loss of awareness. A "seizure disorder" (epilepsy) means the seizures are likely to happen again.',
      recovery:
        'The daily seizure medicine is the most important part — give it at the exact same times every day, even one missed dose can trigger a seizure. Keep a seizure diary (date, time, length, what it looked like). Most kids on the right medicine become seizure-free.',
      schoolReturn:
        'Your child can usually return after they are back to baseline (sometimes a day or two of rest). Give the school a Seizure Action Plan from the neurologist and the rescue medicine (Diastat or Nayzilam) with a signed permission form. Ask about a 504 plan for extra accommodations.',
      callDoctor:
        'Call 911 for any seizure lasting longer than 5 minutes, a second seizure right after the first, trouble breathing, injury during the seizure, or first-ever seizure. Call the doctor for new side effects from the medicine, missed doses, or seizures that change in pattern.',
    },
    es: {
      whatItIs:
        'Una convulsión es una descarga repentina de actividad eléctrica anormal en el cerebro. Puede verse como mirada fija, sacudidas, rigidez o pérdida del conocimiento. Un "trastorno convulsivo" (epilepsia) significa que es probable que vuelvan a ocurrir.',
      recovery:
        'La medicina diaria es la parte más importante — dásela exactamente a la misma hora cada día, incluso una dosis perdida puede provocar una convulsión. Lleva un diario de convulsiones (fecha, hora, duración, cómo se veía). La mayoría de los niños con la medicina correcta dejan de tener convulsiones.',
      schoolReturn:
        'Normalmente puede regresar cuando vuelve a su estado normal (a veces un día o dos de descanso). Dale a la escuela un Plan de Acción de Convulsiones del neurólogo y la medicina de rescate (Diastat o Nayzilam) con permiso firmado. Pregunta por un plan 504 para adaptaciones.',
      callDoctor:
        'Llama al 911 por cualquier convulsión que dure más de 5 minutos, una segunda convulsión justo después de la primera, dificultad para respirar, lesión durante la convulsión, o la primera convulsión de su vida. Llama al doctor por efectos secundarios nuevos, dosis perdidas, o convulsiones que cambian de patrón.',
    },
  },

  'Type 1 Diabetes - New Onset': {
    en: {
      whatItIs:
        'Type 1 diabetes happens when the body stops making insulin — the hormone that lets sugar move from food into cells for energy. Without insulin, blood sugar gets too high. This is not caused by eating too much sugar or anything you did.',
      recovery:
        'This is a lifelong condition, but kids on insulin live full, active lives. The first weeks are about learning: how to count carbs, give insulin shots, check blood sugar 4+ times a day, and recognize highs and lows. The diabetes team will see you often at first.',
      schoolReturn:
        'Your child can return as soon as they feel well enough — usually within a week of going home. Set up a Diabetes Medical Management Plan (DMMP) with the school nurse before the first day back. Make sure low-sugar snacks (juice, glucose tabs) are in the classroom and the nurse knows how to use a glucagon kit.',
      callDoctor:
        'Call 911 for confusion, seizure, or unable to wake up. Call the diabetes team for blood sugar over 300 with ketones, vomiting that won\'t stop, blood sugar under 70 that won\'t come up after juice, or any illness with fever — sick days change insulin needs.',
    },
    es: {
      whatItIs:
        'La diabetes tipo 1 ocurre cuando el cuerpo deja de producir insulina — la hormona que permite que el azúcar pase de la comida a las células para dar energía. Sin insulina, el azúcar en la sangre sube demasiado. Esto NO es causado por comer demasiada azúcar ni por algo que hiciste.',
      recovery:
        'Es una condición de por vida, pero los niños con insulina viven vidas plenas y activas. Las primeras semanas son para aprender: contar carbohidratos, poner inyecciones de insulina, revisar el azúcar 4 o más veces al día, y reconocer los altos y bajos. El equipo de diabetes los verá seguido al principio.',
      schoolReturn:
        'Puede regresar tan pronto como se sienta bien — normalmente dentro de una semana de salir del hospital. Antes del primer día, organiza un Plan de Manejo Médico de Diabetes (DMMP) con la enfermera de la escuela. Asegúrate de que haya bocadillos con azúcar (jugo, pastillas de glucosa) en el salón y que la enfermera sepa usar el kit de glucagón.',
      callDoctor:
        'Llama al 911 por confusión, convulsiones, o si no puedes despertarlo/a. Llama al equipo de diabetes por azúcar arriba de 300 con cetonas, vómito que no para, azúcar abajo de 70 que no sube con jugo, o cualquier enfermedad con fiebre — los días de enfermedad cambian las necesidades de insulina.',
    },
  },
};

const GENERIC: { en: ConditionDetail; es: ConditionDetail } = {
  en: {
    whatItIs:
      'Your child was treated and is ready to recover at home. Follow the discharge instructions carefully — they are written for your child\'s specific situation.',
    recovery:
      'Most children recover with rest, fluids, the medicines as prescribed, and time. Healing speed depends on the condition; ask the follow-up doctor what to expect.',
    schoolReturn:
      'In general, kids can return to school once they are fever-free for 24 hours without medicine, eating and drinking normally, and have energy for a full day. Confirm the timeline with the doctor at the follow-up.',
    callDoctor:
      'Call the doctor for any new or worsening symptoms, fever that won\'t go down, signs of dehydration (no pee for 8+ hours, no tears), or anything that worries you. The Summary page lists your child\'s specific warning signs.',
  },
  es: {
    whatItIs:
      'Tu hijo/a fue atendido/a y está listo/a para recuperarse en casa. Sigue las instrucciones de alta con cuidado — están escritas para su situación específica.',
    recovery:
      'La mayoría de los niños se recuperan con descanso, líquidos, las medicinas como se recetaron, y tiempo. La velocidad de la recuperación depende de la condición; pregúntale al doctor de seguimiento qué esperar.',
    schoolReturn:
      'En general, pueden regresar a la escuela cuando llevan 24 horas sin fiebre y sin medicina, comen y beben normal, y tienen energía para todo el día. Confirma con el doctor en la cita de seguimiento.',
    callDoctor:
      'Llama al doctor por cualquier síntoma nuevo o que empeora, fiebre que no baja, señales de deshidratación (sin orinar por 8+ horas, sin lágrimas), o cualquier cosa que te preocupe. La página de Resumen tiene las señales específicas de tu hijo/a.',
  },
};

export function getConditionInfo(diagnosis: string, lang: 'en' | 'es'): ConditionDetail {
  const entry = CONDITION_INFO[diagnosis];
  return entry ? entry[lang] : GENERIC[lang];
}
