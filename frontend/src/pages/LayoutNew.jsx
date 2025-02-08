import HeaderLayout from "../components/HeaderLayout.jsx";
import { Box, CircularProgress } from "@mui/material";
import { Outlet } from "react-router";
import { lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";

// Lazy load Footer
const Footer = lazy(() => import("../components/Footer.jsx"));

function LayoutNew() {
  const { ref, inView } = useInView({
    triggerOnce: true, // Chỉ kích hoạt một lần khi Footer vào viewport
    threshold: 0.5, // Kích hoạt khi ít nhất 50% Footer vào viewport
  });

  return (
    <>
      <HeaderLayout />
      <Box mt={12}>
        <Outlet />
      </Box>

      {/* Lazy load Footer when it's in view */}
      <Suspense
        fallback={
          <CircularProgress sx={{ display: "block", margin: "auto" }} />
        }
      >
        <div ref={ref}>{inView && <Footer />}</div>
      </Suspense>
    </>
  );
}

export default LayoutNew;
