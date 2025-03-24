import { Box } from "@mui/material/Box";
import { CircularProgress } from "@mui/material/CircularProgress";

function Loading() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex", // Sử dụng flexbox
        justifyContent: "center", // Căn giữa theo trục ngang
        alignItems: "center", // Căn giữa theo trục dọc
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
}

export default Loading;
