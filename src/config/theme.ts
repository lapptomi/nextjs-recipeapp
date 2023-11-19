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
  },
  palette: {
    primary: {
      main: '#ed6c02',
    },
    secondary: {
      main: '#2196f3',
    },
    info: {
      main: '#fff'
    },
  },
  typography: {
    fontSize: 12,
  },
});