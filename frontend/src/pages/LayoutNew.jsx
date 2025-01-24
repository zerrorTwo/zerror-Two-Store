import HeaderLayout from "../components/HeaderLayout.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router";
import { Box } from "@mui/material";
function LayoutNew() {
  return (
    <>
      <HeaderLayout />
      <Box mt={12}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}

export default LayoutNew;
