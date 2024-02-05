import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiTextField:{
      styleOverrides: {
        root: {
          backgroundColor: "white",
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "10px",
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
        }
      }
    },
  },
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ed6c02',
    },
    info: {
      main: '#ffffff',
    },
  },
  typography: {
    fontSize: 14,
  },
});