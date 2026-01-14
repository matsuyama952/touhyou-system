import type { Components, Theme } from '@mui/material/styles';
import { luxuryShadow } from './palette';

/**
 * Luxury Gold テーマ - コンポーネントオーバーライド
 */
export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#F5F5F5',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#CCCCCC',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#AAAAAA',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '0px',
        padding: '10px 24px',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        fontFamily: '"Playfair Display", serif',
        letterSpacing: '0.1em',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: luxuryShadow.cyan,
          transform: 'translateY(-2px)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #D4AF37 0%, #B8952F 100%)',
        color: '#FFFFFF',
        '&:hover': {
          background: 'linear-gradient(135deg, #E8D5A3 0%, #D4AF37 100%)',
          boxShadow: luxuryShadow.cyanStrong,
        },
      },
      containedSecondary: {
        background: 'linear-gradient(135deg, #333333 0%, #1A1A1A 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #666666 0%, #333333 100%)',
          boxShadow: luxuryShadow.magentaStrong,
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
          boxShadow: luxuryShadow.cyan,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '0px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '0px',
      },
      elevation1: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
      },
      elevation2: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      elevation3: {
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: {
        height: 8,
        '& .MuiSlider-track': {
          border: 'none',
          background: 'linear-gradient(90deg, #D4AF37 0%, #E8D5A3 100%)',
        },
        '& .MuiSlider-rail': {
          opacity: 0.3,
          backgroundColor: '#CCCCCC',
        },
        '& .MuiSlider-thumb': {
          height: 24,
          width: 24,
          backgroundColor: '#FFFFFF',
          border: '3px solid #D4AF37',
          boxShadow: luxuryShadow.cyan,
          '&:hover, &.Mui-focusVisible': {
            boxShadow: luxuryShadow.cyanStrong,
          },
        },
        '& .MuiSlider-valueLabel': {
          backgroundColor: '#D4AF37',
          color: '#000000',
          fontWeight: 600,
          borderRadius: '0px',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '0px',
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorPrimary': {
          background: 'linear-gradient(135deg, #D4AF37 0%, #B8952F 100%)',
        },
        '&.MuiChip-colorSecondary': {
          background: 'linear-gradient(135deg, #333333 0%, #1A1A1A 100%)',
        },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: '0px',
        height: 4,
        backgroundColor: '#E0E0E0',
      },
      bar: {
        borderRadius: '0px',
        background: '#D4AF37',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '0px',
          '&:hover fieldset': {
            borderColor: '#D4AF37',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#D4AF37',
            boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.1)',
          },
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '0px',
      },
      standardSuccess: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#388E3C',
      },
      standardError: {
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        color: '#C62828',
      },
      standardWarning: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        color: '#B8952F',
      },
      standardInfo: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        color: '#B8952F',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#1A1A1A',
        borderRadius: '0px',
        fontSize: '0.75rem',
        padding: '8px 12px',
      },
    },
  },
};
