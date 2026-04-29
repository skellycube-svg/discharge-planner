/* Care to Home Companion - Central Configuration (LL #2: Single Source of Truth) */

const CONFIG = {
  appName: 'Care to Home Companion',
  version: '1.0.0',
  defaultLang: 'en',

  /* Color palette (LL #52: Color-code categories) */
  colors: {
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryDark: '#1E40AF',

    /* Warning sign levels */
    red: '#DC2626',
    redLight: '#FEE2E2',
    redDark: '#991B1B',
    yellow: '#D97706',
    yellowLight: '#FEF3C7',
    yellowDark: '#92400E',
    green: '#16A34A',
    greenLight: '#DCFCE7',
    greenDark: '#166534',

    /* Medication time blocks */
    morning: '#F59E0B',
    afternoon: '#3B82F6',
    evening: '#8B5CF6',
    bedtime: '#6366F1',

    /* Resource categories */
    transportation: '#2563EB',
    food: '#EA580C',
    housing: '#7C3AED',
    financial: '#0D9488',
    diabetes: '#DB2777',
    language: '#4F46E5',
  },

  /* Blood sugar thresholds from DC summary */
  thresholds: {
    bloodSugarLow: 70,
    bloodSugarHigh: 300,
    ketoneCheck: 250,
  },

  /* Touch target minimum (44px per WCAG) */
  minTouchTarget: 44,

  /* Font sizes */
  fonts: {
    body: 16,
    heading: 20,
    label: 13,
    small: 12,
  },

  /* Pharmacy info from DC */
  pharmacy: {
    name: 'Rite Aid Pharmacy #4532',
    phone: '(714) 555-0198',
    refills: 2,
  },

  /* Hospital contact */
  hospital: {
    name: 'CHOC Children\'s Hospital',
    schedulingPhone: '1-888-770-2462',
    nurseLine: '1-844-438-2462',
    address: '1201 West La Veta Avenue, Orange, CA 92868',
    portalUrl: 'www.choc.org/choclink',
  },
};
