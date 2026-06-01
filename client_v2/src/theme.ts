import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypeText {
    primaryLight: string;
    secondaryLight: string;
  }
  interface Palette {
    default: Palette["primary"];
  }
  interface PaletteOptions {
    default?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    default: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ed6c02",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#000000",
      contrastText: "#ffffff",
    },
    default: {
      main: "#171717",
      light: "#cfcfcf",
      dark: "#707070",
      contrastText: "#ffffff",
    },
    info: {
      main: "#ffffff",
    },
    text: {
      primary: "#171717",
      secondary: "#666666",
      primaryLight: "#ffffff",
      secondaryLight: "#e5e5e5",
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
          "&:active": { boxShadow: "none" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { backgroundColor: "white" },
      },
    },
  },
});
