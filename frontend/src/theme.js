import { createTheme } from "@mui/material";

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: "#3f51b5",
          main: "#000",
          dark: "#283593",
        },
      },
    },
    dark: {
      palette: {
        gradient:
          "linear-gradient(to left, var(--mui-palette-primary-light), var(--mui-palette-primary-main))",
        border: {
          subtle: "var(--mui-palette-neutral-600)",
        },
      },
    },
  },
});

export default theme;
