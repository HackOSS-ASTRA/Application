import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#20232C",
    },
    secondary: {
      main: "#388EE3",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#1A1D26",
      paper: "#20232C",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#6b778c",
    },
    highlight: "#FE3E65",
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#20232C",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#FFFFFF",
          },
          "& label.Mui-focused": {
            color: "#FFFFFF",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#FFFFFF",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#FFFFFF",
            },
            "&:hover fieldset": {
              borderColor: "#FFFFFF",
              borderWidth: "0.15rem",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFFFFF",
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "white",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#20232C",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.MuiTableRow-root:hover": {
            backgroundColor: theme.palette.secondary.light,
          },
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.MuiListItem-root:hover": {
            backgroundColor: theme.palette.secondary.light,
          },
        }),
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#1C1C24",
        },
      },
    },
  },
});

export default theme;
