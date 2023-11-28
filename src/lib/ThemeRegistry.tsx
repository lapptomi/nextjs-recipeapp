"use client";

import * as React from 'react';

import { ThemeProvider } from '@mui/material/styles';

import { theme } from './theme';

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

export default ThemeRegistry;