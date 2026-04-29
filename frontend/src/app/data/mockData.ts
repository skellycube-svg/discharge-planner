export const patient = {
  name: "Luis",
  caregiverName: "Maria",
};

export const ui = {
  en: {
    nav: { home: "Home", meds: "Meds", visits: "Visits", help: "Help" },
    common: { back: "Back", done: "Done", pending: "To Do" },
    dash: {
       greeting: "Hello",
       caring: "Caring for",
       progress: "Done Today",
       warnings: "Emergency / Warnings",
       callDoc: "Call Doctor",
       schedule: "Today's Schedule",
       morning: "Morning",
       afternoon: "Afternoon",
       evening: "Evening"
    },
    meds: {
      title: "Medicines",
      subtitle: "What to take and when",
      food: "Take with food",
      water: "Drink water",
      drowsy: "Makes you sleepy",
      refill: "Need Refill",
      refilled: "Have Medicine"
    },
    warn: {
      title: "Warning Signs",
      subtitle: "When to get help immediately",
      emergency: "Emergency! Call 911",
      callDoc: "Call Doctor",
      stop: "STOP: Go to Hospital",
      yield: "CAUTION: Call Doctor"
    },
    help: {
      title: "Help & Services",
      subtitle: "Free community support",
      call: "Call",
      web: "Website"
    },
    visits: {
      title: "Appointments",
      subtitle: "Upcoming visits",
      add: "+ Add"
    }
  },
  es: {
    nav: { home: "Inicio", meds: "Medicinas", visits: "Visitas", help: "Ayuda" },
    common: { back: "Volver", done: "Hecho", pending: "Falta" },
    dash: {
       greeting: "Hola",
       caring: "Cuidando a",
       progress: "Hecho Hoy",
       warnings: "Emergencias / Peligro",
       callDoc: "Llamar Doctor",
       schedule: "Horario de Hoy",
       morning: "Mañana",
       afternoon: "Tarde",
       evening: "Noche"
    },
    meds: {
      title: "Medicinas",
      subtitle: "Qué tomar y cuándo",
      food: "Comer algo con la pastilla",
      water: "Beber agua",
      drowsy: "Da sueño",
      refill: "Pedir más",
      refilled: "Tengo Medicina"
    },
    warn: {
      title: "Signos de Alarma",
      subtitle: "Cuándo pedir ayuda rápido",
      emergency: "¡Emergencia! Llame al 911",
      callDoc: "Llamar al Doctor",
      stop: "ALTO: Ir al Hospital",
      yield: "CUIDADO: Llamar Doctor"
    },
    help: {
      title: "Ayuda y Servicios",
      subtitle: "Apoyo gratuito",
      call: "Llamar",
      web: "Sitio Web"
    },
    visits: {
      title: "Citas",
      subtitle: "Próximas visitas médicas",
      add: "+ Añadir"
    }
  }
};

export const scheduleItems = [
  { id: 1, timeOfDay: "morning", time: "8:00 AM", type: "medication", title: { en: "Pain Pill (Oxycodone)", es: "Pastilla para dolor (Oxycodone)" }, subtitle: { en: "1 pill with food", es: "1 pastilla con comida" }, status: "completed" },
  { id: 2, timeOfDay: "morning", time: "10:00 AM", type: "activity", title: { en: "Walk in house", es: "Caminar en casa" }, subtitle: { en: "5 minutes", es: "5 minutos" }, status: "pending" },
  { id: 3, timeOfDay: "afternoon", time: "1:00 PM", type: "medication", title: { en: "Heart Pill (Aspirin)", es: "Pastilla del corazón (Aspirin)" }, subtitle: { en: "1 pill", es: "1 pastilla" }, status: "pending" },
  { id: 4, timeOfDay: "evening", time: "6:00 PM", type: "medication", title: { en: "Stomach Pill (Senna)", es: "Pastilla del estómago (Senna)" }, subtitle: { en: "2 pills", es: "2 pastillas" }, status: "pending" },
];

export const medList = [
  { id: 101, timeOfDay: "morning", amount: 1, color: "orange", title: { en: "Pain Pill (Oxycodone)", es: "Pastilla para dolor (Oxycodone)" }, iconType: "food", note: { en: "Take with food. Makes you sleepy.", es: "Comer algo. Da mucho sueño." }, refilled: true },
  { id: 102, timeOfDay: "afternoon", amount: 1, color: "blue", title: { en: "Heart Pill (Aspirin)", es: "Pastilla del corazón (Aspirin)" }, iconType: "water", note: { en: "Take with water.", es: "Tomar con agua." }, refilled: true },
  { id: 103, timeOfDay: "evening", amount: 2, color: "indigo", title: { en: "Stomach Pill (Senna)", es: "Pastilla del estómago (Senna)" }, iconType: "water", note: { en: "Drink plenty of water.", es: "Beber mucha agua." }, refilled: false },
];

export const warningList = [
  { id: 301, level: "emergency", title: { en: "Chest pain or can't breathe", es: "Dolor en el pecho o no puede respirar" }, action: { en: "Call 911", es: "Llame al 911" } },
  { id: 302, level: "emergency", title: { en: "Fever over 101.5°F", es: "Fiebre más de 101.5°F" }, action: { en: "Call 911", es: "Llame al 911" } },
  { id: 303, level: "warning", title: { en: "Redness or pus at cut", es: "Rojo o pus en la herida" }, action: { en: "Call Doctor: (555) 123-4567", es: "Llamar Doctor: (555) 123-4567" } },
  { id: 304, level: "warning", title: { en: "Lots of pain", es: "Mucho dolor" }, action: { en: "Call Doctor: (555) 123-4567", es: "Llamar Doctor: (555) 123-4567" } },
];

export const resourcesList = [
  { id: 401, category: { en: "Free Rides", es: "Viajes Gratis" }, name: "MediRide", desc: { en: "Free ride to doctor appointments.", es: "Viaje gratis a citas médicas." }, phone: "(555) 999-0123" },
  { id: 402, category: { en: "Free Food", es: "Comida Gratis" }, name: "Meals on Wheels", desc: { en: "Free meals brought to your home.", es: "Comida gratis llevada a su casa." }, phone: "(555) 888-4444" },
];

export const appointmentsList = [
  { id: 201, title: { en: "Doctor Visit", es: "Visita al Doctor" }, doctor: "Dr. Elena Rossi", date: "2026-05-12T10:00:00", location: { en: "Orthopedic Center", es: "Centro Ortopédico" }, status: "confirmed" },
  { id: 202, title: { en: "Physical Therapy", es: "Terapia Física" }, doctor: "Sarah Jenkins", date: "2026-05-01T14:00:00", location: { en: "Home", es: "Casa" }, status: "pending" },
];
