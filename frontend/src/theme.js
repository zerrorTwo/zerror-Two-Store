import { createTheme } from "@mui/material/styles";

// Định nghĩa bảng màu chính
const primaryColor = "#C94A00"; // Màu chủ đạo cam
const secondaryColor = "#FF8534"; // Màu cam nhạt hơnC94A00

// Tạo theme với đầy đủ các cấu hình theo Material Design
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  // Cấu hình palette chuyên nghiệp
  palette: {
    mode: "light",
    primary: {
      main: primaryColor,
      light: "#E86A17",
      dark: "#A83C00",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: secondaryColor,
      light: "#FFA864",
      dark: "#CC6A00",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#cc0000",
      light: "#FF3D64",
      dark: "#D10029",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FF9800",
      light: "#FFB547",
      dark: "#C77700",
      contrastText: "#000000",
    },
    info: {
      main: "#2196F3",
      light: "#64B6F7",
      dark: "#0B79D0",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#4CAF50",
      light: "#7BC67E",
      dark: "#3B873E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F5F5F5",
    },
    text: {
      primary: "#333333", // Màu chữ chính
      secondary: "#666666", // Màu chữ phụ
      disabled: "#999999",
      hint: "#AAAAAA",
    },
    divider: "rgba(0, 0, 0, 0.12)",
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(201, 74, 0, 0.08)", // Hover với màu chủ đạo
      hoverOpacity: 0.08,
      selected: "rgba(201, 74, 0, 0.16)", // Selected với màu chủ đạo
      selectedOpacity: 0.16,
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      focus: "rgba(201, 74, 0, 0.12)", // Focus với màu chủ đạo
      focusOpacity: 0.12,
    },
  },
  // Typography scales theo Material Design
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 300,
      fontSize: "6rem", // 96px
      lineHeight: 1.167,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontWeight: 300,
      fontSize: "3.75rem", // 60px
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontWeight: 400,
      fontSize: "3rem", // 48px
      lineHeight: 1.167,
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 400,
      fontSize: "2.125rem", // 34px
      lineHeight: 1.235,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontWeight: 400,
      fontSize: "1.5rem", // 24px
      lineHeight: 1.334,
      letterSpacing: "0em",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.25rem", // 20px
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: "1rem", // 16px
      lineHeight: 1.75,
      letterSpacing: "0.00938em",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.57,
      letterSpacing: "0.00714em",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem", // 16px
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
    },
    button: {
      fontWeight: 500,
      fontSize: "0.875rem", // 14px
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "uppercase",
    },
    caption: {
      fontWeight: 400,
      fontSize: "0.75rem", // 12px
      lineHeight: 1.66,
      letterSpacing: "0.03333em",
    },
    overline: {
      fontWeight: 400,
      fontSize: "0.75rem", // 12px
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase",
    },
  },
  // Shadows
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
  ],
  // Spacing
  spacing: 8, // Base spacing unit 8px
  // Shape
  shape: {
    borderRadius: 4,
  },
  // Custom styling cho các component
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
      styleOverrides: {
        maxWidthLg: {
          maxWidth: "1200px !important",
          "@media (min-width: 1200px)": {
            maxWidth: "1200px",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 22px",
        },
        contained: {
          boxShadow: "0 4px 10px 0 rgba(201, 74, 0, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 15px 0 rgba(201, 74, 0, 0.35)",
          },
        },
        outlined: {
          borderColor: primaryColor,
          color: primaryColor,
          "&:hover": {
            borderColor: primaryColor,
          },
        },
        text: {
          "&:hover": {
            backgroundColor: "rgba(201, 74, 0, 0.04)",
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            color: "#FFFFFF",
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            // "&:hover fieldset": {
            //   borderColor: primaryColor,
            // },
            // "&.Mui-focused fieldset": {
            //   borderColor: primaryColor,
            // },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 8px 16px 0 rgba(0,0,0,0.05)",
          overflow: "hidden",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: primaryColor,
          color: "#FFFFFF",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          "&.Mui-selected": {
            color: primaryColor,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0 2px 10px 0 rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#333333",
          backgroundColor: "#F5F5F5",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(201, 74, 0, 0.08)",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(33, 33, 33, 0.9)",
          fontWeight: 400,
          fontSize: "0.75rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: primaryColor,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: primaryColor,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: primaryColor,
          "&.Mui-checked": {
            color: primaryColor,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: primaryColor,
          "&.Mui-checked": {
            color: primaryColor,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: primaryColor,
          color: "#FFFFFF",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: primaryColor,
        },
      },
    },
  },
});

export default theme;
