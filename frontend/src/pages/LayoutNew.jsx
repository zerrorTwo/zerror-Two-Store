import  HeaderLayout  from "../components/HeaderLayout.jsx";
import  Box  from "@mui/material/Box";
import  CircularProgress  from "@mui/material/CircularProgress";
import  {Outlet}  from "react-router";
import  { lazy, Suspense, useEffect, useRef, useState }  from "react";

// Lazy load Footer
const Footer = lazy(() => import("../components/Footer.jsx"));

function LayoutNew() {
  const footerRef = useRef(null);
  const [isFooterInView, setIsFooterInView] = useState(false);

  useEffect(() => {
    const currentFooterRef = footerRef.current; // Lưu trữ giá trị của ref vào biến

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFooterInView(true);
          observer.disconnect(); // Ngắt kết nối sau khi đã vào viewport
        }
      },
      {
        threshold: 0.5, // Kích hoạt khi ít nhất 50% Footer vào viewport
      }
    );

    if (currentFooterRef) {
      observer.observe(currentFooterRef);
    }

    return () => {
      if (currentFooterRef) {
        observer.unobserve(currentFooterRef);
      }
    };
  }, []);

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
        <div ref={footerRef}>{isFooterInView && <Footer />}</div>
      </Suspense>
    </>
  );
}

export default LayoutNew;
