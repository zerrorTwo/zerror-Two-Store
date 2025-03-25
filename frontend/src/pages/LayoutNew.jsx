import { lazy, Suspense, useEffect, useRef, useState, memo } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Outlet } from "react-router";
import HeaderLayout from "../components/HeaderLayout.jsx";

// Memoize HeaderLayout
const MemoizedHeader = memo(HeaderLayout);

// Lazy load Footer and memoize it
const Footer = lazy(() => 
  import("../components/Footer.jsx").then(module => {
    // Memoize the Footer component when it's loaded
    return { default: memo(module.default) };
  })
);

function LayoutNew() {
  const footerContainerRef = useRef(null);
  const [shouldLoadFooter, setShouldLoadFooter] = useState(false);

  useEffect(() => {
    const footerContainer = footerContainerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadFooter(true);
          observer.disconnect(); // Ngắt kết nối sau khi đã vào viewport
        }
      },
      {
        threshold: 0.1, // Kích hoạt khi chỉ cần 10% container vào viewport
      }
    );

    if (footerContainer) {
      observer.observe(footerContainer);
    }

    return () => {
      if (footerContainer) {
        observer.unobserve(footerContainer);
      }
    };
  }, []);

  return (
    <>
      <MemoizedHeader />
      <Box mt={12}>
        <Outlet />
      </Box>

      {/* Container rỗng sẽ được quan sát */}
      <div ref={footerContainerRef} style={{ minHeight: '50px' }}>
        {/* Lazy load Footer khi container vào view */}
        {shouldLoadFooter && (
          <Suspense fallback={<CircularProgress sx={{ display: "block", margin: "auto" }} />}>
            <Footer />
          </Suspense>
        )}
      </div>
    </>
  );
}

export default LayoutNew;