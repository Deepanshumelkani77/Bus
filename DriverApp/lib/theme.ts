// Centralized theme for DriverApp inspired by the provided design
// Palette: soft mint background, deep navy headers/buttons, white cards, subtle grays,
// with green and yellow accents for statuses.

export const theme = {
  colors: {
    // Surfaces
    background: '#EAF2EE', // soft mint/grey background
    card: '#FFFFFF',

    // Brand / Primary
    navy: '#0F2238', // deep navy used for headers and primary buttons
    navyTextOn: '#FFFFFF',

    // Typography
    textPrimary: '#0F172A', // slate-900
    textSecondary: '#64748B', // slate-500

    // UI
    border: '#E2E8F0',
    inputBg: '#FFFFFF',

    // Accents
    green: '#22C55E',
    greenBg: '#DCFCE7',
    yellow: '#FACC15',
    yellowBg: '#FEF3C7',

    // Misc
    muted: '#F8FAFC',
    shadow: 'rgba(16, 24, 40, 0.08)'
  },
  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
  },
} as const;

export type Theme = typeof theme;
