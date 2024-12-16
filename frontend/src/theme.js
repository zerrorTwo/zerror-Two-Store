import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#48445c", // Màu chính (ví dụ: màu đen)
    },
    secondary: {
      main: "#000", // Màu phụ (tùy chỉnh theo ý muốn)
    },
    background: {
      default: "#48445c", // Màu nền mặc định
      paper: "#f4f4f4", // Màu nền của các thành phần như Card, Paper
    },
    text: {
      primary: "#000", // Màu chữ chính
      secondary: "#888", // Màu chữ phụ
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", // Font chữ tùy chỉnh
    fontSize: 14, // Kích thước chữ mặc định
  },
});

export default theme;
