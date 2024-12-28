import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#282830", // Màu chính (ví dụ: màu đen)
    },
    secondary: {
      main: "#48445c", // Màu phụ (tùy chỉnh theo ý muốn)
    },
    background: {
      default: "#1A1A1D", // Màu nền mặc định
      paper: "#f4f4f4", // Màu nền của các thành phần như Card, Paper
    },
    text: {
      primary: "#777", // Màu chữ chính
      secondary: "#FFF", // Màu chữ phụ
      blackColor: "#000", // Màu
    },
    button: {
      backgroundColor: "#EE4899", // Màu nền của nút
      hoverBackgroundColor: "#e681b2",
      error: "#FE0032", // Màu thông báo lỗi
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", // Font chữ tùy chỉnh
    fontSize: 14, // Kích thước chữ mặc định
  },
});

export default theme;
