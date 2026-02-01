"use client";

import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "10px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          padding: "8px 12px",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ed6c02",
    },
    info: {
      main: "#ffffff",
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: ["-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"].join(
      ","
    ),
  },
});
