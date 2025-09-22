// Centralized theme for DriverApp inspired by the provided design
// Palette: soft mint background, deep navy headers/buttons, white cards, subtle grays,
// with green and yellow accents for statuses.

export const theme = {
  colors: {
    // Surfaces
    background: '#FFFFFF', // clean white background per BusTrac mock
    card: '#FFFFFF',

    // Brand / Primary
    navy: '#0B1220', // very deep navy/ink for primary
    navyTextOn: '#FFFFFF',

    // Typography
    textPrimary: '#0F172A', // slate-900
    textSecondary: '#64748B', // slate-500

    // UI
    border: '#E5E7EB',
    inputBg: '#FFFFFF',

    // Accents (primary set from reference)
    green: '#22C55E',
    greenBg: '#DCFCE7',
    yellow: '#FACC15',
    yellowBg: '#FEF3C7',

    // Complementary accents (harmonize with navy/mint)
    teal: '#14B8A6',
    tealBg: '#CCFBF1',
    sky: '#38BDF8',
    skyBg: '#E0F2FE',
    coral: '#FB7185', // subtle error/accent
    coralBg: '#FFE4E6',

    // Misc
    muted: '#F1F5F9', // secondary surface for light gray buttons
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
  // Semantic aliases for easier usage
  semantic: {
    primary: { fg: '#0F2238', on: '#FFFFFF' },
    secondary: { fg: '#14B8A6', on: '#053B36' },
    success: { fg: '#22C55E', on: '#052E16' },
    info: { fg: '#38BDF8', on: '#082F49' },
    warning: { fg: '#FACC15', on: '#3F2D15' },
    danger: { fg: '#FB7185', on: '#4C0519' },
  },
} as const;

export type Theme = typeof theme;
