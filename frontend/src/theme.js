import { createTheme } from "@mui/material";

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#FCFFC1",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#FB9EC6",
        },
      },
    },
  },
});

export default theme;
