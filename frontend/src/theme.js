import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg", // Có thể đổi thành "xs", "sm", "md", "lg", "xl" hoặc false
      },
      styleOverrides: {
        maxWidthLg: {
          maxWidth: "1356px !important", // Đặt maxWidth tùy ý
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            "radial-gradient(circle, rgba(201,74,0,1) 0%, rgba(201,90,0,1) 35%, rgba(201,110,0,1) 100%)", // Apply the radial gradient to the background property
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#FFF", // Màu chính (ví dụ: màu đen)
    },
    secondary: {
      main: "#C94A00", // Màu phụ (tùy chỉnh theo ý muốn)
    },
    background: {
      default: "#FFF", // Màu nền mặc định
      paper: "#f4f4f4", // Màu nền của các thành phần như Card, Paper
    },
    text: {
      primary: "#999", // Màu chữ chính
      secondary: "#000", // Màu chữ phụ
      blackColor: "#000", // Màu
      hover: "#e3e1e1", // Màu
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
