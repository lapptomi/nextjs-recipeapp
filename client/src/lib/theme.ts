"use client";

import { createTheme } from "@mui/material";

// Extend Material-UI's TypeScript types to include custom colors
declare module "@mui/material/styles" {
  interface TypeText {
    primaryLight: string;
    secondaryLight: string;
  }
}

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
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#ed6c02",
      contrastText: "#ffffff", // White text on primary color
    },
    secondary: {
      main: "#000000",
      contrastText: "#ffffff", // White text on secondary color
    },
    info: {
      main: "#ffffff",
    },
    text: {
      primary: "#171717", // Dark text for light backgrounds
      secondary: "#666666", // Secondary dark text
      primaryLight: "#ffffff", // White text for dark backgrounds
      secondaryLight: "#e5e5e5", // Light gray text for dark backgrounds
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: ["-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"].join(
      ","
    ),
  },
});
