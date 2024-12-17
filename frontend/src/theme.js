import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A1A1D", // Màu chính (ví dụ: màu đen)
    },
    secondary: {
      main: "#48445c", // Màu phụ (tùy chỉnh theo ý muốn)
    },
    background: {
      default: "#1A1A1D", // Màu nền mặc định
      paper: "#f4f4f4", // Màu nền của các thành phần như Card, Paper
    },
    text: {
      primary: "#888", // Màu chữ chính
      secondary: "#000", // Màu chữ phụ
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", // Font chữ tùy chỉnh
    fontSize: 14, // Kích thước chữ mặc định
  },
});

export default theme;
