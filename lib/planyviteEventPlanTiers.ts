import { PricingTier } from '@/core/types';

export const PLANYVITE_EVENT_PLANS: PricingTier[] = [
  {
    id: 'basic',
    type: 'basic',
    name: 'Basic',
    price: 'Gratuit',
    description: 'Testează funcționalitățile gratuit',
    features: [
      '5 răspunsuri',
      'Valabilitate 48h',
      'Editare invitație',
      'Plan locație - Demo',
      'Checklist',
    ],
    cta: 'Cumpără',
    order: 1,
  },
  {
    id: 'premium',
    type: 'premium',
    name: 'Premium',
    price: 249,
    oldPrice: 350,
    description: 'Acces la funcționalitățile de bază',
    features: [
      'Răspunsuri nelimitate',
      'Valabilitate 6 luni',
      'Editare invitație',
      'Plan locație - Demo',
      'Checklist',
    ],
    cta: 'Cumpără',
    order: 2,
    priceId: 'price_1RanVvIYmtfnTY0fzQ0a5e5p',
  },
  {
    id: 'ultimate',
    type: 'ultimate',
    name: 'Ultimate',
    price: 349,
    oldPrice: 450,
    description: 'Acces la toate funcționalitățile platformei',
    features: [
      'Răspunsuri nelimitate',
      'Valabilitate 12 luni',
      'Editare invitație',
      'Plan locație',
      'Așezare la mese',
      'Exportare invitați în Excel',
      'Export plan locație PDF',
      'Checklist',
      'Planificator eveniment avansat',
    ],
    cta: 'Cumpără',
    popular: true,
    order: 3,
    priceId: 'price_1RanWvIYmtfnTY0fY32J21QY',
  },
  {
    id: 'ultimate_upgrade',
    type: 'ultimate',
    name: 'Ultimate',
    price: 100,
    oldPrice: 450,
    description: 'Acces la toate funcționalitățile platformei',
    features: [
      'Răspunsuri nelimitate',
      'Valabilitate 12 luni',
      'Editare invitație',
      'Plan locație',
      'Așezare la mese',
      'Exportare invitați în Excel',
      'Export plan locație PDF',
      'Checklist',
      'Planificator eveniment avansat',
    ],
    cta: 'Cumpără',
    popular: true,
    order: 4,
    priceId: 'price_1RanY8IYmtfnTY0fvDG9pzfI',
  },
];

export const PLANYVITE_EVENT_PLAN_FEATURES = {
  basic: {
    maxGuests: 5,
    maxTablePlanElements: 2,
    nrOfGuestsAvailableInTablePlan: 5,
    allowGifs: false,
    allowCountdown: false,
    // ...other features
  },
  premium: {
    maxGuests: 99999,
    maxTablePlanElements: 2,
    nrOfGuestsAvailableInTablePlan: 5,
    allowGifs: true,
    allowCountdown: true,
    // ...other features
  },
  ultimate: {
    maxGuests: 99999,
    maxTablePlanElements: Infinity,
    nrOfGuestsAvailableInTablePlan: Infinity,
    allowGifs: true,
    allowCountdown: true,
    // ...other features
  },
};

export const PLANYVITE_DIGITAL_PLANNER = {
  id: 'planyvite_digital_planner',
  type: 'digital_planner',
  order: 5,
  priceId: 'price_1RgAqeIYmtfnTY0f4fkyDg9g',
};
