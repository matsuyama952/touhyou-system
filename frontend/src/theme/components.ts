import type { Components, Theme } from '@mui/material/styles';
import { neonGlow } from './palette';

/**
 * Neon White テーマ - コンポーネントオーバーライド
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
        borderRadius: '12px',
        padding: '10px 24px',
        fontWeight: 600,
        transition: 'all 0.3s ease',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: neonGlow.cyan,
          transform: 'translateY(-2px)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #00D4FF 0%, #00A3CC 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #66E5FF 0%, #00D4FF 100%)',
          boxShadow: neonGlow.cyanStrong,
        },
      },
      containedSecondary: {
        background: 'linear-gradient(135deg, #FF0080 0%, #CC0066 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #FF4DA6 0%, #FF0080 100%)',
          boxShadow: neonGlow.magentaStrong,
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
          boxShadow: neonGlow.cyan,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
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
        borderRadius: '12px',
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
          background: 'linear-gradient(90deg, #00D4FF 0%, #FF0080 100%)',
        },
        '& .MuiSlider-rail': {
          opacity: 0.3,
          backgroundColor: '#CCCCCC',
        },
        '& .MuiSlider-thumb': {
          height: 24,
          width: 24,
          backgroundColor: '#FFFFFF',
          border: '3px solid #00D4FF',
          boxShadow: neonGlow.cyan,
          '&:hover, &.Mui-focusVisible': {
            boxShadow: neonGlow.cyanStrong,
          },
        },
        '& .MuiSlider-valueLabel': {
          backgroundColor: '#00D4FF',
          color: '#0A0A0A',
          fontWeight: 600,
          borderRadius: '8px',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorPrimary': {
          background: 'linear-gradient(135deg, #00D4FF 0%, #00A3CC 100%)',
        },
        '&.MuiChip-colorSecondary': {
          background: 'linear-gradient(135deg, #FF0080 0%, #CC0066 100%)',
        },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: '4px',
        height: 8,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
      },
      bar: {
        borderRadius: '4px',
        background: 'linear-gradient(90deg, #00D4FF 0%, #FF0080 100%)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          '&:hover fieldset': {
            borderColor: '#00D4FF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#00D4FF',
            boxShadow: '0 0 0 3px rgba(0, 212, 255, 0.1)',
          },
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
      },
      standardSuccess: {
        backgroundColor: 'rgba(0, 230, 118, 0.1)',
        color: '#00C853',
      },
      standardError: {
        backgroundColor: 'rgba(255, 23, 68, 0.1)',
        color: '#D50000',
      },
      standardWarning: {
        backgroundColor: 'rgba(255, 171, 0, 0.1)',
        color: '#FF8F00',
      },
      standardInfo: {
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        color: '#00A3CC',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#1A1A1A',
        borderRadius: '8px',
        fontSize: '0.75rem',
        padding: '8px 12px',
      },
    },
  },
};
