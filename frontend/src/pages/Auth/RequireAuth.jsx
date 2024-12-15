import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/features/auth/authSlice";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify"; // Import toast

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Chỉ hiển thị toast nếu không có token và không ở trang đăng nhập
    if (!token && location.pathname !== "/login" && !hasShownToast.current) {
      toast.info("Cần đăng nhập để xem");
      hasShownToast.current = true;
    }
  }, [token, location.pathname]);

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
