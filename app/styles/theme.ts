'use client';
import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    brand: Palette['primary'];
    danger: Palette['primary'];
    success: Palette['primary'];
    disable: Palette['primary'];
  }

  interface PaletteOptions {
    brand?: PaletteOptions['primary'];
    danger?: PaletteOptions['primary'];
    success?: PaletteOptions['primary'];
    disable?: PaletteOptions['primary'];
  }

  interface TypeText {
    disable: string; // Custom text color category
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2030CB',
    },
    brand: {
      main: '#B85C38',
      contrastText: '#FFFFF',
    },
    danger: {
      main: '#C12020',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#58A513',
      contrastText: '#FFFFFF',
    },
    disable: {
      main: '#D1D1D1',
      contrastText: '3C3D37',
    },

    text: {
      primary: '#222222',
    },
  },
});

export default theme;
