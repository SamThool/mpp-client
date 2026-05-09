import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a', // Deep slate for primary (modern)
      light: '#334155',
      dark: '#020617',
    },
    secondary: {
      main: '#3b82f6', // Bright blue for accents
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f8fafc', // Very light slate background
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e2e8f0', // Soft dividers
  },
  shape: {
    borderRadius: 16, // Softer, rounder corners
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }, // Modern buttons without uppercase
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly less round than cards
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0', // Tailwind slate-200
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Subtle shadow
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
          backdropFilter: 'blur(12px)', // Frosted glass effect
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          margin: '4px 12px',
          borderRadius: 8,
          padding: '8px 12px',
          '&.Mui-selected': {
            backgroundColor: '#eff6ff', // faint blue (blue-50)
            color: '#1d4ed8', // dark blue
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#dbeafe', // slightly darker faint blue (blue-100)
          },
        },
      },
    },
  },
})

